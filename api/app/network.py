from typing import Set
from proteins import GeneLabel
import pandas as pd
from helpers import grouper, HDF5_CHUNKSIZE, empty_or_split

_NETWORK_FILE = '/precompiled/networks.h5'

BATCH_SIZE_EDGES = 15

def _load_whole_network_nodes():
    columns = ['protein', 'network_pos_x', 'network_pos_y', 'community_color', 'complex_memberships']

    chunked_data = pd.read_hdf(_NETWORK_FILE, 'nodes',
                             where=f'has_pos == True',
                             columns=columns,
                             chunksize=HDF5_CHUNKSIZE)

    for chunk in chunked_data:
        for __, row in chunk.iterrows():
            d_r = row.to_dict()
            d = {'id': d_r['protein'], 'label': d_r['protein'], 'x': d_r['network_pos_x'], 'y': d_r['network_pos_y'],
                 'communityColor': row['community_color'],
                 'complexMemberships': empty_or_split(d_r['complex_memberships'])}

            yield d

def _load_whole_network_edges(columns=None):

    chunked_data = pd.read_hdf(_NETWORK_FILE, 'edges',
                             where=f'has_pos_both == True',
                             columns=columns,
                             chunksize=HDF5_CHUNKSIZE)

    for chunk in chunked_data:
        for __, row in chunk.iterrows():
            yield row.to_dict()


def whole_network_nodes():

    return _load_whole_network_nodes()


def whole_network_edges():
    columns = ['protein_a', 'protein_b',
               'neg_log10_q', 'interaction_exists']
    return _load_whole_network_edges(columns=columns)

def _load_edges(subset_genes: Set[GeneLabel],
                columns=None):

    if not subset_genes:
        return []

    seen_edges = set()

    # Since tables crashes with large "in" queries
    # We will fetch data in batches

    for batch in grouper(subset_genes, n=BATCH_SIZE_EDGES):

        # Note that to fetch the batched data correctly we need to fetch
        # all interactions for the proteins and then post-filter them
        # to subset

        try:
            chunked_data = pd.read_hdf(_NETWORK_FILE, 'edges',
                                       local_variables=dict(batch=batch),
                                       where=f'protein_a in batch or protein_b in batch',
                                       columns=columns,
                                       chunksize=HDF5_CHUNKSIZE)

            for chunk in chunked_data:

                chunk = chunk.query('protein_a in @subset_genes and protein_b in @subset_genes')

                for __, row in chunk.iterrows():

                    edge = row['protein_a'], row['protein_b']
                    if edge not in seen_edges:
                        yield row.to_dict()
                        seen_edges.add(edge)

        except NotImplementedError:
            raise Exception(sorted(batch))


def query_edges(subset_genes: Set[GeneLabel]):
    return _load_edges(subset_genes,
                       columns=['protein_a', 'protein_b', 'neg_log10_q', 'interaction_exists'])

def _load_nodes(subset_genes: Set[GeneLabel],
                columns=None):

    if not subset_genes:
        return []

    for batch in grouper(subset_genes):

        # Note that to fetch the batched data correctly we need to fetch
        # all interactions for the proteins and then post-filter them
        # to subset

        try:
            data = pd.read_hdf(_NETWORK_FILE, 'nodes',
                               local_variables=dict(batch=batch),
                               where=f'protein in batch',
                               columns=columns)
        except NotImplementedError:
            raise Exception(sorted(batch))

        for __, row in data.iterrows():
            # NaNs will be undefine
            row = row.dropna()
            yield row.to_dict()

