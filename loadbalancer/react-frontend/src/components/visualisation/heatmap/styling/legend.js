import {
    HEATMAP_ABSMAX,
    HEATMAP_COLOR_RANGE,
    HEATMAP_COLOR_RANGE_REVERSE,
    MAX_SYMBOL_SIZE,
    calculateSymbolSize,
} from './heatmap';

import {
    GLYPH_HALF_CIRCLE_RIGHT,
    GLYPH_HALF_CIRCLE_LEFT,
    TRANSPARENT_PIXEL
} from 'data/glyphs'

export function legendXAxis(gridIndex) {
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

export function legendYAxis(gridIndex) {
    return {
        id: 'legend-y',
        type: 'value',
        axisTick: {
            show: false,
        },
        min: 2,
        max: 12,
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

export function legendColormap(xAxisIndex, yAxisIndex) {
    const yPos = 8.8;
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        symbol: 'circle',
        symbolSize: MAX_SYMBOL_SIZE * 1.5,
        data: [
            [0.5, yPos, -HEATMAP_ABSMAX],
            [2, yPos, -2],
            [3.5, yPos, -1],
            [5, yPos, 0],
            [6.5, yPos, 1],
            [8, yPos, 2],
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


export function legendColorVisualMap(seriesIndex) {
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

export function legendSizeMap(xAxisIndex, yAxisIndex) {
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        symbol: 'circle',
        data: [
            [0.5, 4, 4, '≤4'],
            [1.5, 4, 6, '6'],
            [2.5, 4, 8, '8'],
            [3.5, 4, 10, '≥10'],
        ],
        color: '#000000',
        silent: true,
        label: {
            show: false,
            formatter: '{@[3]}',
            color: '#000000',
        },
        symbolSize: (data) => {
            return calculateSymbolSize(data[2]);
        },
    };
}

export function legendDirectionality(isForward, xAxisIndex, yAxisIndex) {

    const xPos = isForward ? 8.5 : 6.5;
    const glyph = isForward ? GLYPH_HALF_CIRCLE_RIGHT : GLYPH_HALF_CIRCLE_LEFT;
    const label = isForward ? 'Fwd.' : 'Rev.';
    const offset = isForward ? [2, 0] : [-2, 0];

    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        symbol: glyph,
        data: [
            [xPos, 4, label],
        ],
        color: '#000000',
        silent: true,
        label: {
            show: true,
            formatter: '{@[2]}',
            color: '#000000',
            position: 'top',
        },
        symbolSize: MAX_SYMBOL_SIZE,
        symbolKeepAspect: true,
        symbolOffset: offset,
    };
}

export function legendLabels(xAxisIndex, yAxisIndex) {
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        symbol: TRANSPARENT_PIXEL,
        // symbolSize: MAX_SYMBOL_SIZE * 1.5,
        data: [
            [5, 10, 'Ratio Heavy/Light (log2)'],
            [5, 7, '(reverse experiment is inverted)'],
            [2, 5, 'MS1 intensity'],
            [2, 2.5, '(log10)'],
            [0.5, 4, '≤4'],
            [1.5, 4, '6'],
            [2.5, 4, '8'],
            [3.5, 4, '≥10'],
            [7.5, 5, 'Experiment'],
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

