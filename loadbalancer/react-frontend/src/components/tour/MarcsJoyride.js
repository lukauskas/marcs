import React from 'react';
import Joyride from 'react-joyride';
import PropTypes from 'prop-types';
import { MarcsBeacon } from './MarcsBeacon';
import {withMatomoTrackEvent} from '../matomo/MatomoTrackEvent';

class _MarcsJoyride extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showBeacon: false,
            showTour: false,
        };
    }

    componentDidMount() {
        // Tour should be enabled only once;
        const { tourEnabled } = this.props;

        this.setState({
            showBeacon: tourEnabled,
        });
    }

    disableTour = () => {
        this.setState({
            showBeacon: false,
            showTour: false,
        });
    };

    closeTour = () => {
        const { trackEvent } = this.props;

        trackEvent({
            category: 'tour',
            action: 'stop',
        });

        this.disableTour();
    };

    startTour = () => {
        const { trackEvent } = this.props;

        trackEvent({
            category: 'tour',
            action: 'start',
        });

        this.setState({
            showTour: true,
            showBeacon: false,
        });
    };

    render() {
        const { steps, tourEnabled, disableScrolling } = this.props;
        const { showBeacon, showTour } = this.state;


        let beacon = null;
        if (showBeacon && tourEnabled) {
            beacon = <MarcsBeacon onClick={this.startTour} />;
        }

        const runTour = showTour && tourEnabled;

        return (
            <>
                {beacon}
                <Joyride
                    steps={steps}
                    run={runTour}
                    continuous
                    hideBackButton
                    showProgress
                    showSkipButton
                    locale={{
                        skip: 'Skip tour',
                        next: 'Continue tour',
                        last: 'Finish tour',
                    }}
                    floaterProps={{
                        disableAnimation: true,
                        styles: {
                            wrapper: {
                                cursor: 'auto',
                            },
                        },
                        wrapperOptions: {
                        // placement: 'left',
                            offset: 20,
                        },
                    }}
                    callback={(data) => {
                        if (data.action === 'close') {
                            this.closeTour();
                        }
                    }}
                    styles={{
                        options: {
                            primaryColor: '#4BA0B5',
                        },
                    }}
                    disableScrolling={disableScrolling}
                />
            </>
        );
    }
}

_MarcsJoyride.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object).isRequired,
    tourEnabled: PropTypes.bool.isRequired,
    disableScrolling: PropTypes.bool,
    trackEvent: PropTypes.func.isRequired,
};

_MarcsJoyride.defaultProps = {
    disableScrolling: false,
};

export default withMatomoTrackEvent(_MarcsJoyride);
