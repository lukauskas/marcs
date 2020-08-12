from typing import Set
from proteins import GeneLabel
import itertools
import pandas as pd
from helpers import HDF5_CHUNKSIZE, grouper

_ANNOTATION_FILE = '/precompiled/annotations.h5'

def _load_domains(subset_genes: Set[GeneLabel],
                  columns=None):

    if not subset_genes:
        return []

    for batch in grouper(subset_genes):

        try:
            chunked_data = pd.read_hdf(_ANNOTATION_FILE, 'domains',
                                       local_variables=dict(batch=batch),
                                       where=f'protein in batch',
                                       columns=columns,
                                       chunksize=HDF5_CHUNKSIZE)

            for chunk in chunked_data:
                for __, row in chunk.iterrows():
                    yield row.to_dict()

        except NotImplementedError:
            raise Exception(sorted(batch))

def _load_complexes(subset_genes: Set[GeneLabel],
                    columns=None):

    if not subset_genes:
        return []

    for batch in grouper(subset_genes):

        try:
            chunked_data = pd.read_hdf(_ANNOTATION_FILE, 'complex_memberships',
                                       local_variables=dict(batch=batch),
                                       where=f'protein in batch',
                                       columns=columns,
                                       chunksize=HDF5_CHUNKSIZE)

            for chunk in chunked_data:
                for __, row in chunk.iterrows():
                    yield row.to_dict()

        except NotImplementedError:
            raise Exception(sorted(batch))


def load_annotations(subset_genes: Set[GeneLabel]):

    domains = _load_domains(subset_genes,
                            columns=['protein', 'interpro_id', 'desc'])
    complexes = _load_complexes(subset_genes,
                                columns=['protein', 'complex'])

    return dict(domains=domains, complexes=complexes)


def load_complex_info():
    chunked_data = pd.read_hdf(_ANNOTATION_FILE, 'complex_info',
                               chunksize=HDF5_CHUNKSIZE)

    for chunk in chunked_data:
        for __, row in chunk.iterrows():
            d = {
                'complex': row['complex'],
                'proteins': row['proteins'].split('|'),
                'missing_members': row['missing_members'].split('|')
            }

            sources = []

            for source in row['sources'].split('|'):
                source_type, __, source_id = source.partition(':')
                sources.append({'type': source_type, 'identifier': source_id.strip('"')})
            d['source'] = sources

            yield d


def stream_complexes_to_csv():
    chunked_data = pd.read_hdf(_ANNOTATION_FILE, 'complex_memberships_full',
                               chunksize=HDF5_CHUNKSIZE)

    first_chunk = True
    for chunk in chunked_data:
        yield chunk.to_csv(index=False, header=first_chunk)
        first_chunk = False
