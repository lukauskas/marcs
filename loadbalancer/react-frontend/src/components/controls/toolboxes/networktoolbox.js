import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import GeneSelect from 'components/controls/GeneSelect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NetworkColorSelect from '../NetworkColorSelect';

class _NetworkToolbox extends Component {
    render() {
        const { children } = this.props;
        return (
            <Jumbotron fluid>
                <Container className="position-relative">
                    <Row>
                        <Col lg={4} md={6} sm={12}>
                            <GeneSelect />
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <NetworkColorSelect />
                        </Col>
                    </Row>
                    {children}
                </Container>
            </Jumbotron>
        );
    }
}

_NetworkToolbox.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(_NetworkToolbox);
