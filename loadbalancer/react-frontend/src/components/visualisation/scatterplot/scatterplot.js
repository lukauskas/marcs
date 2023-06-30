import React, { Component, PureComponent } from 'react';
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';
import ReactECharts from 'echarts-for-react';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import PullDownBadges from 'components/common/PullDownBadges';
import parseAxiosError from "../../helpers/parseAxiosError";
import ErrorToast from "../../error/ErrorToast";
import confirmLicenseAndSaveAsImageTool from 'components/visualisation/confirmLicenseAndSaveAsImage';
import {withMatomo} from 'components/matomo/WithMatomo';

function absMax(data) {
    const maxForward = Math.max(...data.map(x => Math.abs(x.ratio_forward)));
    const maxReverse = Math.max(...data.map(x => Math.abs(x.ratio_reverse)));

    return Math.max(maxForward, maxReverse);
}

class PullDownScatterplotVis extends PureComponent {
    constructor(props) {
        super(props);
        this.echartsInstance = null;
    }

    getEchartsInstance = () => this.echartsInstance;

    paddingTop = () => 30;

    paddingBottom = () => 40;

    paddingLeft = () => 60;

    paddingRight = () => 10;

    getOption = () => {
        const {
            dataset, proteinHighlights, pd, absMax, trackEvent,
        } = this.props;
        
        const highlightCategories = Object.keys(proteinHighlights).slice(0);
        const highlightColors = Object.values(proteinHighlights).slice(0);

        return {
            title: {},
            textStyle: {
                fontFamily: 'Helvetica,sans-serif',
            },
            dataset,
            toolbox: {
                feature: {
                    mySaveAsImage: confirmLicenseAndSaveAsImageTool(
                        this.getEchartsInstance, 
                        trackEvent,
                        "marcs-heatmap"
                    ),
                    restore: {
                        show: true,
                        title: 'Reset',
                    },
                },
            },
            dataZoom: {
                type: 'inside',
                xAxisIndex: 0,
                yAxisIndex: 0,
            },
            grid: {
                show: true,
                borderColor: 'black',
                left: this.paddingLeft(),
                top: this.paddingTop(),
                right: this.paddingRight(),
                bottom: this.paddingBottom(),
            },
            tooltip: {
                show: true,
                trigger: 'item',
            },
            xAxis: {
                type: 'value',
                name: 'Log2 ratio H/L forward',
                nameLocation: 'middle',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#666666',
                        opacity: 0.3,
                    },
                },
                axisLine: {
                    lineStyle: {
                        width: 2,
                    },
                },
                min: -absMax,
                max: absMax,
                nameGap: 25,
            },
            yAxis: {
                type: 'value',
                name: 'Log2 ratio H/L reverse',
                nameLocation: 'middle',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#666666',
                        opacity: 0.3,
                    },
                },
                axisLine: {
                    lineStyle: {
                        width: 2,
                    },
                },
                min: -absMax,
                max: absMax,
                nameGap: 25,
            },
            visualMap: [
                {
                    type: 'piecewise',
                    categories: highlightCategories,
                    dimension: 'highlightGroup',
                    inRange: {
                        color: highlightColors,
                        opacity: 1.0,
                    },
                    z: 4,
                    seriesIndex: 1,
                    show: false,
                },
            ],
            series: [
                // Other
                {
                    type: 'scatter',
                    encode: {
                        x: 'ratio_forward',
                        y: 'ratio_reverse',
                        itemId: 'protein',
                        tooltip: ['protein', 'ratio_forward', 'ratio_reverse'],
                    },
                    itemStyle: {
                        color: '#666666',
                        opacity: 0.4,
                    },
                    emphasis: {
                        itemStyle: {
                            color: 'red',
                            opacity: 1.0,
                        },
                    },
                    datasetIndex: 0,
                    z: 2,
                },
                // Highlighted
                {
                    type: 'scatter',
                    encode: {
                        x: 'ratio_forward',
                        y: 'ratio_reverse',
                        itemId: 'protein',
                        tooltip: ['protein', 'ratio_forward', 'ratio_reverse'],
                    },
                    itemStyle: {
                        color: '#666666',
                        opacity: 0.4,
                    },
                    emphasis: {
                        itemStyle: {
                            color: 'red',
                            opacity: 1.0,
                        },
                    },
                    datasetIndex: 1,
                    z: 4,
                },
            ],
        };
    };

    onMouseOver = (event) => {
        this.echartsInstance.dispatchAction({ type: 'highlight', dataIndex: event.dataIndex });
    };

    onMouseOut = (event) => {
        this.echartsInstance.dispatchAction({ type: 'downplay', dataIndex: event.dataIndex });
    };

    initialiseEcharts = (e) => {
        // Sometimes happens when we delete a chart
        if (e === null) {
            return;
        }

        const { chartGroup } = this.props;

        const instance = e.getEchartsInstance();
        this.echartsInstance = instance;
        if (chartGroup !== null) {
            instance.group = chartGroup;
        }

        instance.on('mouseover', 'series.scatter', this.onMouseOver);
        instance.on('mouseout', 'series.scatter', this.onMouseOut);
    };

    render() {
        const { className } = this.props;

        return (
            <ReactECharts
                className={className}
                option={this.getOption()}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                ref={this.initialiseEcharts}
            />
        );
    }
}

