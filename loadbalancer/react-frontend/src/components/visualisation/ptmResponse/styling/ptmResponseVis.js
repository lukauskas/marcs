import { PTM_PREDICTOR_ORDER, PTM_PREDICTORS } from 'data/ptms';
import React from "react";
import ptmTooltipFormatter from "./PTMResponseTooltip";

const PROTEIN_COLOR = '#4E8BB5';
const HIGHLIGHT_COLOR = '#BE5845';

// https://echarts.apache.org/examples/en/editor.html?c=custom-profile
function renderConfidenceInterval(params, api) {

    const categoryIndex = api.value(0);
    const middle = api.value(1);
    const halfWidth = api.value(2);

    const start = api.coord([middle-halfWidth, categoryIndex]);
    const end = api.coord([middle+halfWidth, categoryIndex]);

    // TODO: these are deprecated but no solution on how to replace them..
    const style = api.style();
    const emphasisStyle = api.styleEmphasis();
    const seriesName = params.seriesName;

    style['stroke'] = style['fill'];
    emphasisStyle['stroke'] = emphasisStyle['fill'];

    const retVal = {
        type: 'line',
        shape: {
            x1: start[0],
            x2: end[0],
            y1: start[1],
            y2: end[1],
        },
        style,
        styleEmphasis: emphasisStyle,
        seriesName,
    };

    return retVal;
}

export function ptmResponseYAxis(paddingLeft) {
    const paddingLeftDiff = 10;

    return {
        type: 'category',
        data: PTM_PREDICTOR_ORDER,
        id: 'ptm-scores-y',
        axisTick: {
            show: false,
        },
        axisLabel: {
            interval: 0,
            show: true,
            // formatter: (f) => {
            //     const name = FACTORS[f].name;
            //     return `${f}: ${name}`;
            // }
        },
        axisLine: {
            show: false,
            onZero: false,
        },
        // axisPointer: {
        //     show: true,xAxis.axisPointer.label.precision
        //     type: 'shadow',
        // },
        nameLocation: 'middle',
        nameRotate: 90,
        inverse: true,

        // This offsets the grid padding
        offset: paddingLeftDiff,
    };
}

export function ptmResponseXAxis(xMin, xMax) {
    const padding = 0.25;

    const minBound = Math.min(-padding, xMin - padding).toFixed(2);
    const maxBound = Math.max(padding, xMax + padding).toFixed(2);

    return {
        type: 'value',
        id: 'ptm-scores-x',
        // axisTick: {
        //     show: false,
        // },
        axisLabel: {
            interval: 0,
            show: true,
        },
        axisLine: {
            show: false,
        },
        min: minBound,
        max: maxBound,
        name: 'PTM contribution to H/L ratio (log2)',
        nameLocation: 'middle',
        // position: 'top',
        nameGap: 25,
        boundaryGap: ['100%', '0%'],
        splitLine: {
            show: false,
        },
    };
}

export function ptmResponseErrorbars(proteinRow, xAxisIndex = 0, yAxisIndex = 0) {
    const { protein } = proteinRow;

    const lineSeries = {
        type: 'custom',
        id: `ptm-scores-errorbars-${protein}`,
        name: protein,
        xAxisIndex,
        yAxisIndex,
        renderItem: renderConfidenceInterval,
        // symbol: 'circle',
        // symbolSize: 8,
        emphasis: {
            itemStyle: {
                color: HIGHLIGHT_COLOR,
                opacity: 1.0,
                borderWidth: 3,
            },
        },
        itemStyle: {
            opacity: 0.0,
        },
        z: 3,
        silent: true,
        data: PTM_PREDICTOR_ORDER.map((f, i) => {
            const { logFC, confint_half_width} = proteinRow[f];
            const ans =  [i, logFC, confint_half_width];
            return ans;
        }),
    };

    return lineSeries;
}

export function ptmResponseProteinSeries(proteinRow, xAxisIndex = 0, yAxisIndex = 0) {
    const { protein } = proteinRow;

    const lineSeries = {
        type: 'scatter',
        id: `ptm-scores-scatter-${protein}`,
        name: protein,
        xAxisIndex,
        yAxisIndex,
        symbol: 'circle',
        symbolSize: 8,
        emphasis: {
            itemStyle: {
                color: HIGHLIGHT_COLOR,
            }
        },
        itemStyle: {
            color: PROTEIN_COLOR,
            borderColor: '#000000',
            borderWidth: 1,
            opacity: 1.0,
        },
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: ptmTooltipFormatter(protein, proteinRow),
            backgroundColor: 'rgba(255,255,255,0.9)',
            extraCssText: 'color: black; font-size: 0.7em',
            position: [-350, -50],
        },
        data: PTM_PREDICTOR_ORDER.map(f => proteinRow[f].logFC),
    };

    return lineSeries;
}

export function factorBoxplotSeries(data, xAxisIndex = 0, yAxisIndex = 0) {


    const verticalLine = [{ // Vertical line
        xAxis: 0,
        yAxis: 'min',
        label: {
            show: false,
        },
        symbol: 'none',
        lineStyle: {
            color: '#000000',
            type: 'solid',
            width: 2,
        },
    },
    {
        xAxis: 0,
        yAxis: 'max',
        symbol: 'none',
    }];

    return {
        id: 'ptm-boxplots',
        data: data.map(x => x.boxplot),
        type: 'boxplot',
        xAxisIndex,
        yAxisIndex,
        itemStyle: {
            color: PROTEIN_COLOR,
            borderColor: '#000000',
            borderWidth: 1,
            opacity: 0.6,
        },
        markLine: {
            z: 0,
            silent: true,
            data: [verticalLine],
        },
        silent: true,
    };
}
