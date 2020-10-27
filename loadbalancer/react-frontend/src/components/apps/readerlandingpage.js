import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {PTM_PREDICTOR_ORDER, PTM_PREDICTOR_ORDER_WEBSAFE} from "../../../data/ptms";

import ptmGraphicalAbstract from "./images/reader-abstract.png"
import MatomoPageView from "../matomo/MatomoPageView";

const H3_PTMS = [
    'H3K4me1',
    'H3K4me3',
    'H3ac',
    'H3K9acK14ac',
    'H3K9me2',
    'H3K9me3',
    'H3K27ac',
    'H3K27me2',
    'H3K27me3',
];

const H4_PTMS = [
    'H4ac',
    'H4K16ac',
    'H4K20me2',
    'H4K20me3',
];

const OTHER_PTMS = [
    'H2A.Z',
    'DNA Methylation',
];

export default class ReaderLandingPage extends Component {
    render() {

        const readerLinksH3 = H3_PTMS.map(x => {
            const i = PTM_PREDICTOR_ORDER.indexOf(x);
            const safe_x = PTM_PREDICTOR_ORDER_WEBSAFE[i];
            const uri = `/readers/${safe_x}`;

            return (
                <li key={x}><a href={uri}>{x}</a></li>
            )
        });

         const readerLinksH4 = H4_PTMS.map(x => {
            const i = PTM_PREDICTOR_ORDER.indexOf(x);
            const safe_x = PTM_PREDICTOR_ORDER_WEBSAFE[i];
            const uri = `/readers/${safe_x}`;

            return (
                <li key={x}><a href={uri}>{x}</a></li>
            )
        });
         const readerLinksOther = OTHER_PTMS.map(x => {
            const i = PTM_PREDICTOR_ORDER.indexOf(x);
            const safe_x = PTM_PREDICTOR_ORDER_WEBSAFE[i];
            const uri = `/readers/${safe_x}`;

            return (
                <li key={x}><a href={uri}>{x}</a></li>
            )
        });

        return (
            <>
                <MatomoPageView />
                <Jumbotron fluid>
                    <Container>
                        <h1>
                            Chromatin feature effect estimates
                        </h1>
                        <p>
                            MARCS leverages redundancy across the nucleosome library
                            to accurately estimate the effect of nucleosomal features
                            on the binding of proteins. This is achieved by
                            sampling the change in protein response across pairs of nucleosomes
                            which differ by single modification feature (e.g. change in log&#8322; H/L ratio between H3K4me3K9acK14ac and H3K9acK14ac).
                            Multiple observations of this change allows accurate
                            statistical quantification of the influence of chromatin modifications
                            to protein binding (which may be both positive or negative).
                        </p>
                    </Container>
                </Jumbotron>
                <Container className="pb-5">
                    <Row>
                        <Col md={6}>
                            <div className="embed-responsive embed-responsive-1by1">
                                <img className="embed-responsive-item" src={ptmGraphicalAbstract} alt="Graphical summary of chromatin feature effect estimation procedure"/>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="embed-responsive embed-responsive-1by1">
                                <div className="embed-responsive-item d-flex flex-column align-items-center justify-content-center">
                                    <div className="d-flex flex-column">
                                        <div className="px-3">
                                            <h2 style={{fontSize: '1.2rem'}}>Browse effect estimates and readers of:</h2>
                                        </div>
                                        <div className="d-flex flex-md-row">
                                            <div className="p-3">
                                                <h3 style={{ fontSize: '1rem' }}>Histone H3</h3>
                                                <ul className="list-unstyled">
                                                    {readerLinksH3}
                                                </ul>
                                            </div>
                                            <div className="p-3">
                                                <h3 style={{ fontSize: '1rem'}}>Histone H4</h3>
                                                <ul className="list-unstyled">
                                                    {readerLinksH4}
                                                </ul>
                                                <h3 style={{ fontSize: '1rem' }}>Other</h3>
                                                <ul className="list-unstyled">
                                                    {readerLinksOther}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    componentDidMount() {
        document.title = `Chromatin Feature Effects — MARCS`;
    }
}
