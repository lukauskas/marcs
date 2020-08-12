from pydantic.json import ENCODERS_BY_TYPE

from typing import Set

from constants import PTM_PREDICTORS
from proteins import GeneLabel
import pandas as pd
from helpers import grouper, HDF5_CHUNKSIZE, empty_or_split

_PTM_RESPONSE_FILE = '/precompiled/ptm_response.h5'


class PTMPredictor(str):

    @classmethod
    def validate(cls, v):
        if v not in PTM_PREDICTORS:
            raise ValueError(f'{v!r} is not a valid PTM predictor')
        return v

    @classmethod
    def __get_validators__(cls):
        yield cls.validate


# Hacky, but otherwise docs don't work
ENCODERS_BY_TYPE[PTM_PREDICTORS] = str

def _load_subset(subset_genes: Set[GeneLabel], subset_keys=None):

    if not subset_genes:
        return []

    for batch in grouper(subset_genes):

        try:
            chunked_data = pd.read_hdf(_PTM_RESPONSE_FILE, 'ptm_matrix',
                                       local_variables=dict(batch=batch),
                                       where=f'protein in batch',
                                       chunksize=HDF5_CHUNKSIZE)
        except NotImplementedError:
            raise Exception(sorted(batch))

        for chunk in chunked_data:

            for __, row in chunk.iterrows():
                # NaNs will be undefined
                d = {}
                row = row.dropna()

                for col, value in row.iteritems():
                    if col == 'protein':
                        d[col] = value
                        continue

                    ptm, __, key = col.partition('-')

                    if subset_keys is not None and key not in subset_keys:
                        continue

                    try:
                        d[ptm][key] = value
                    except KeyError:
                        d[ptm] = {key: value}

                yield d


def _load_all_data(ptm: PTMPredictor):
    chunked_data = pd.read_hdf(_PTM_RESPONSE_FILE,
                               f'table_matrix/{ptm}',
                               chunksize=HDF5_CHUNKSIZE)

    for chunk in chunked_data:
        for __, row in chunk.iterrows():
            d = row.to_dict()
            d['gene_names'] = empty_or_split(d['gene_names'])
            d['protein_names'] = empty_or_split(d['protein_names'])
            d['complex_memberships'] = empty_or_split(d['complex_memberships'], '|')
            yield d


def _load_data_for_network(ptm: PTMPredictor):
    chunked_data = pd.read_hdf(_PTM_RESPONSE_FILE,
                               f'network_ptms/{ptm}',
                               chunksize=HDF5_CHUNKSIZE)

    for chunk in chunked_data:
        # yield chunk.to_dict(orient='records')
        for __, row in chunk.iterrows():
            # NaNs will be undefined
            row = row.dropna()
            yield row.to_dict()

def ptm_response_for_protein_subset(subset_genes: Set[GeneLabel]):
    return _load_subset(subset_genes=subset_genes)

def ptm_response_full_data(ptm: PTMPredictor):
    return _load_all_data(ptm)

def ptm_response_network(ptm: PTMPredictor):
    return _load_data_for_network(ptm=ptm)
