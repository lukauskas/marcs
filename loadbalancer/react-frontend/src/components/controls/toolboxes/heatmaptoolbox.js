import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import GeneSelect from 'components/controls/GeneSelect';
import PullDownSelectDropdown from 'components/controls/PullDownSelectDropdown';
import Form from 'react-bootstrap/Form';
import { setClusterPds, setAnnotationType } from 'components/stores/actions/heatmapControl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import _ from 'lodash';
import {withMatomo} from "../../matomo/WithMatomo";

class _HeatmapToolbox extends Component {
    toggleClusterPDs = () => {
        const { dispatch, clusterPDs, trackEvent } = this.props;

        const newValue = !clusterPDs;

        trackEvent({
            category: 'interaction-with-vis-control',
            action: 'toggle',
            name: 'HeatmapToolbox.clusterPDs',
            value: `${newValue}`,
        });

        dispatch(setClusterPds(newValue));
    };

    changeAnnotationType = (newValue) => {
        const { dispatch, trackEvent } = this.props;

        trackEvent({
            category: 'interaction-with-vis-control',
            action: 'toggle',
            name: 'HeatmapToolbox.annotationType',
            value: `${newValue}`,
        });

        dispatch(setAnnotationType(newValue));
    };

    // This is definitely not the right place to have this function...
    updatePageTitle = () => {
        const { selectedKeys } = this.props;

        const selectedList = selectedKeys.map(x => x.substring(2));

        if (selectedList.length === 0) {
            document.title = 'Protein pages — MARCS';
        } else if (selectedList.length === 1) {
            const firstSelected = selectedList[0];
            document.title = `Chromatin states bound by ${firstSelected} — MARCS`;
        } else if (selectedList.length === 2) {
            const firstSelected = selectedList[0];
            const secondSelected = selectedList[1];
            document.title = `Chromatin states bound by ${firstSelected} and ${secondSelected} — MARCS`;
        } else {
            const firstSelected = selectedList[0];
            const nOthers = selectedList.length - 1;
            document.title = `Chromatin states bound by ${firstSelected} and ${nOthers} others — MARCS`;
        }
    };

    componentDidMount() {
        this.updatePageTitle();
    }

    componentDidUpdate(prevProps) {
        const { selectedKeys } = this.props;
        const { selectedKeys: prevSelectedKeys } = prevProps;

        if (!_.isEqual(selectedKeys, prevSelectedKeys)) {
            this.updatePageTitle();
        }
    }

    render() {
        const { clusterPDs, annotationType, children } = this.props;

        return (
            <Jumbotron fluid>
                <Container className="position-relative">
                    <Row>
                        <Col lg={4} md={6} sm={12}>
                            <GeneSelect />
                        </Col>
                        <Col lg={2} md={4} sm={12}>
                            <PullDownSelectDropdown />
                            <Form.Group controlId="form-cluster-pds-heatmap" id="cluster-pds-selector">
                                <Form.Check
                                    type="checkbox"
                                    label="Cluster PDs in heatmap"
                                    checked={clusterPDs}
                                    onChange={this.toggleClusterPDs}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={2} md={2} sm={12}>
                            <Form.Group id="heatmap-annotation-selector">
                                <Form.Label className="mr-3" style={{width: '100%'}}>
                                    Annotate with:
                                </Form.Label>
                                <ToggleButtonGroup
                                    type="radio"
                                    value={annotationType}
                                    name="annotationType"
                                    onChange={this.changeAnnotationType}
                                >
                                    <ToggleButton
                                        value="complex"
                                        variant="outline-secondary"
                                        size="sm"
                                    >
                                        Complexes
                                    </ToggleButton>
                                    <ToggleButton
                                        value="domain"
                                        variant="outline-secondary"
                                        size="sm"
                                    >
                                        Domains
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                    {children}
                </Container>
            </Jumbotron>
        );
    }
}

_HeatmapToolbox.propTypes = {
    dispatch: PropTypes.func.isRequired,
    clusterPDs: PropTypes.bool.isRequired,
    annotationType: PropTypes.string.isRequired,
    selectedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};


function mapStateToProps(state) {
    const props = {};

    const { heatmapControl, geneSelect } = state;

    props.clusterPDs = heatmapControl.clusterPDs;
    props.annotationType = heatmapControl.annotationType;
    props.selectedKeys = geneSelect.selected_gene_keys;

    return props;
}

const _HeatmapToolboxWithTracking = withMatomo(_HeatmapToolbox);
export default connect(mapStateToProps)(_HeatmapToolboxWithTracking);
