import React, {Component, PureComponent} from 'react';
import Container from 'react-bootstrap/Container';
import PullDownDeck from 'components/visualisation/scatterplot/PullDownDeck';
import ScatterPlotToolBox from 'components/controls/toolboxes/scatterplottoolbox';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Joyride from 'react-joyride';
import { ProteinDetails } from './proteindetails';
import MarcsJoyride from "../tour/MarcsJoyride";
import MatomoPageView from "../matomo/MatomoPageView";

class PullDowns extends PureComponent {
    componentDidMount() {
        document.title = 'SNAP datasets — MARCS';
    }

    render() {
        const { tourEnabled } = this.props;

        const tourSteps = [
            {
                target: '#pulldown-selector',
                content: (
                    <div>
                        <p>
                            This page allows you to directly browse the data from one or more SILAC Nucleosome Affinity Pull-Down experiments.
                            Use this dropdown to select the Pull-Down experiments you are interested in and start the visualisation.
                        </p>
                        <p className="mb-0">
                            <small>Click &quot;continue tour&quot; if you want to see a tour of the features of this page or close this window to skip it</small>
                        </p>
                    </div>
                ),
                placementBeacon: 'right',
                disableBeacon: true,
            },
            {
                target: '#gene-selector',
                content: 'Additionally, you can select a set of proteins to highlight on the Pull-Down scatterplot here. You can adjust the colour of annotations in the legend.',
                disableBeacon: true,
            },
            {
                target: '#pulldown-additional-options',
                content: 'Imputed values are not shown on the scatterplots by default. Tick this box to show them.',
                disableBeacon: true,
            },
            {
                target: '#component-pulldown-deck',
                content: 'The Pull-Downs you have selected will appear in this area. Hover the plots to see information about proteins.',
                disableBeacon: true,
            },
        ];

        return (
            <>
                <MatomoPageView title="pds" />
                <ScatterPlotToolBox>
                    <MarcsJoyride steps={tourSteps} tourEnabled={tourEnabled} />
                </ScatterPlotToolBox>
                <Container>
                    <PullDownDeck />
                </Container>
            </>
        );
    }
}

PullDowns.propTypes = {
    tourEnabled: PropTypes.bool.isRequired,
};

function pdsPageIsSetToDefaults(state) {
    // Return whether the state is the default setting

    const { scatterplotControl, geneSelect, pullDowns } = state;

    if (geneSelect.selected_gene_keys.length !== 0) return false;
    if (pullDowns.selection.length !== 0) return false;
    if (scatterplotControl.showImputed) return false;

    return true;
}


function mapStateToProps(state) {
    const props = {};

    // Only enable the tour if no options are selected
    props.tourEnabled = pdsPageIsSetToDefaults(state);

    return props;
}

export default connect(mapStateToProps)(PullDowns);
