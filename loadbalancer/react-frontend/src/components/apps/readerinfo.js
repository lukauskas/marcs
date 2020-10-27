import React, { PureComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import PropTypes from 'prop-types';
import VolcanoAndTable from "../visualisation/readers/VolcanoAndTable";
import MarcsJoyride from "../tour/MarcsJoyride";
import MatomoPageView from "../matomo/MatomoPageView";

export default class ReaderInfo extends PureComponent {
    render() {
        const { ptm } = this.props;

        const tourSteps = [
            {
                target: '#ptmeffect-volcano-plot',
                content: (
                    <div>
                        <p>
                            The estimated effects of {ptm} to protein binding are shown in this volcano plot.
                            Each dot corresponds to a specific protein that we detect.

                            Estimated effects are displayed on the X axis, while the Y axis displays the Benjamini/Hochberg adjusted p-value which is dependent on the variability of the estimate.
                            Hover the proteins for more information.
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
                target: '#ptmeffect-table',
                content: 'The data displayed on the volcano plot on the left is reiterated here in a table format. Click individual rows to get more information about proteins. ',
                placementBeacon: 'top',
                disableBeacon: true,

            },
            {
                target: '#ptmeffect-table > nav',
                content: 'The table can be filtered as appropriate using these controls.',
                disableBeacon: true,
            },
        ];

        const title = `${ptm} effect estimates and reader proteins`;
        return (
            <>
                <MatomoPageView />
                <Jumbotron fluid>
                    <Container className="position-relative">
                        <h1>
                            {title}
                        </h1>
                        <p>
                            Estimates of {ptm} effects on binding of chromatin proteins
                            obtained by comparison of SILAC log&#8322; H/L ratios between nucleosomes
                            that differ by presence or absence of {ptm}.
                        </p>
                        <MarcsJoyride steps={tourSteps} tourEnabled={true} />
                    </Container>
                </Jumbotron>
                <Container className="pb-5">
                    <VolcanoAndTable ptm={ptm} />
                </Container>
            </>
        );
    }

    componentDidMount() {
        const { ptm } = this.props;
        document.title = `${ptm} effect estimates and reader proteins — MARCS`;
    }
}

ReaderInfo.propTypes = {
    ptm: PropTypes.string.isRequired,
};
