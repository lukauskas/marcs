import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import VersionInfo from "../info/VersionInfo";
import Citation from "../info/Citation";
import Button from "react-bootstrap/Button";

import './styles/about.css'

export default class AboutPage extends Component {
    render() {

        return (
            <>
                <Jumbotron fluid>
                    <Container>
                        <h1>
                            About MARCS: Modification Atlas of Regulation by Chromatin States
                        </h1>
                        <p>
                            MARCS is an information hub for protein interactions with chromatin states based
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
                    <h2>License & Privacy Policy</h2>
                    <a id="license"/>
                    <p>
                        While we intend to release this data with more open license in the future,
                        currently the website and data presented here are available only for review purposes.

                        If you intend to use the data in any other way please contact

                        saulius.lukauskas at helmholtz-muenchen dot de
                        and
                        till.bartke at helmholtz-muenchen dot de

                        for information.
                    </p>
                    <p>
                        We currently collect only server access and error logs,
                        but this may change in the future to include some minimal anonymous
                        usage monitoring.

                        We will update this privacy policy as appropriate.
                    </p>
                </Container>
            </>
        );
    }

    componentDidMount() {
        document.title = `About — MARCS`;
    }
}
