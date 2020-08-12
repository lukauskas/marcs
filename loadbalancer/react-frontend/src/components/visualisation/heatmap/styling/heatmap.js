// eslint-disable-next-line import/no-unresolved
import { GLYPH_HALF_CIRCLE_RIGHT, GLYPH_HALF_CIRCLE_LEFT } from 'data/glyphs';

export const MIN_SYMBOL_SIZE = 3;
export const MAX_SYMBOL_SIZE = 9;

export function calculateSymbolSize(intensity) {
    const minValue = 4;
    const maxValue = 10;

    const minSize = MIN_SYMBOL_SIZE;
    const maxSize = MAX_SYMBOL_SIZE;

    if (intensity <= minValue) {
        return minSize;
    } if (intensity >= maxValue) {
        return maxSize;
    }
    const adjustment = (intensity - minValue) / (maxValue - minValue);
    return (maxSize - minSize) * adjustment + minSize;
}

export function symbolSize(isForward) {
    const field = isForward ? 'log10_intensity_forward' : 'log10_intensity_reverse';

    return (data) => {
        const intensity = data[field];
        return calculateSymbolSize(intensity);
    };
}

export const HEATMAP_ABSMAX = 4;

// Colorbrewer RdBu
export const HEATMAP_COLOR_RANGE = [
    '#67001f',
    '#b2182b',
    '#d6604d',
    '#f4a582',
    '#fddbc7',
    '#f7f7f7',
    '#d1e5f0',
    '#92c5de',
    '#4393c3',
    '#2166ac',
    '#053061',
];

export const HEATMAP_COLOR_RANGE_REVERSE = HEATMAP_COLOR_RANGE.slice().reverse();

export function mainHeatmapVisualMap(isForward, seriesIndex) {
    return {
        seriesIndex,
        type: 'continuous',
        dimension: isForward ? 'ratio_forward' : 'ratio_reverse',
        min: -HEATMAP_ABSMAX,
        max: HEATMAP_ABSMAX,
        precision: 2,
        realtime: false,
        inRange: {
            color: isForward ? HEATMAP_COLOR_RANGE_REVERSE : HEATMAP_COLOR_RANGE,
        },
        outOfRange: {
            color: isForward ? HEATMAP_COLOR_RANGE_REVERSE : HEATMAP_COLOR_RANGE,
        },
        show: false,
        text: isForward ? ['Binding', 'Exclusion'] : ['Exclusion', 'Binding'],
        itemHeight: 50,
        top: 50,
    };
}

export function mainHeatmapSeries(isForward, xAxisIndex, yAxisIndex, datasetIndex = 0) {
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        datasetIndex,
        encode: {
            x: 'pd',
            y: 'protein',
        },
        symbol: isForward ? GLYPH_HALF_CIRCLE_RIGHT : GLYPH_HALF_CIRCLE_LEFT,
        symbolKeepAspect: true,
        symbolOffset: isForward ? [2, 0] : [-2, 0],
        symbolSize: symbolSize(isForward),
        animation: false,
        id: isForward ? 'heatmapSeriesFwd' : 'heatmapSeriesRev',
        // tooltip: {
        //     trigger: 'item',
        //     show: true,
        // },
    };
}

export function heatmapYAxis(order, gridIndex, withLabels = true) {
    return {
        id: `heatmap-y-${gridIndex}`,
        type: 'category',
        data: order,
        axisTick: {
            show: false,
        },
        axisLabel: {
            interval: 0,
            show: withLabels,
        },
        gridIndex,
        axisLine: {
            show: false,
        },
        axisPointer: {
            show: true,
            type: 'shadow',
            triggerTooltip: true,
            label: {
                show: withLabels,
            },
        },
    };
}
