// eslint-disable-next-line import/no-unresolved
import { GLYPH_HALF_CIRCLE_RIGHT, GLYPH_HALF_CIRCLE_LEFT } from 'data/glyphs';

export const INSIGNIFICANT_SIZE = 5;
export const INTERMEDIATE_SIZE = 7;
export const SIGNIFICANT_SIZE = 9;

export function calculateSymbolSize(loading) {
    const absLoading = Math.abs(loading);
    if (absLoading >= 0.4) {
        return SIGNIFICANT_SIZE;
    }
    if (absLoading >= 0.3) {
        return INTERMEDIATE_SIZE;
    }

    return INSIGNIFICANT_SIZE;
}

export function symbolSize(isForward) {
    return (data) => {
        const absLoadingForward = Math.abs(data.loading_forward);
        const absLoadingReverse = Math.abs(data.loading_reverse);
        return calculateSymbolSize(Math.max(absLoadingForward, absLoadingReverse));
    };
}

export const HEATMAP_ABSMAX = 1;

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
].slice().reverse();

// No need to reverse range for factors (factors trained on reversed data)
export const HEATMAP_COLOR_RANGE_REVERSE = HEATMAP_COLOR_RANGE;

export function mainFactorHeatmapVisualMap(isForward, seriesIndex) {
    return {
        seriesIndex,
        type: 'continuous',
        dimension: isForward ? 'loading_forward' : 'loading_reverse',
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

export function mainFactorHeatmapSeries(isForward, xAxisIndex, yAxisIndex, datasetIndex = 0) {
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        datasetIndex,
        encode: {
            x: 'pd',
            y: 'factor',
        },
        symbol: isForward ? GLYPH_HALF_CIRCLE_RIGHT : GLYPH_HALF_CIRCLE_LEFT,
        symbolKeepAspect: true,
        symbolOffset: isForward ? [2, 0] : [-2, 0],
        symbolSize: symbolSize(isForward),
        animation: false,
        id: isForward ? 'heatmapSeriesFwd' : 'heatmapSeriesRev',
    };
}

export function factorHeatmapYAxis(order, gridIndex, withLabels = true) {
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
