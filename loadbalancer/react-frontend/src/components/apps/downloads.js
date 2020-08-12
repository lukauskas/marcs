import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import VersionInfo from "components/info/VersionInfo";
import { SNAP_DATA_VERSION } from "data/dataVersion";

import './styles/downloads.css'

function fileHref(basename, extension) {
    const {version_suffix: versionSuffix} = SNAP_DATA_VERSION;

    return '/_downloads/' + basename + '.' + versionSuffix + '.' + extension;
}

export default class DownloadsPage extends Component {
    render() {

        return (
            <>
                <Jumbotron fluid>
                    <Container>
                        <h1>
                            MARCS Downloads
                        </h1>
                        <p>
                            <VersionInfo/>
                        </p>
                    </Container>
                </Jumbotron>
                <Container className="pb-5" id="downloads-maincontent">
                    <h2 className="pb-3">Contents</h2>
                    <h3>Mass spectrometry</h3>
                    <p>
                        <ul>
                            <li>
                                RAW files and MaxQuant output
                                {' '}
                                <a href="https://www.ebi.ac.uk/pride/archive/projects/PXD018966" rel="noopener noreferrer" target="_blank">
                                    available from PRIDE - PXD018966
                                </a>
                            </li>
                        </ul>
                    </p>
                    <h3>Pull-Downs</h3>
                    <p>
                        <ul>
                            <li>Postprocessed data of individual Pull-Downs:
                                {' '}
                                <a href={fileHref('marcs.pulldowns', 'xlsx')} rel="noopener noreferrer" target="_blank">
                                    xlsx
                                </a>
                            </li>
                            <li>Clustered heatmap of proteins:
                                {' '}
                                <a href={fileHref('marcs.heatmap', 'xlsx')} rel="noopener noreferrer" target="_blank">
                                    xlsx
                                </a>
                            </li>
                            <li>Additionally, clustered heatmap of proteins split into multiple csv files:
                                <ul>
                                    <li>
                                        Heatmap:
                                        {' '}
                                        <a href={fileHref('marcs.heatmap', 'csv.gz')} rel="noopener noreferrer" target="_blank">
                                            csv.gz
                                        </a>
                                    </li>
                                    <li>
                                        Information about rows:
                                        {' '}
                                        <a href={fileHref('marcs.heatmap.metadata', 'csv.gz')} rel="noopener noreferrer" target="_blank">
                                            csv.gz
                                        </a>
                                    </li>
                                    <li>
                                        Imputation status of cells:
                                        {' '}
                                        <a href={fileHref('marcs.heatmap.imputation_type', 'csv.gz')} rel="noopener noreferrer" target="_blank">
                                            csv.gz
                                        </a>
                                    </li>
                                    <li>
                                        List of proteins sheet:
                                        {' '}
                                        <a href={fileHref('marcs.heatmap.list_of_proteins', 'csv.gz')} rel="noopener noreferrer" target="_blank">
                                            csv.gz
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </p>
                    <h3>Chromatin feature effect estimates</h3>
                    <p>
                        <ul>
                            <li>
                                Estimated effects for chromatin features (proteins):
                                {' '}
                                <a href={fileHref('marcs.ptm-response-proteins', 'xlsx')} rel="noopener noreferrer" target="_blank">
                                    xlsx
                                </a>
                            </li>
                            <li>
                                Estimated effects for chromatin features (curated complexes):
                                {' '}
                                <a href={fileHref('marcs.ptm-response-complexes', 'xlsx')} rel="noopener noreferrer" target="_blank">
                                    xlsx
                                </a>
                            </li>
                        </ul>
                    </p>
                    <h3>Protein interactions</h3>
                    <p>
                        <ul>
                            <li>
                                Network interactions and nodes (with formatting, significant edges only):
                                {' '}
                                <a href={fileHref('marcs.network', 'xlsx')} rel="noopener noreferrer" target="_blank">
                                    xlsx
                                </a>
                            </li>
                            <li>
                                Network interactions (edges):
                                {' '}
                                <ul>
                                    <li>
                                        Partial list (significant only, up to q ≤ 0.05):
                                        {' '}
                                        <a href={fileHref('marcs.network.edges.filtered', 'tsv.gz')} rel="noopener noreferrer" target="_blank">
                                            tsv.gz
                                        </a>
                                    </li>
                                   <li>
                                        Complete list:
                                        {' '}
                                        <a href={fileHref('marcs.network.edges.full', 'tsv.gz')} rel="noopener noreferrer" target="_blank">
                                            tsv.gz
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Network nodes:
                                {' '}
                                <a href={fileHref('marcs.network.nodes', 'tsv.gz')} rel="noopener noreferrer" target="_blank">
                                    tsv.gz
                                </a>
                            </li>
                            <li>
                                Networks:
                                {' '}
                                <ul>
                                    <li>
                                        High-confidence network:
                                        {' '}
                                        <a href={fileHref('marcs.network.high-confidence', 'gexf')} rel="noopener noreferrer" target="_blank">
                                            gexf
                                        </a>
                                    </li>
                                   <li>
                                        Main network (q ≤ 0.001):
                                        {' '}
                                        <a href={fileHref('marcs.network.q.0.001', 'gexf')} rel="noopener noreferrer" target="_blank">
                                            gexf
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </p>
                    <h3>Source code</h3>
                    <p>
                        <ul>
                            <li>Data analysis:
                                {' '}
                                <a href="https://github.com/lukauskas/publications-lukauskas-2020-marcs" rel="noopener noreferrer" target="_blank">
                                    GitHub
                                </a>
                            </li>
                            <li>Website:
                                {' '}
                                <a href="https://github.com/lukauskas/marcs" rel="noopener noreferrer" target="_blank">
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </p>
                </Container>
            </>
        );
    }

    componentDidMount() {
        document.title = `Downloads — MARCS`;
    }
}
