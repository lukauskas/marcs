import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import './styles/footer.css';

export default class Footer extends Component {
    render() {
        return (
            <Navbar expand="md" variant="light" id="footer" fixed="bottom">
                <span className="ml-auto navbar-text">
                    <a href="https://www.helmholtz-muenchen.de/en/imprint/index.html">Imprint</a>
                    {' | '}
                    <a href="#">Privacy policy</a>
                     {' | '}
                    <a href="/about#license" title="MARCS data is available under CC NC BY SA">
                        <img src="/static/by-nc-sa-small.svg" style={{ height: 20 }} />
                    </a>
                </span>
            </Navbar>
        );
    }
}
