import React, { Component, PureComponent } from 'react';
import Container from 'react-bootstrap/Container';
import NetworkToolbox from 'components/controls/toolboxes/networktoolbox';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Joyride from 'react-joyride';
import BigNetwork from '../visualisation/bignetwork/BigNetwork';
import MarcsJoyride from '../tour/MarcsJoyride';
import MatomoPageView from "../matomo/MatomoPageView";

class Network extends PureComponent {

    componentDidMount() {
        document.title = 'Regulatory Network — MARCS';
    }

    render() {
        const { tourEnabled } = this.props;

        const tourSteps = [
            {
                target: '#gene-selector',
                content: (
                    <div>
                        <p>
                            This page allows you to browse the network of protein interactions inferred by MARCS.
                            If you're looking for a particular protein or protein complex in the network,
                            type its name here and MARCS will highlight it for you.
                        </p>
                        <p className="mb-0">
                            <small>Click &quot;continue tour&quot; if you want to see a tour of the features of this page or close this window to skip it</small>
                        </p>
                    </div>
                ),
                disableBeacon: true,
                placementBeacon: 'left',
            },
            {
                target: '#bignetwork-vis',
                content: 'You can zoom and pan the network using standard mouse gestures.'
                         + 'Hover the nodes to display more information about the proteins.',
                placementBeacon: 'top',
                disableBeacon: true,

            },
            {
                target: '#network-colour-select',
                content: 'By default, the network is coloured by the protein communities.'
                         + 'Use this drop-down to colour the nodes based on the estimated effects of chromatin features.',
                disableBeacon: true,
            },
        ];

        return (
            <>
                <MatomoPageView />
                <NetworkToolbox>
                    <MarcsJoyride steps={tourSteps} tourEnabled={tourEnabled} disableScrolling />
                </NetworkToolbox>
                <Container>
                    <BigNetwork />
                </Container>
            </>
        );
    }
}

Network.propTypes = {
    tourEnabled: PropTypes.bool.isRequired,
};

function networkPageIsSetToDefaults(state) {
    const { geneSelect, network } = state;

    if (geneSelect.selected_gene_keys.length !== 0) return false;
    if (network.networkColor !== undefined) return false;

    return true;
}


function mapStateToProps(state) {
    const props = {};

    // Only enable the tour if no options are selected
    props.tourEnabled = networkPageIsSetToDefaults(state);

    return props;
}

export default connect(mapStateToProps)(Network);
