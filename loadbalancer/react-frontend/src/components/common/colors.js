// https://gist.github.com/jfsiii/7234419
function relativeLuminanceRgb(R, G, B) {
    return (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
}

// https://stackoverflow.com/a/5624139
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}

function relativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    return relativeLuminanceRgb(rgb.r, rgb.g, rgb.b);
}

export function colorIsLight(hex) {
    // constant from seaborn
    return relativeLuminance(hex) > 0.408;
}

export const PROTEIN_COLOR = '#377eb8';
export const COMPLEX_COLOR = '#e41a1c';