import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import VersionInfo from "../info/VersionInfo";
import Citation from "../info/Citation";
import Button from "react-bootstrap/Button";

import './styles/about.css'
import MatomoPageView from "../matomo/MatomoPageView";

export default class AboutPage extends Component {
    render() {

        return (
            <>
                <MatomoPageView title="About" />
                <Jumbotron fluid>
                    <Container>
                        <h1>
                            About MARCS
                        </h1>
                        <p>
                            MARCS (Modification Atlas of Regulation by Chromatin States) is an information hub for protein
                            interactions with chromatin states based
                            on 55 di-nucleosome SILAC Affinity Purification (SNAP) experiments.
                            MARCS compiles bespoke analysis and visualisation tools of the data,
                            which are designed for interactivity and usability.
                        </p>
                        <p>
                            <Button variant={"primary"} href={"/"}>Explore MARCS</Button>
                        </p>
                    </Container>
                </Jumbotron>
                <Container className="pb-5" id="about">
                    <h2>Citing MARCS</h2>
                    <Citation />

                    <h2>Current release</h2>
                    <VersionInfo/>
                    <h2>License</h2>
                    <a id="license"/>
                    <p>
                        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                            <img
                                src="https://marcs.local/static/by-nc-sa.eu.large.svg"
                                alt="CC BY NC SA badge"
                                style={{height: 50}}
                            />
                        </a>
                    </p>
                    <p>
                        MARCS data is available under the terms in
                        {' '}
                        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)</a>
                        {' '}
                        license.
                    </p>
                    <p>
                        For enquiries about commercial uses of the data please contact
                        {' '}
                        <a href="https://www.helmholtz-muenchen.de/ife/about-us/people/staff-detail/ma/5831/Dr-Bartke/index.html">Till Bartke</a> (till.bartke at helmholtz-muenchen dot de)
                        {' '}
                        for information.
                    </p>
                </Container>
            </>
        );
    }

    componentDidMount() {
        document.title = `About — MARCS`;
    }
}
