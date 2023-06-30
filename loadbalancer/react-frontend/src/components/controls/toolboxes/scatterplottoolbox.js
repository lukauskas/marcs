import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import GeneSelect from 'components/controls/GeneSelect';
import PullDownSelectDropdown from 'components/controls/PullDownSelectDropdown';
import { setShowImputed } from 'components/stores/actions/scatterplotControl';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMatomo } from "../../matomo/WithMatomo";

function variantSelectFunc(selected, total) {
    if (selected === 0) return 'danger';
    return 'success';
}

class _ScatterplotToolbox extends Component {

    toggleShowImputed = () => {
        const { dispatch, showImputed, trackEvent } = this.props;

        const newValue = !showImputed;

        trackEvent({
            category: 'interaction-with-vis-control',
            action: 'toggle',
            name: 'ScatterplotToolbox.showImputed',
            value: `${newValue}`,
        });

        dispatch(setShowImputed(newValue));
    };

    render() {

        const { showImputed, children } = this.props;

        return (
            <Jumbotron fluid>
                <Container className="position-relative">
                    <Row>
                        <Col lg={4} md={6} sm={12}>
                            <GeneSelect />
                        </Col>
                        <Col lg={2} md={2} sm={12}>
                            <PullDownSelectDropdown
                                variantSelectFunc={variantSelectFunc}
                            />
                        </Col>
                        <Col lg={4} md={4} sm={12}>
                            <Form.Group id="pulldown-additional-options">
                                <Form.Label>Additional options: </Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    checked={showImputed}
                                    onChange={this.toggleShowImputed}
                                    label="Show imputed values"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {children}
                </Container>
            </Jumbotron>
        );
    }
}

_ScatterplotToolbox.propTypes = {
    dispatch: PropTypes.func.isRequired,
    showImputed: PropTypes.bool.isRequired,
};


function mapStateToProps(state) {
    const { scatterplotControl } = state;
    const props = {
        showImputed: scatterplotControl.showImputed,
    };
    return props;
}

const ScatterplotToolboxWithTracking = withMatomo(_ScatterplotToolbox);
export default connect(mapStateToProps)(ScatterplotToolboxWithTracking);
