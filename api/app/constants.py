import pickle
import logging

_GENE_NAMES_SET_CACHE = '/precompiled/gene_index_set.pickle'

def load_gene_names():
    try:
        with open(_GENE_NAMES_SET_CACHE, 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        logging.error('Could not load gene names')
        return frozenset([])

GENE_NAMES = load_gene_names()

_PULLDOWNS_CACHE = '/precompiled/pulldown_id_set.pickle'

def load_pulldowns():
    try:
        with open(_PULLDOWNS_CACHE, 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        logging.error('Could not load pulldowns')
        return frozenset([])

PULLDOWNS_SORTED = load_pulldowns()
PULLDOWNS = frozenset(PULLDOWNS_SORTED)

PTM_PREDICTORS = frozenset(['H3K9me3', 'H3K4me3', 'H3K27me3', 'H3K4me1', 'H4K20me3', 'H4K16ac',
                            'H3ac',
                            'H3K9acK14ac', 'DNA Methylation', 'H4ac', 'H3K27ac',
                            'H2A.Z', 'H4K20me2', 'H3K27me2', 'H3K9me2'])

_SNAPANALYSIS_VERSION_CACHE = '/precompiled/snapanalysis_build.pickle'

def load_snap_version():
    try:
        with open(_SNAPANALYSIS_VERSION_CACHE, 'rb') as f:
            ans = pickle.load(f)
    except FileNotFoundError:
        logging.error('Could not load SNAP version')
        ans = dict(date='?', commit='?')

    return ans['date'], ans['commit']

SNAPANALYSIS_VERSION_DATE, SNAPANALYSIS_VERSION_COMMIT = load_snap_version()

_API_BUILD_VERSION = '/build/info.pickle'

def load_api_version():
    try:
        with open(_API_BUILD_VERSION, 'rb') as f:
            ans = pickle.load(f)
    except FileNotFoundError:
        logging.error('Could not load API version')
        ans = dict(date='?', commit='?')

    return ans['date'], ans['commit']

API_VERSION_DATE, API_VERSION_COMMIT = load_api_version()
