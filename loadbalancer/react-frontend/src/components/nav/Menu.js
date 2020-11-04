import React, { PureComponent } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';

import './styles/navigation.css';
import { connect } from 'react-redux';
import {PTM_PREDICTOR_ORDER, PTM_PREDICTOR_ORDER_WEBSAFE} from "data/ptms";

class Menu extends PureComponent {
    render() {
        const { activeKey } = this.props;

        const readerSeparatorAfter = ['H2A.Z', 'H3K27me3', 'H4K20me3'];

        const readerLinks = PTM_PREDICTOR_ORDER.map((x, i) => {
            const safe_x = PTM_PREDICTOR_ORDER_WEBSAFE[i];
            const uri = `/readers/${safe_x}`;
            let separator = null;
            if (readerSeparatorAfter.includes(x)) {
                const sepkey = `${x}-sep`;
                separator = (<div className="dropdown-divider" key={sepkey} />);
            }
            return (
                <React.Fragment key={safe_x}>
                    <NavDropdown.Item href={uri} key={safe_x}>
                        Readers of {x}
                    </NavDropdown.Item>
                    {separator}
                </React.Fragment>
            )
        });

        return (
            <Navbar bg="dark" expand="md" variant="dark">
                <Container>
                    <Navbar.Brand href="/">
                        MARCS
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="navbar-nav" className="">
                        <Nav className="mr-auto rounded" id="main-navbar-nav" activeKey={activeKey}>
                            <Nav.Link href="/" className="text-light" title="Explore">Explore</Nav.Link>
                            <Nav.Link href="/proteins" title="Proteins">Proteins</Nav.Link>
                            <Nav.Link href="/network" title="Network">Network</Nav.Link>
                            <Nav.Link href="/pds" title="Pull-Downs">
                                {/*Shorten labels for medium screens so it doesn't break in two lines*/}
                                <div className="d-lg-none d-none d-sm-none d-md-block">PDs</div>
                                <div className="d-sm-block d-md-none d-lg-block">Pull-Downs</div>
                            </Nav.Link>
                            <NavDropdown id="ptm-dropdown" title="Chromatin feature effects">
                                {readerLinks}
                            </NavDropdown>
                        </Nav>
                        <Nav className="justify-content-end" activeKey={activeKey}>
                            <NavDropdown title="About" id="about-dropdown">
                                 <NavDropdown.Item href="/about" title="About MARCS">MARCS</NavDropdown.Item>
                                 <NavDropdown.Item href="https://www.helmholtz-muenchen.de/ife/index.html" title="About IFE">Institute of Functional Epigenetics</NavDropdown.Item>
                                 <NavDropdown.Item href="https://www.helmholtz-muenchen.de/en/about-us/index.html" title="About HMGU">Helmholtz Zentrum München</NavDropdown.Item>
                                 <div className="dropdown-divider" />
                                 <NavDropdown.Item href="/about#license" title="License">License</NavDropdown.Item>
                                 <NavDropdown.Item href="/legal" title="Legal notice">Legal notice</NavDropdown.Item>
                                 <NavDropdown.Item href="/privacy" title="Privacy policy">Privacy policy</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Resources" id="data-dropdown">
                                <NavDropdown.Item href="/data/proteins" title="List of proteins">List of proteins</NavDropdown.Item>
                                <NavDropdown.Item href="/data/complexes" title="List of protein complexes">List of protein complexes</NavDropdown.Item>
                                <div className="dropdown-divider" />
                                <NavDropdown.Item href="/downloads" title="Downloads">Downloads</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}


Menu.propTypes = {
    activeKey: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
    return { activeKey: state.router.location.pathname };
}


export default connect(mapStateToProps)(Menu);
