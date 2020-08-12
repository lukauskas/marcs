import itertools

import pandas as pd

# import fastcluster
from pydantic.json import ENCODERS_BY_TYPE

from constants import PULLDOWNS
from proteins import GeneLabel
from helpers import grouper, HDF5_CHUNKSIZE


from typing import Set

_MATRIX_FILE = '/precompiled/matrix.h5'
GENE_LABEL_COLUMN = 'protein'
PULL_DOWN_ID_COLUMN = 'pd'

FORWARD_COLUMN = 'ratio_forward'
REVERSE_COLUMN = 'ratio_reverse'

PEPTIDES_FORWARD_COLUMN = 'peptides_forward'
PEPTIDES_REVERSE_COLUMN = 'peptides_reverse'
PEPTIDES_FORWARD_UNIQUE_COLUMN = 'unique_peptides_forward'
PEPTIDES_REVERSE_UNIQUE_COLUMN = 'unique_peptides_reverse'


INTENSITY_FORWARD_COLUMN = 'log10_intensity_forward'
INTENSITY_REVERSE_COLUMN = 'log10_intensity_reverse'
IMPUTATION_TYPE_COLUMN = 'imputation'
MEAN_COLUMN = '__MEAN_RATIO__'

class PullDownID(str):

    @classmethod
    def validate(cls, v):
        if v not in PULLDOWNS:
            raise ValueError(f'{v!r} is not a valid Pull-Down ID')
        return v

    @classmethod
    def __get_validators__(cls):
        yield cls.validate


# Hacky, but otherwise docs don't work
ENCODERS_BY_TYPE[PullDownID] = str

def _load_pd_data(pulldown: PullDownID, columns=None):
    for __, row in pd.read_hdf(_MATRIX_FILE, 'enrichment_data_minimal',
                       local_variables=dict(pulldown=pulldown),
                       where=f'{PULL_DOWN_ID_COLUMN} == pulldown',
                       columns=columns).iterrows():
        yield row.to_dict()

def scatterplot_data(pulldown: PullDownID):
    return _load_pd_data(pulldown, columns=[GENE_LABEL_COLUMN, PULL_DOWN_ID_COLUMN,
                                            FORWARD_COLUMN, REVERSE_COLUMN,
                                            PEPTIDES_FORWARD_COLUMN, PEPTIDES_REVERSE_COLUMN,
                                            PEPTIDES_FORWARD_UNIQUE_COLUMN,
                                            PEPTIDES_REVERSE_UNIQUE_COLUMN,
                                            INTENSITY_FORWARD_COLUMN,
                                            INTENSITY_REVERSE_COLUMN,
                                            IMPUTATION_TYPE_COLUMN])

def _load_data(subset_genes: Set[GeneLabel],
               columns=None):

    if len(subset_genes) == 0:
        # Return empty dataframe if subset is specified but empty
        return []

    # Pytables fails somehow when searching for a large subset.
    for batch in grouper(subset_genes):
        batch = frozenset(batch)

        try:
            chunked_data = pd.read_hdf(_MATRIX_FILE, 'enrichment_data_minimal',
                                       local_variables=dict(batch=batch),
                                       where=f'{GENE_LABEL_COLUMN} in batch',
                                       columns=columns, chunksize=HDF5_CHUNKSIZE)

            for chunk in chunked_data:
                yield from chunk.to_dict(orient='records')
                # for __, row in chunk.iterrows():
                #     yield row.to_dict()

        except NotImplementedError:
            raise Exception(sorted(batch))



def heatmap_data(subset_genes: Set[GeneLabel]):
    return _load_data(subset_genes, columns=[GENE_LABEL_COLUMN, PULL_DOWN_ID_COLUMN,
                                                                FORWARD_COLUMN, REVERSE_COLUMN,
                                                                PEPTIDES_FORWARD_COLUMN, PEPTIDES_REVERSE_COLUMN,
                                                                PEPTIDES_FORWARD_UNIQUE_COLUMN,
                                                                PEPTIDES_REVERSE_UNIQUE_COLUMN,
                                                                INTENSITY_FORWARD_COLUMN,
                                                                INTENSITY_REVERSE_COLUMN,
                                                                IMPUTATION_TYPE_COLUMN])

