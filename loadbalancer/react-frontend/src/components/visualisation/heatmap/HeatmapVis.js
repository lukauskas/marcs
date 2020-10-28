import React, { PureComponent } from 'react';
import {
    headerVisualMap, headerXAxis, headerYAxis, headerSeries,
} from 'components/visualisation/heatmap/styling/header';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { mainHeatmapSeries, mainHeatmapVisualMap, heatmapYAxis } from 'components/visualisation/heatmap/styling/heatmap';
import PropType from 'prop-types';
import HelpQuestionMark from 'components/common/HelpQuestionMark';
import ErrorToast from 'components/error/ErrorToast';
import ReactEcharts from 'echarts-for-react';
import { annotationSeries, annotationVisualMap, annotationXAxis } from './styling/annotation';

import {
    legendColormap,
    legendColorVisualMap,
    legendLabels, legendSizeMap,
    legendXAxis,
    legendYAxis,
    legendDirectionality,
} from './styling/legend';
import { tooltipFormatter } from './styling/tooltip';

import { GRID_BORDER_COLOR } from './styling/grid';


export default class HeatmapVis extends PureComponent {
    constructor(props) {
        super(props);
        this.echartsInstance = null;
    }

    initialiseEcharts = (e) => {
        // Sometimes happens when we delete a chart
        if (e === null) {
            return;
        }

        const instance = e.getEchartsInstance();

        this.echartsInstance = instance;
    };

    paddingTop = () => 50;

    paddingBottom = () => 200;

    spacerVertical = () => 10;

    spacerHorizontal = () => 10;

    // mainWidth = () => 650;
    mainWidth = () => {
        const {
            selectedPullDowns,
        } = this.props;

        // Exactly 650 for 55 (rounding errors might give weird shapes)
        if (selectedPullDowns.length === 55) return 650;
        // 11.82 as it is 650/55
        return Math.round(11.82 * selectedPullDowns.length);
    };

    sideWidth = () => 200;

    annotationsWidth = () => {
        const { annotationOrder } = this.props;
        return annotationOrder.length * 20;
    };

    headerHeight = () => 200;

    mainHeight = () => {
        const { selectedProteins } = this.props;
        return selectedProteins.length * 20;
    };

    paddingLeft = () => 150;

    paddingRight = () => 10;

    totalHeight = () => (this.paddingTop() + this.spacerVertical()
        + this.mainHeight() + this.headerHeight() + this.paddingBottom());

    totalWidth = () => (this.paddingLeft() + this.mainWidth() + this.spacerHorizontal()
        + Math.max(this.sideWidth(), this.annotationsWidth()) + this.paddingRight());

