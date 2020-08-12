import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import './styles/footer.css';

export default class Footer extends Component {
    render() {
        return (
            <Navbar expand="md" variant="light" id="footer" fixed="bottom">
                <span className="ml-auto navbar-text">
                    <a href="/about">About us</a>
                    {' / '}
                    <a href="/about#license">License & Privacy Policy</a>
                </span>
            </Navbar>
        );
    }
}
