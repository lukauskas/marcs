
// eslint-disable-next-line import/no-unresolved
import { PULL_DOWNS } from 'data/pull_downs';
import {
    GLYPH_ME3, GLYPH_ME2, GLYPH_ME1, GLYPH_M5C, GLYPH_ASTERISK,
// eslint-disable-next-line import/no-unresolved
} from 'data/glyphs';

const categories = ['H2A.Z', 'ac', 'me1', 'me2', 'me3', 'm5C'];
// #5F4690,#1D6996,#38A6A5,#0F8554,#73AF48,#EDAD08,#E17C05,#CC503E,#94346E,#6F4070,#994E95,#666666
// const colors = ['#5e4fa2', '#3288bd', '#a8ddb5', '#9ccb86', '#66c2a5', '#4eb3d3'];
const colors = ['#5B488B', '#336892', '#9FDDA9', '#80AD56', '#3C8358', '#58A4A4'];
const glyphs = [GLYPH_ASTERISK,
    // ac
    'square',
    // me1 - one circle:
    GLYPH_ME1,
    // me2 - two circles:
    GLYPH_ME2,
    // me3 - three circles:
    GLYPH_ME3,
    // m5C - C
    GLYPH_M5C];

// const glyphs = ['circle', 'circle', 'circle', 'circle', 'circle', 'circle'];
const sizes = [
    [9, 9],
    [8, 8],
    [9, 9],
    [9, 9],
    [9, 9],
    [9, 9],
];

const HEADER_GRID_LINESTYLE = {
    color: '#F0F0F0',
    opacity: 0.5,
};

export function headerVisualMap(seriesIndex, paddingLeft) {
    return {
        type: 'piecewise',
        dimension: 'value',
        selectedMode: false,
        categories,
        color: colors,
        itemWidth: 10,
        itemHeight: 10,
        inRange: {
            symbol: 'circle',
            // symbol: glyphs,
            color: colors,
            // symbolSize: sizes,
        },
        outOfRange: {
            // symbol: glyphs,
            symbol: 'circle',
            color: colors,
            // symbolSize: sizes,
            opacity: 0.3,
        },
        // itemSymbol: glyphs,
        orient: 'horizontal',
        top: 'top',
        seriesIndex,
        left: paddingLeft,
        align: 'left',
    };
}

export function headerXAxis(pdorder, gridIndex, named = true, gridLines = true) {
    return {
        id: `header-x-${gridIndex}`,
        type: 'category',
        data: pdorder,
        position: 'top',
        axisTick: {
            show: false,
            interval: 0,
        },
        axisLabel: {
            show: false,
        },
        splitLine: {
            show: gridLines,
            interval: 0,
            lineStyle: HEADER_GRID_LINESTYLE,
        },
        gridIndex,
        name: named ? 'Di-nucleosomes' : null,
        nameGap: 5,
        nameLocation: 'middle',
        axisLine: {
            show: false,
        },
        axisPointer: {
            show: true,
            type: 'shadow',
            triggerTooltip: true,
            label: {
                show: named,
            },
        },
    };
}
export function headerYAxis(gridIndex) {
    return {
        type: 'category',
        data: ['H2A.Z',
            'H3K4', 'H3K9', 'H3K14', 'H3K18', 'H3K23', 'H3K27',
            'H4K5', 'H4K8', 'H4K12', 'H4K16', 'H4K20',
            'DNA Methylation'],
        axisTick: {
            interval: 0,
            show: false,
        },
        axisLabel: {
            interval: 0,
        },
        axisLine: {
            show: false,
        },
        inverse: true,
        gridIndex,
        splitLine: {
            show: true,
            interval: 0,
            lineStyle: HEADER_GRID_LINESTYLE,
        },
    };
}

const PD_DATA = Object.values(PULL_DOWNS).map(pd => Object.entries(pd.predictors)
    .map(kv => [pd.key, kv[0], kv[1]]))
    .reduce((a, b) => a.concat(b), []);

export function headerSeries(xAxisIndex, yAxisIndex) {
    return {
        type: 'scatter',
        id: 'headerSeries',
        xAxisIndex,
        yAxisIndex,
        data: PD_DATA,
    };
}
