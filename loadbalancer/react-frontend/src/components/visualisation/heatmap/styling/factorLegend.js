import {
    GLYPH_HALF_CIRCLE_RIGHT,
    GLYPH_HALF_CIRCLE_LEFT,
    TRANSPARENT_PIXEL,
} from 'data/glyphs';

import {
    HEATMAP_ABSMAX,
    HEATMAP_COLOR_RANGE_REVERSE,
    SIGNIFICANT_SIZE,
    calculateSymbolSize,
} from './factorheatmap';

export function factorLegendXAxis(gridIndex) {
    return {
        id: 'legend-x',
        type: 'value',
        axisTick: {
            show: false,
        },
        min: -1,
        max: 11,
        axisLabel: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        splitLine: {
            show: false,
        },
        gridIndex,
    };
}

export function factorLegendYAxis(gridIndex) {
    return {
        id: 'legend-y',
        type: 'value',
        axisTick: {
            show: false,
        },
        min: 3,
        max: 13,
        axisLabel: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        splitLine: {
            show: false,
        },
        gridIndex,
    };
}

// Row with colormap

export function factorLegendColormap(xAxisIndex, yAxisIndex) {
    const yPos = 8.8;
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        symbol: 'circle',
        symbolSize: SIGNIFICANT_SIZE * 1.5,
        data: [
            [0.5, yPos, -HEATMAP_ABSMAX],
            [2, yPos, -0.6],
            [3.5, yPos, -0.3],
            [5, yPos, 0],
            [6.5, yPos, 0.3],
            [8, yPos, 0.6],
            [9.5, yPos, HEATMAP_ABSMAX],
        ],
        silent: true,
        label: {
            show: true,
            position: 'top',
            formatter: '{@[2]}',
            color: '#000000',
        },
    };
}


export function factorLegendColorVisualMap(seriesIndex) {
    return {
        seriesIndex,
        type: 'continuous',
        dimension: 2,
        min: -HEATMAP_ABSMAX,
        max: HEATMAP_ABSMAX,
        precision: 2,
        realtime: false,
        inRange: {
            color: HEATMAP_COLOR_RANGE_REVERSE,
        },
        outOfRange: {
            color: HEATMAP_COLOR_RANGE_REVERSE,
        },
        show: false,
    };
}

export function factorLegendSizeMap(xAxisIndex, yAxisIndex) {
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        symbol: 'circle',
        data: [
            [1, 6.4, 0.2, '<0.3'],
            [2.5, 6.4, 0.3, ''],
            [4, 6.4, 0.4, '≥0.4'],
        ],
        color: '#000000',
        silent: true,
        label: {
            // Do not show as the labels are not aligned by size .. :/
            show: false,
            position: 'bottom',
            formatter: '{@[3]}',
            color: '#000000',
        },
        symbolSize: data => calculateSymbolSize(data[2]),
    };
}

export function factorLegendDirectionality(isForward, xAxisIndex, yAxisIndex) {

    const xPos = isForward ? 9.5 : 7.5;
    const glyph = isForward ? GLYPH_HALF_CIRCLE_RIGHT : GLYPH_HALF_CIRCLE_LEFT;
    const label = isForward ? 'Fwd.' : 'Rev.';
    const offset = isForward ? [2, 0] : [-2, 0];

    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        symbol: glyph,
        data: [
            [xPos, 6.4, label],
        ],
        color: '#000000',
        silent: true,
        label: {
            show: true,
            formatter: '{@[2]}',
            color: '#000000',
            position: 'bottom',
        },
        symbolSize: SIGNIFICANT_SIZE,
        symbolKeepAspect: true,
        symbolOffset: offset,
    };
}

export function factorLegendLabels(xAxisIndex, yAxisIndex) {
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        symbol: TRANSPARENT_PIXEL,
        // symbolSize: MAX_SYMBOL_SIZE * 1.5,
        data: [
            [5, 10, 'Factor loading'],
            [2.5, 6.5, 'Absolute loading'],
            [1.0, 4.8, '< 0.3'],
            [2.5, 4.8, ''],
            [4, 4.8, '≥ 0.4'],
            [8.5, 6.5, 'Experiment'],
        ],
        silent: true,
        label: {
            show: true,
            position: 'top',
            formatter: '{@[2]}',
            color: '#000000',
        },
    };
}