    getOption = () => {
        const {
            selectedPullDowns: pullDownOrder,
            selectedProteins: proteinOrder,
            data,
            dataAnnotation,
            annotationXLabel,
            annotationOrder,
        } = this.props;

        const pdDataset = [
            {
                dimensions: ['pd', 'protein',
                    'ratio_forward',
                    'ratio_reverse',
                    // 'imputation_type', 'peptides_forward', 'peptides_reverse',
                    // 'unique_peptides_forward', 'unique_peptides_reverse',
                ],
                source: data,
            },
            {
                dimensions: ['protein', annotationXLabel],
                source: dataAnnotation,
            },
        ];

        return {
            title: {},
            dataset: pdDataset,
            textStyle: {
                fontFamily: 'Helvetica,sans-serif',
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        name: 'marcs-heatmap',
                        title: 'PNG',
                        pixelRatio: 4,
                    },
                },
                left: 'left',
                top: 0,
            },
            tooltip: {
                show: true,
                formatter: tooltipFormatter,
                backgroundColor: 'rgba(255,255,255,0.9)',
                extraCssText: 'color: black;',
                confine: true,
            },
            visualMap: [
                headerVisualMap(0, this.paddingLeft()),
                mainHeatmapVisualMap(true, 1),
                mainHeatmapVisualMap(false, 2),
                annotationVisualMap(annotationXLabel, annotationOrder, 3),
                legendColorVisualMap(4),
            ],
            grid: [
                {
                    id: 'heatmap-header',
                    left: this.paddingLeft(),
                    top: this.paddingTop(),
                    width: this.mainWidth(),
                    height: this.headerHeight(),
                    show: true,
                    borderColor: GRID_BORDER_COLOR,
                    backgroundColor: '#F8FCF1',
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                    },
                },
                {
                    id: 'heatmap-main',
                    left: this.paddingLeft(),
                    top: this.paddingTop() + this.spacerVertical() + this.headerHeight(),
                    height: this.mainHeight(),
                    width: this.mainWidth(),
                    show: true,
                    borderColor: GRID_BORDER_COLOR,
                    backgroundColor: '#FCFCFC',
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                    },
                },
                {
                    id: 'heatmap-legend',
                    left: this.paddingLeft() + this.mainWidth() + this.spacerHorizontal(),
                    top: this.paddingTop(),
                    width: this.sideWidth(),
                    height: this.headerHeight(),
                },
                {
                    id: 'heatmap-sidebar',
                    left: this.paddingLeft() + this.mainWidth() + this.spacerHorizontal(),
                    top: this.paddingTop() + this.spacerVertical() + this.headerHeight(),
                    width: this.annotationsWidth(),
                    height: this.mainHeight(),
                    show: true,
                    backgroundColor: '#FCFCFC',
                    borderColor: GRID_BORDER_COLOR,
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                    },
                },
            ],
            xAxis: [
                // Pull-Down axis (Header)
                headerXAxis(pullDownOrder, 0, true, true),
                // Pull-Down axis (Main)
                headerXAxis(pullDownOrder, 1, false, false),
                annotationXAxis(annotationOrder, 3),
                legendXAxis(2),
            ],
            yAxis: [
                // Y axis (header)
                headerYAxis(0),
                // Y axis (main)
                heatmapYAxis(proteinOrder, 1, true),
                // Y axis (annotations)
                heatmapYAxis(proteinOrder, 3, false),
                legendYAxis(2),
            ],
            series: [
                headerSeries(0, 0),
                // Ratio Forward
                mainHeatmapSeries(true, 1, 1, 0),
                // Ratio Reverse
                mainHeatmapSeries(false, 1, 1, 0),
                // Annotation series
                annotationSeries(annotationXLabel,
                    2,
                    2,
                    1),
                legendColormap(3, 3),
                legendSizeMap(3, 3),
                legendLabels(3, 3),
                legendDirectionality(true, 3, 3),
                legendDirectionality(false, 3, 3),
            ],
            axisPointer: {
                link: [
                    {
                        xAxisId: ['header-x-0', 'header-x-1'],
                    },
                    {
                        yAxisId: ['heatmap-y-1', 'heatmap-y-3'],
                    },
                ],
            },
        };
    };

    render() {
        const option = this.getOption();

        const { showLoading, errorMessage, onErrorMessageClose } = this.props;

        let loading = null;
        if (showLoading) {
            loading = <Spinner animation="grow" role="status" size="sm" />;
        }

        let error = null;

        if (errorMessage) {
            error = (
                <ErrorToast
                    title="Visualisation failed"
                    errorMessage={errorMessage}
                    onClose={onErrorMessageClose}
                />
            );
        }
        return (
            <Card>
                <Card.Header>
                    {loading}
                    Heatmap visualisation
                    <HelpQuestionMark>
                        <p>
                            Visualisation of the protein responses to  MARCS dinucleosomal library.
                        </p>
                    </HelpQuestionMark>
                </Card.Header>
                <Card.Body className="overflow-auto" style={{ padding: 0 }}>
                    {error}
                    <div className="p-3">
                        <ReactEcharts
                            option={option}
                            style={{ width: this.totalWidth(), height: this.totalHeight() }}
                            ref={this.initialiseEcharts}
                        />
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

HeatmapVis.propTypes = {
    selectedPullDowns: PropType.arrayOf(PropType.string).isRequired,
    selectedProteins: PropType.arrayOf(PropType.string).isRequired,
    showLoading: PropType.bool.isRequired,
    errorMessage: PropType.string.isRequired,
    onErrorMessageClose: PropType.func.isRequired,
    data: PropType.arrayOf(PropType.object).isRequired,
    dataAnnotation: PropType.arrayOf(PropType.object).isRequired,
    annotationXLabel: PropType.string.isRequired,
    annotationOrder: PropType.arrayOf(PropType.string).isRequired,
};
