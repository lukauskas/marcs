from typing import List

from fastapi import FastAPI, Query
from fastapi.middleware.gzip import GZipMiddleware

from starlette.responses import UJSONResponse, StreamingResponse

from annotations import load_annotations, load_complex_info, stream_complexes_to_csv

from matrix import PullDownID, heatmap_data, scatterplot_data
from proteins import GeneLabel, stream_proteins_as_csv, stream_proteins
from network import whole_network_edges, whole_network_nodes, query_edges

import os

from ptm_response import ptm_response_for_protein_subset, ptm_response_full_data, PTMPredictor, ptm_response_network


from constants import SNAPANALYSIS_VERSION_DATE, SNAPANALYSIS_VERSION_COMMIT, API_VERSION_COMMIT, API_VERSION_DATE

app = FastAPI(openapi_prefix=os.environ.get('OPENAPI_PREFIX', ''))
app.add_middleware(GZipMiddleware, minimum_size=500)

@app.get("/", response_class=UJSONResponse)
def read_root():

    version_dict = {
        "snapanalysis": dict(date=SNAPANALYSIS_VERSION_DATE,
                             commit=SNAPANALYSIS_VERSION_COMMIT),
        "api": dict(date=API_VERSION_DATE, commit=API_VERSION_COMMIT)
    }



    return dict(version=version_dict)


# -- Scatterplot -----------------------------------------------------

@app.get('/scatterplot/{pull_down}', response_class=UJSONResponse)
def scatterplot_pd(pull_down: PullDownID):
    return scatterplot_data(pull_down)


# -- heatmap ----------------------------------

@app.get('/heatmap/data', response_class=UJSONResponse)
def heatmap_datasource(protein_ids: List[GeneLabel] = Query(None)):
    if protein_ids is None:
        protein_ids = frozenset([])
    else:
        protein_ids = frozenset(protein_ids)

    data = heatmap_data(subset_genes=protein_ids)

    annotations = load_annotations(protein_ids)
    annotations['heatmap'] = data

    return annotations

# Misc annotations



# -- Protein information -----------------------------

@app.get("/proteins", response_class=UJSONResponse)
def proteins(protein_ids: List[GeneLabel] = Query(None)):
    if protein_ids is None:
        protein_ids = frozenset([])
    else:
        protein_ids = frozenset(protein_ids)

    return stream_proteins(protein_ids)

@app.get("/proteins.csv")
def proteins(protein_ids: List[GeneLabel] = Query(None)):
    if protein_ids is None:
        protein_ids = frozenset([])
    else:
        protein_ids = frozenset(protein_ids)
    return StreamingResponse(stream_proteins_as_csv(protein_ids), media_type='text/csv')

# -- Network ---

@app.get('/network/full/edges', response_class=UJSONResponse)
def network_all_edges():
    return whole_network_edges()

@app.get('/network/full/nodes', response_class=UJSONResponse)
def network_all_nodes():
    return whole_network_nodes()

@app.get('/network/subset/edges', response_class=UJSONResponse)
def network_subset_edges(protein_ids: List[GeneLabel] = Query(None)):
    if protein_ids is None:
        protein_ids = frozenset([])
    else:
        protein_ids = frozenset(protein_ids)

    return query_edges(protein_ids)

@app.get('/network/ptms/{ptm}', response_class=UJSONResponse)
def ptms_subset(ptm: PTMPredictor):
    return ptm_response_network(ptm)

# -- Ptms --

@app.get('/ptms/subset', response_class=UJSONResponse)
def ptms_subset(protein_ids: List[GeneLabel] = Query(None)):
    if protein_ids is None:
        protein_ids = frozenset([])
    else:
        protein_ids = frozenset(protein_ids)

    return ptm_response_for_protein_subset(protein_ids)

@app.get('/ptms/full/{ptm}', response_class=UJSONResponse)
def ptms_full(ptm: PTMPredictor):
    return ptm_response_full_data(ptm)


@app.get('/complexes', response_class=UJSONResponse)
def complexes():
    return load_complex_info()

@app.get('/complexes.csv')
def complexes_csv():
    return StreamingResponse(stream_complexes_to_csv(), media_type='text/csv')

