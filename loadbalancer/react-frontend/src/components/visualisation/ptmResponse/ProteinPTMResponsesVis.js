import React, { PureComponent } from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { quantileSeq } from 'mathjs';

import { PTM_PREDICTOR_ORDER } from 'data/ptms';

import {
    ptmResponseXAxis,
    ptmResponseYAxis,
    factorBoxplotSeries,
    ptmResponseProteinSeries,
    ptmResponseErrorbars,
} from './styling/ptmResponseVis';

function boxPlotBounds(sortedSeries) {
    if (sortedSeries.length === 0) {
        return {
            boxplot: [], min: 0, median: 0, max: 0,
        };
    }

    const quantiles = quantileSeq(sortedSeries, [0.25, 0.5, 0.75], true);
    const boundIQR = 1.5 * (quantiles[2] - quantiles[0]);

    // Find points that are not outliers
    const min = Math.min(quantiles[0], ...sortedSeries.filter(x => x >= quantiles[0] - boundIQR));
    const max = Math.max(quantiles[2], ...sortedSeries.filter(x => x <= quantiles[2] + boundIQR));

    const boxplot = [min, quantiles[0], quantiles[1], quantiles[2], max];
    const dataMin = sortedSeries[0];
    const dataMax = sortedSeries[sortedSeries.length - 1];
    const dataMedian = quantiles[1];

    return {
        boxplot,
        min: dataMin,
        median: dataMedian,
        max: dataMax,
    };
}

class ProteinPTMResponsesVis extends PureComponent {
    constructor(props) {
        super(props);
        this.echartsInstance = null;
    }

    paddingTop = () => 10;

    paddingLeft = () => 150;

    paddingRight = () => 50;

    paddingBottom = () => 50;

    echartsBoxplotSeries = (ptm) => {
        const { data } = this.props;
        const values = data.map(x => x[ptm].logFC)
            .filter(x => x !== undefined)
            .sort((a, b) => (a - b));
        return boxPlotBounds(values);
    };

    getOption = () => {
        const { data } = this.props;


        const boxPlotData = PTM_PREDICTOR_ORDER.map(x => this.echartsBoxplotSeries(x));

        const xMin = Math.min(...boxPlotData.map(x => x.min));
        const xMax = Math.max(...boxPlotData.map(x => x.max));

        const scoreSeries = data.map(x => ptmResponseProteinSeries(x));
        const scoreErrorbars = data.map(x => ptmResponseErrorbars(x));

        return {
            title: {},
            textStyle: {
                fontFamily: 'Helvetica,sans-serif',
            },
            yAxis: ptmResponseYAxis(this.paddingLeft()),
            xAxis: ptmResponseXAxis(xMin, xMax),
            toolbox: {
                saveAsImage: {
                    name: 'factor-scores',
                    title: 'PNG',
                },
            },
            tooltip: {
                show: false,
                trigger: 'item',
            },
            series: [
                factorBoxplotSeries(boxPlotData, 0, 0),
                ...scoreErrorbars,
                ...scoreSeries,
            ],
            grid: {
                left: this.paddingLeft(),
                top: this.paddingTop(),
                right: this.paddingRight(),
                bottom: this.paddingBottom(),
            },
        };
    };

    initialiseECharts = (e) => {
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

     onMouseOver = (event) => {
         this.echartsInstance.dispatchAction({ type: 'highlight', seriesName: event.seriesName });
     };

     onMouseOut = (event) => {
         this.echartsInstance.dispatchAction({ type: 'downplay', seriesName: event.seriesName });
     };

     render() {
         return (
             <ReactECharts
                 option={this.getOption()}
                 style={{
                     width: '100%',
                     height: '100%',
                 }}
                 notMerge
                 ref={this.initialiseECharts}
             />
         );
     }
}

ProteinPTMResponsesVis.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartGroup: PropTypes.string,
};

ProteinPTMResponsesVis.defaultProps = {
    chartGroup: null,
};


export default ProteinPTMResponsesVis;
