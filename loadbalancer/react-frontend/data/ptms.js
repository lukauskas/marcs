const absMax = 1.5;

const colorAc = '#6484A2';
const colorMe1 = '#BBE1BB';
const colorMe2 = '#9FBA7D';
const colorMe3 = '#6F9979';


export const PTM_PREDICTORS = {
    'H2A.Z': {
        name: 'H2A.Z',
        color: '#786D9B',
        badgeVariant: 'h2az',
        min: -absMax,
        max: absMax,
    },
    'H3K4me1': {
        name: 'H3K4me1',
        color: colorMe1,
        badgeVariant: 'me1',
        min: -absMax,
        max: absMax,
    },
    'H3K4me3': {
        name: 'H3K4me3',
        color: colorMe3,
        badgeVariant: 'me3',
        min: -absMax,
        max: absMax,
    },
    'H3ac': {
        name: 'H3ac',
        color: colorAc,
        badgeVariant: 'ac',
        min: -absMax,
        max: absMax,
    },
    'H3K9acK14ac': {
        name: 'H3K9acK14ac',
        color: colorAc,
        badgeVariant: 'ac',
        min: -absMax,
        max: absMax,
    },
    'H3K9me2': {
        name: 'H3K9me2',
        color: colorMe2,
        badgeVariant: 'me2',
        min: -absMax,
        max: absMax,
    },
    'H3K9me3': {
        name: 'H3K9me3',
        color: colorMe3,
        badgeVariant: 'me3',
        min: -absMax,
        max: absMax,
    },
    'H3K27ac': {
        name: 'H3K27ac',
        color: colorAc,
        badgeVariant: 'ac',
        min: -absMax,
        max: absMax,
    },
    'H3K27me2': {
        name: 'H3K27me2',
        color: colorMe2,
        badgeVariant: 'me2',
        min: -absMax,
        max: absMax,
    },
    'H3K27me3': {
        name: 'H3K27me3',
        color: colorMe3,
        badgeVariant: 'me3',
        min: -absMax,
        max: absMax,
    },
    'H4ac': {
        name: 'H4ac',
        color: colorAc,
        badgeVariant: 'ac',
        min: -absMax,
        max: absMax,
    },
    'H4K16ac': {
        name: 'H4K16ac',
        color: colorAc,
        badgeVariant: 'ac',
        min: -absMax,
        max: absMax,
    },
    'H4K20me2': {
        name: 'H4K20me2',
        color: colorMe2,
        badgeVariant: 'me2',
        min: -absMax,
        max: absMax,
    },
    'H4K20me3': {
        name: 'H4K20me3',
        color: colorMe3,
        badgeVariant: 'me3',
        min: -absMax,
        max: absMax,
    },
    'DNA Methylation': {
        name: 'DNA Methylation',
        color: '#85B3B2',
        badgeVariant: 'm5c',
        min: -absMax,
        max: absMax,
    },
};

export const PTM_PREDICTOR_ORDER = [
    'H2A.Z',
    'H3K4me1',
    'H3K4me3',
    'H3ac',
    'H3K9acK14ac',
    'H3K9me2',
    'H3K9me3',
    'H3K27ac',
    'H3K27me2',
    'H3K27me3',
    'H4ac',
    'H4K16ac',
    'H4K20me2',
    'H4K20me3',
    'DNA Methylation',
];

export const PTM_PREDICTOR_ORDER_WEBSAFE = PTM_PREDICTOR_ORDER.map(x => x.toLowerCase().replace(/[^a-z0-9]+/g, '_'));
