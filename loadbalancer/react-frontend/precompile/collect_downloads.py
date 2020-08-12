import os
from datetime import datetime
import sys
import json
import shutil

INPUT_DIR = '/output'
OUTPUT_DIR = '/downloads/'
VERSION_FILE = '/build/info.txt'

OUTPUT_FILE_JS = '/precompiled/dataVersion.js'

def parse_version():
    with open(VERSION_FILE, 'r') as f:
        version_info = f.read()

    date, commit, __ = version_info.split('\n')

    date = date.partition('=')[-1]
    date_only = date.partition('T')[0]
    commit = commit.partition('=')[-1]

    version_suffix = date_only + '.' + commit

    version = {
        'date': date,
        'commit': commit,
        'version_suffix': version_suffix
    }

    return version

def main():

    version = parse_version()
    version_suffix = version['version_suffix']

    if not os.path.isdir(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    version_json = json.dumps(version)

    TEMPLATE = """
    export const SNAP_DATA_VERSION = {version_json};
    """

    with open(OUTPUT_FILE_JS, 'w') as f:
        f.write(TEMPLATE.format(version_json=version_json))


    for basename_from, basename_to in [
        # Heatmap
        ('preprocessing/table-heatmap.xlsx', f'marcs.heatmap.{version_suffix}.xlsx'),
        ('preprocessing/table-heatmap.heatmap.csv.gz', f'marcs.heatmap.{version_suffix}.csv.gz'),
        ('preprocessing/table-heatmap.heatmap_metadata.csv.gz', f'marcs.heatmap.metadata.{version_suffix}.csv.gz'),
        ('preprocessing/table-heatmap.imputation_type.csv.gz', f'marcs.heatmap.imputation_type.{version_suffix}.csv.gz'),
        ('preprocessing/table-heatmap.list_of_proteins.csv.gz', f'marcs.heatmap.list_of_proteins.{version_suffix}.csv.gz'),
        # Pulldowns
        ('preprocessing/table-pulldowns.xlsx', f'marcs.pulldowns.{version_suffix}.xlsx'),
        # PTM-response
        ('ptm-response/ptm-response-complexes.xlsx', f'marcs.ptm-response-complexes.{version_suffix}.xlsx'),
        ('ptm-response/ptm-response.xlsx', f'marcs.ptm-response-proteins.{version_suffix}.xlsx'),
        # Networks
        ('networks/table-networks.xlsx', f'marcs.network.{version_suffix}.xlsx'),
        ('networks/table-networks.edges.filtered.tsv.gz', f'marcs.network.edges.filtered.{version_suffix}.tsv.gz'),
        ('networks/table-networks.edges.full.tsv.gz', f'marcs.network.edges.full.{version_suffix}.tsv.gz'),
        ('networks/table-networks.nodes.full.tsv.gz', f'marcs.network.nodes.{version_suffix}.tsv.gz'),
        ('networks/training-biogrid-reference.gexf', f'marcs.network.biogrid-reference.{version_suffix}.gexf'),
        ('networks/graphs/graph.q.0.001.gephi.gexf', f'marcs.network.q.0.001.{version_suffix}.gexf'),
        ('networks/graphs/graph.q.high-confidence.gephi.gexf', f'marcs.network.high-confidence.{version_suffix}.gexf'),
    ]:
        path_from = os.path.join(INPUT_DIR, basename_from)
        path_to = os.path.join(OUTPUT_DIR, basename_to)

        shutil.copyfile(path_from, path_to)


if __name__ == '__main__':
    main()

