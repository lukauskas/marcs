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
                                <a href="https://www.helmholtz-muenchen.de" title="Helmholtz Zentrum München">
                                    <img src="/static/hmgu-logo.svg" style={{ height: 25 }} alt="HMGU logo" />
                                </a>
                            </span>
                            <span className="ml-3">
                                <a href="https://www.helmholtz-muenchen.de/ife/" title="Institute of Functional Epigenetics">
                                    <img src="/static/ife-logo-2.png" style={{ height: 25 }} alt="IFE: Institute of Functional Epigenetics" />
                                </a>
                            </span>
                        </div>
                    </span>
                    <span className="ml-auto navbar-text">
                        {/* For small screens show HMGU and IFE links as text */}
                        <span className="d-md-none d-sm-inline">
                            <a href="https://www.helmholtz-muenchen.de" title="Helmholtz Zentrum München">
                                HMGU
                            </a>
                            {' | '}
                            <a href="https://www.helmholtz-muenchen.de/ife/" title="Helmholtz Zentrum München">
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
