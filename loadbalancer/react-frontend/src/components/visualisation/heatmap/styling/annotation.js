import palette from 'google-palette';

export function annotationSeries(xLabel, xAxisIndex, yAxisIndex, datasetIndex) {
    return {
        type: 'scatter',
        xAxisIndex,
        yAxisIndex,
        datasetIndex,
        encode: {
            y: 'protein',
            x: xLabel,
        },
        symbol: 'square',
        symbolSize: 10,
        itemStyle: {
            color: 'black',
        },
    };
}

export function annotationVisualMap(xLabel, order, seriesIndex) {
    const colorPalette = palette('tol-rainbow', order.length).map(x => `#${x}`);

    // No idea why these have to be numeric, but it works..
    const categories = Array.from(Array(order.length).keys());

    return {
        type: 'piecewise',
        dimension: xLabel,
        categories,
        show: false,
        // categories: order,
        inRange: {
            color: colorPalette,
            // color: 'red',
            symbol: 'square',
        },
        outOfRange: {
            // color: colorPalette,
            color: 'blue',
            symbol: 'square',
        },
        seriesIndex,
    };
}


export function annotationXAxis(order, gridIndex) {
    return {
        type: 'category',
        data: order,
        position: 'bottom',
        axisTick: {
            show: false,
            interval: 0,
        },
        axisLabel: {
            show: true,
            interval: 0,
            rotate: 90,
        },
        splitLine: {
            show: false,
        },
        gridIndex,
        axisLine: {
            show: false,
        },
    };
};
