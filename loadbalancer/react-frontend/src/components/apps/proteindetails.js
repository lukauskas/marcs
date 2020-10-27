import React, {PureComponent} from 'react';
import HeatmapToolbox from 'components/controls/toolboxes/heatmaptoolbox';
import Container from 'react-bootstrap/Container';
import HeatmapComponent from 'components/visualisation/heatmap/HeatmapComponent';
import './styles/common.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MarcsJoyride from "components/tour/MarcsJoyride";
import SmallInteractionNetwork from '../visualisation/network/SmallInteractionNetwork';
import ProteinPTMResponses from '../visualisation/ptmResponse/ProteinPTMResponses';
import MatomoPageView from "../matomo/MatomoPageView";

class ProteinDetails extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { tourEnabled } = this.props;
        const tourSteps = [
            {
                target: '#gene-selector',
                content: (
                    <div>
                        <p>
                            To start the visualisation, select one or more proteins here.
                            MARCS will automatically fetch other proteins whose binding profile
                            is similar, unless you disable the checkbox below.
                        </p>
                        <p className="mb-0">
                            <small>
                                Click &quot;continue tour&quot; if you want to see a tour of MARCS
                                features or close this window to skip it
                            </small>
                        </p>
                    </div>
                ),
                placementBeacon: 'left',
                disableBeacon: true,
                styles: {
                },
            },
            {
                target: '#component-heatmap',
                content: 'The heatmap of protein binding responses will be drawn here for all proteins selected. Additional information is displayed when hovering this plot.',
                disableBeacon: true,
                placement: 'top',
            },
            {
                target: '#component-networks',
                content: 'Additionally, the inferred protein interaction network will be displayed here to show links between selected and related proteins.',
                disableBeacon: true,
                placement: 'right',
            },
            {
                target: '#compontent-protein-responses',
                content: 'MARCS will also estimate the key binding determinants of your proteins, based on the heatmap profile, and will list them here for you.',
                disableBeacon: true,
                placement: 'left',
            },
            {
                target: '#pulldown-selector',
                content: 'You can customise the heatmap as you prefer. For instance, you can deselect Pull-Down experiments that are displayed using this dropdown.',
                disableBeacon: true,
            },
            {
                target: '#cluster-pds-selector',
                content: 'Tick this checkbox if you want the columns of the heatmap to be clustered hierarchically. Otherwise the default order of pull-downs will be used.',
                disableBeacon: true,
            },
            {
                target: '#heatmap-annotation-selector',
                content: 'Flip this switch if you prefer the heatmap to be annotated with protein domains instead of protein complex memberships.',
                disableBeacon: true,
            },
        ];

        return (
            <>
                <MatomoPageView />
                <div className="app">
                    <HeatmapToolbox>
                        <MarcsJoyride steps={tourSteps} tourEnabled={tourEnabled} />
                    </HeatmapToolbox>
                    <Container className="fitcontent-container">
                        <div className="row mb-3">
                            <div className="col-12 col-md-4 p-1" id="component-networks">
                                <SmallInteractionNetwork />
                            </div>
                            <div className="col-12 col-md-8 p-1" id="component-protein-responses">
                                <ProteinPTMResponses />
                            </div>
                        </div>
                        <div className="row" id="component-heatmap">
                            <div className="col-12 p-1">
                                <HeatmapComponent />
                            </div>
                        </div>
                    </Container>
                </div>
            </>
        );
    }
}

function proteinDetailsAreSetToDefaultSettings(state) {
    // Return whether the state is the default setting

    const { heatmapControl, geneSelect, pullDowns } = state;

    if (heatmapControl.clusterPDs) return false;
    if (heatmapControl.annotationType !== 'complex') return false;
    if (geneSelect.selected_gene_keys.length !== 0) return false;

    // Don't know why but at initial render
    // pulldowns selection is equal to zero
    // this should probably be fixed somewhere upstream
    // but for now a workaround will do
    if ((pullDowns.selection.length !== 55) && (pullDowns.selection.length > 0)) return false;
    return true;
}


ProteinDetails.propTypes = {
    tourEnabled: PropTypes.bool.isRequired,
};


function mapStateToProps(state) {
    const props = {};
    // Only enable the tour if no options are selected
    props.tourEnabled = proteinDetailsAreSetToDefaultSettings(state);
    return props;
}
export default connect(mapStateToProps)(ProteinDetails);
