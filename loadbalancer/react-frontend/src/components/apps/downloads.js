import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import VersionInfo from "components/info/VersionInfo";
import { SNAP_DATA_VERSION } from "data/dataVersion";

import './styles/downloads.css'
import MatomoPageView from "../matomo/MatomoPageView";
import LicensedLink from "components/controls/LicensedLink";

function fileHref(basename, extension) {
    const {version_suffix: versionSuffix} = SNAP_DATA_VERSION;

    return '/_downloads/' + basename + '.' + versionSuffix + '.' + extension;
}

export default class DownloadsPage extends Component {
    render() {

        return (
            <>
                <MatomoPageView />
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
                                <LicensedLink href={fileHref('marcs.pulldowns', 'xlsx')} text="xlsx" />
                            </li>
                            <li>Clustered heatmap of proteins:
                                {' '}
                                <LicensedLink href={fileHref('marcs.heatmap', 'xlsx')} text="xlsx" />
                            </li>
                            <li>Additionally, clustered heatmap of proteins split into multiple csv files:
                                <ul>
                                    <li>
                                        Heatmap:
                                        {' '}
                                        <LicensedLink href={fileHref('marcs.heatmap.sheet.01.heatmap', 'tsv.gz')} text="tsv.gz" />
                                    </li>
                                    <li>
                                        Information about rows:
                                        {' '}
                                        <LicensedLink href={fileHref('marcs.heatmap.sheet.01.metadata', 'tsv.gz')} text="tsv.gz" />
                                    </li>
                                    <li>
                                        Imputation status of cells:
                                        {' '}
                                        <LicensedLink href={fileHref('marcs.heatmap.sheet.03.imputation_type', 'tsv.gz')} text="tsv.gz" />
                                    </li>
                                    <li>
                                        List of proteins sheet:
                                        {' '}
                                        <LicensedLink href={fileHref('marcs.heatmap.sheet.02.list_of_proteins', 'tsv.gz')} text="tsv.gz" />
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
                                <LicensedLink href={fileHref('marcs.ptm-response-proteins', 'xlsx')} text="xlsx" />
                            </li>
                            <li>
                                Estimated effects for chromatin features (curated complexes):
                                {' '}
                                <LicensedLink href={fileHref('marcs.ptm-response-complexes', 'xlsx')}  text="xlsx" />
                            </li>
                        </ul>
                    </p>
                    <h3>Protein interactions</h3>
                    <p>
                        <ul>
                            <li>
                                Network interactions and nodes (with formatting, significant edges only):
                                {' '}
                                <LicensedLink href={fileHref('marcs.network', 'xlsx')} text="xlsx" />
                            </li>
                            <li>
                                Network interactions (edges):
                                {' '}
                                <ul>
                                    <li>
                                        Partial list (significant only, up to q ≤ 0.05):
                                        {' '}
                                        <LicensedLink href={fileHref('marcs.network.sheet.01.edges.filtered', 'tsv.gz')} text="tsv.gz" />
                                    </li>
                                   <li>
                                        Complete list:
                                        {' '}
                                        <LicensedLink href={fileHref('marcs.network.sheet.01.edges.full', 'tsv.gz')} text="tsv.gz" />
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Network nodes:
                                {' '}
                                <LicensedLink href={fileHref('marcs.network.sheet.02.nodes', 'tsv.gz')} text="tsv.gz" />
                            </li>
                            <li>
                                Networks:
                                {' '}
                                <ul>
                                    <li>
                                        High-confidence network:
                                        {' '}
                                        <LicensedLink href={fileHref('marcs.network.high-confidence', 'gexf')} text="gexf" />
                                    </li>
                                   <li>
                                        Main network (q ≤ 0.001):
                                        {' '}
                                        <LicensedLink href={fileHref('marcs.network.q.0.001', 'gexf')} text="gexf" />
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
                                <a href="https://github.com/lukauskas/publications-lukauskas-2021-marcs" rel="noopener noreferrer" target="_blank">
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
