from typing import List, Set

from pydantic import BaseModel
from constants import GENE_NAMES
import pandas as pd
from pydantic.json import ENCODERS_BY_TYPE


from helpers import HDF5_CHUNKSIZE, grouper, empty_or_split

_PROTEIN_META_HDF = '/precompiled/protein_meta.h5'

class GeneLabel(str):

    @classmethod
    def validate(cls, v):
        if v not in GENE_NAMES:
            raise ValueError(f'{v!r} is not a valid gene name')
        return v

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

# Hacky, but otherwise docs don't work
ENCODERS_BY_TYPE[GeneLabel] = str


class ProteinInfo(BaseModel):
    index: GeneLabel
    gene_names: List[str]
    gene_names_alternative: List[str]

    protein_names: List[str]
    majority_protein_ids: List[str]
    protein_ids: List[str]

    peptides: int
    unique_peptides: int
    razor_plus_unique_peptides: int

    complex_memberships: List[str]

    @classmethod
    def from_row(cls, row):
        return cls(index=row['protein'],
                   gene_names=empty_or_split(row['gene_names']),
                   gene_names_alternative=empty_or_split(row['alternative_gene_names']),
                   protein_names=empty_or_split(row['protein_names']),
                   majority_protein_ids=empty_or_split(row['majority_protein_ids']),
                   protein_ids=empty_or_split(row['protein_ids']),
                   peptides=row['peptides'],
                   unique_peptides=row['unique_peptides'],
                   razor_plus_unique_peptides=row['unique_peptides_including_razor'],
                   complex_memberships=empty_or_split(row['complex_memberships'], '|'))


def _load_proteins(subset_genes: Set[GeneLabel], output_csv=False):
    # Sort genes
    subset_genes = sorted(frozenset(subset_genes))
    if len(subset_genes) > 0:
        batches = grouper(subset_genes)
    else:
        batches = [None]

    first_chunk = True
    for batch in batches:
        try:
            # Special case for 'all'
            if batch is None:
                chunked_data = pd.read_hdf(_PROTEIN_META_HDF, 'protein_meta',
                                           chunksize=HDF5_CHUNKSIZE)
            else:
                batch = frozenset(batch)
                chunked_data = pd.read_hdf(_PROTEIN_META_HDF, 'protein_meta',
                                           local_variables=dict(batch=batch),
                                           where=f'protein in batch',
                                           chunksize=HDF5_CHUNKSIZE)

            for chunk in chunked_data:
                if not output_csv:
                    for __, row in chunk.iterrows():
                        yield ProteinInfo.from_row(row)
                else:
                    yield chunk.to_csv(index=False, header=first_chunk)
                first_chunk = False
        except NotImplementedError:
            raise Exception(sorted(batch))

def stream_proteins(subset_genes: Set[GeneLabel]):
    return _load_proteins(subset_genes=subset_genes)

def stream_proteins_as_csv(subset_genes):
    return _load_proteins(subset_genes=subset_genes, output_csv=True)