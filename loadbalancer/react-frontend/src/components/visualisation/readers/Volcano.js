import ReactECharts from "echarts-for-react";
import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import confirmLicenseAndSaveAsImageTool from 'components/visualisation/confirmLicenseAndSaveAsImage';
import { withMatomo } from "../../matomo/WithMatomo";

const FC_THRESHOLD = 1.0;

class Volcano extends PureComponent {

    constructor(props) {
        super(props);
        this.echartsInstance = null;
    }

    getEchartsInstance = () => this.echartsInstance;

    paddingTop = () => 90;

    paddingBottom = () => 50;

    paddingLeft = () => 60;

    paddingRight = () => 10;

    getOption = () => {
        const {
            ptm, dataset: data, highlightType, trackEvent
        } = this.props;

        const dataWithClasses = data.map(row => {
            const newRow = {...row};

            if (!row.significant) {
                newRow.classification = 'N';
            } else {
                if (row.logFC >= FC_THRESHOLD) {
                    newRow.classification = 'UU';
                } else if (row.logFC >= 0) {
                    newRow.classification = 'U';
                } else if (row.logFC <= -FC_THRESHOLD) {
                    newRow.classification = 'DD';
                } else {
                    newRow.classification = 'D';
                }
            }
            return newRow;
        });

        const dataset = {
            source: dataWithClasses,
        };

        let opacityModifierRecruited = 1.0;
        let opacityModifierExcluded = 1.0;
        let opacityModifierOther = 1.0;

        if (highlightType === 'recruited') {
            opacityModifierExcluded = 0.1;
            opacityModifierOther = 0.1;
        } else if (highlightType === 'excluded') {
            opacityModifierRecruited = 0.1;
            opacityModifierOther = 0.1;
        }

        // const dataset = [];
        return {
            title: {
            },
            textStyle: {
                fontFamily: 'Helvetica,sans-serif',
            },
            dataset,
            toolbox: {
                feature: {
                    mySaveAsImage: confirmLicenseAndSaveAsImageTool(
                        this.getEchartsInstance, 
                        trackEvent,
                        "marcs-feature-effects-volcano"
                    ),
                },
            },
            grid: {
                show: false,
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
                name: `${ptm} effect to log H/L ratio`,
                nameLocation: 'middle',
                axisLine: {
                    lineStyle: {
                        width: 2,
                    },
                },
                nameGap: 25,
            },
            yAxis: {
                type: 'value',
                name: '-log10(q value)',
                nameLocation: 'middle',
                splitLine: {
                    show: false,
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
                nameGap: 25,
            },
            visualMap: [
                {
                    type: 'piecewise',
                    categories: ['DD', 'D', 'N', 'U', 'UU'],
                    dimension: 'classification',
                    inRange: {
                        color: ['#2166ac', '#67a9cf',
                                '#666666',
                                '#ef8a62', '#b2182b'],
                        opacity: [
                            1.0 * opacityModifierExcluded,
                            0.7 * opacityModifierExcluded,
                            0.3 * opacityModifierOther,
                            0.7 * opacityModifierRecruited,
                            1.0 * opacityModifierRecruited],
                    },
                    z: 4,
                    seriesIndex: 0,
                    show: false,
                },
            ],
            series: [
                // Other
                {
                    type: 'scatter',
                    encode: {
                        x: 'logFC',
                        y: 'neg_log10_p_adjust',
                        itemId: 'protein',
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
                    tooltip: {
                            formatter: function (params, ticket, callback) {
                                const { protein, logFC, confint_half_width: plusMinus, neg_log10_p_adjust: logQValue} = params.data;
                                const qValue = (10**(-logQValue)).toExponential(4);

                                return `${protein}: ${logFC} (± ${plusMinus}), q=${qValue}`;
                            }
                    },
                    datasetIndex: 0,
                },
            ],
        };
    };

    onMouseOver = (event) => {
        // this.echartsInstance.dispatchAction({ type: 'highlight', dataIndex: event.dataIndex });
    };

    onMouseOut = (event) => {
        // this.echartsInstance.dispatchAction({ type: 'downplay', dataIndex: event.dataIndex });
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

Volcano.propTypes = {
    dataset: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartGroup: PropTypes.string,
    ptm: PropTypes.string.isRequired,
    className: PropTypes.string,
    highlightType: PropTypes.string,
};

Volcano.defaultProps = {
    chartGroup: null,
    proteinHighlights: {},
    className: null,
    highlightType: 'none',
};

export default withMatomo(Volcano);