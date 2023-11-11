import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import VersionInfo from "../info/VersionInfo";
import Citation from "../info/Citation";
import Button from "react-bootstrap/Button";

import './styles/about.css'
import MatomoPageView from "../matomo/MatomoPageView";
import LicenseBadge from "../info/LicenseBadge";
import LicenseStatement from "../info/LicenseStatement";

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
                    <LicenseBadge href="https://creativecommons.org/licenses/by-nc-sa/4.0/" title="Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)"/>
                    <LicenseStatement />
                    <p>
                        For enquiries about commercial uses of the data please contact
                        {' '}
                        <a href="https://www.helmholtz-munich.de/en/ife/staff">Till Bartke</a> (till.bartke at helmholtz-munich dot de’).
                    </p>
                </Container>
            </>
        );
    }

    componentDidMount() {
        document.title = `About — MARCS`;
    }
}
