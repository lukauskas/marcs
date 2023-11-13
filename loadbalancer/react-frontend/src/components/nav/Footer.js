import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import './styles/footer.css';
import Nav from "react-bootstrap/Nav";
import LicenseBadge from "../info/LicenseBadge";

export default class Footer extends Component {
    render() {
        return (
            <footer className="mt-auto py-3">
                <Navbar expand="md" variant="light" id="footer" fixed="bottom">
                    <span className="mr-auto navbar-text">
                        {/*For medium+ screens, show logos*/}
                        <div className="d-none d-md-block">
                            <span>
                                <a href="https://www.helmholtz-munich.de/en" title="Helmholtz Munich">
                                    <img src="/static/hmgu-logo.svg" style={{ height: 25 }} alt="Helmholtz Munich" />
                                </a>
                            </span>
                            <span className="ml-3">
                                <a href="https://www.helmholtz-munich.de/en/ife" title="Institute of Functional Epigenetics">
                                    <img src="/static/ife-logo.png" style={{ height: 25 }} alt="IFE: Institute of Functional Epigenetics" />
                                </a>
                            </span>
                            <span className="ml-3">
                                <a href="https://cloud.denbi.de/" title="deNBI: German Network For Bioinformatics Infrastructure">
                                    <img src="/static/denbi-logo-color.svg" style={{ height: 25 }} alt="deNBI: German Network For Bioinformatics Infrastructure" />
                                    &nbsp;
                                    MARCS is hosted on the de.NBI Cloud
                                </a>                            
                            </span>
                        </div>
                    </span>
                    <span className="ml-auto navbar-text">
                        {/* For small screens show HMGU and IFE links as text */}
                        <span className="d-md-none d-sm-inline">
                            <a href="https://www.helmholtz-munich.de/en" title="Helmholtz Munich">
                                HMGU
                            </a>
                            {' | '}
                            <a href="https://www.helmholtz-munich.de/en/ife" title="Institute of Functional Epigenetics">
                                IFE
                            </a>
                            {' | '}
                        </span>
                        <a href="/legal">Legal notice</a>
                        {' | '}
                        <a href="/privacy">Privacy policy</a>
                        {' | '}
                        <LicenseBadge
                            variant="small"
                            title="MARCS data is available under CC NC BY SA"
                            href="/about#license"
                        />
                    </span>
                </Navbar>
            </footer>
        );
    }
}