PullDownScatterplotVis.propTypes = {
    dataset: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartGroup: PropTypes.string,
    proteinHighlights: PropTypes.objectOf(PropTypes.string),
    pd: PropTypes.string.isRequired,
    className: PropTypes.string,
    absMax: PropTypes.number.isRequired,
};

PullDownScatterplotVis.defaultProps = {
    chartGroup: null,
    proteinHighlights: {},
    className: null,
};

const PullDownScatterplotVisWithMatomo = withMatomo(PullDownScatterplotVis);

class PullDownComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filteredData: [],
            dataAbsMax: 0,
            errorMessage: null,
        };
    }


    getData = () => {
        const { showImputed } = this.props;
        const { data, filteredData } = this.state;

        if (showImputed) return data;
        return filteredData;
    };

    recalculateAbsMax = () => {
        const { reportAbsMaxFunc } = this.props;

        const dataAbsMax = absMax(this.getData());
        this.setState({
            dataAbsMax,
        });
        reportAbsMaxFunc(dataAbsMax);
    };

    mergeData = (response) => {
        if (response.status !== 200) {
            console.error('Response status is not 200? not updating scatterplot.');
            return;
        }

        const responseData = response.data;
        const filteredData = responseData.map((x) => {
            if (x.imputation === 'not imputed') {
                return x;
            }
            const newX = Object.assign({}, x);
            newX.ratio_forward = null;
            newX.ratio_reverse = null;

            return newX;
        });

        this.setState({
            data: responseData,
            filteredData,
        });

        this.recalculateAbsMax();
    };

    componentDidUpdate(prevProps) {
        const { showImputed: prevShowImputed } = prevProps;
        const { showImputed } = this.props;

        if (showImputed !== prevShowImputed) {
            this.recalculateAbsMax();
        }
    }

     handleError = (error) => {
        const errorMessage = parseAxiosError(error);
        this.setState({
            errorMessage,
        });
    };

     clearError = () => {
        this.setState({
            errorMessage: null,
        });
    };

    fetchData = () => {
        const { pd } = this.props;
        const URI = `/api/scatterplot/${pd}`;

        rateLimitedAxios.get(URI).then(
            this.mergeData,
        ).catch(
            this.handleError,
        );
    };

    componentDidMount = () => {
        this.fetchData();
    };

    dataToEchartsDataset() {
        const data = this.getData();
        const { proteinHighlights } = this.props;

        const highlightSet = new Set(Object.keys(proteinHighlights));

        const otherData = data.map((x) => {
            const newX = Object.assign({}, x);

            if (highlightSet.has(x.protein)) {
                newX.highlightGroup = x.protein;
            } else {
                newX.highlightGroup = 'Other';
            }
            return newX;
        });

        const dataHighlighted = otherData.filter(x => x.highlightGroup !== 'Other');
        const dataOther = otherData.filter(x => x.highlightGroup === 'Other');

        const dimensions = ['pd', 'protein', 'ratio_forward', 'ratio_reverse', 'highlightGroup'];

        return [
            {
                dimensions,
                source: dataOther,
            },
            {
                dimensions,
                source: dataHighlighted,
            },
        ];
    }

    render() {
        const {
            pd,
            chartGroup,
            proteinHighlights,
            absMax: absMaxProps,
        } = this.props;

        const { dataAbsMax, errorMessage } = this.state;

        let error = null;
        if (errorMessage !== null) {
            error =  (
                <ErrorToast
                    title="Visualisation failed"
                    errorMessage={errorMessage}
                    onClose={this.clearError}
                />
            );
        }

        const selectedAbsMax = (absMaxProps !== null) ? absMaxProps : dataAbsMax;

        return (
            <Card>
                <Card.Header><PullDownBadges identifier={pd} /></Card.Header>
                <Card.Body style={{ height: 'auto' }} className="p-0">
                    {error}
                    <div className="embed-responsive embed-responsive-1by1">
                        <PullDownScatterplotVisWithMatomo
                            className="embed-responsive-item"
                            dataset={this.dataToEchartsDataset()}
                            chartGroup={chartGroup}
                            pd={pd}
                            absMax={selectedAbsMax}
                            proteinHighlights={proteinHighlights}
                        />
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

PullDownComponent.propTypes = {
    pd: PropTypes.string.isRequired,
    chartGroup: PullDownScatterplotVis.propTypes.chartGroup,
    proteinHighlights: PullDownScatterplotVis.propTypes.proteinHighlights,
    absMax: PropTypes.number,
    reportAbsMaxFunc: PropTypes.func,
    showImputed: PropTypes.bool,
};

PullDownComponent.defaultProps = {
    chartGroup: PullDownScatterplotVis.defaultProps.chartGroup,
    proteinHighlights: PullDownScatterplotVis.defaultProps.proteinHighlights,
    absMax: null,
    reportAbsMaxFunc: () => {},
    showImputed: false,
};

export default (PullDownComponent);
