import React from 'react';
import './style/beacon.css';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';

export class MarcsBeacon extends React.PureComponent {
    render() {
        const { onClick, title } = this.props;
        return (
            <button
                key="JoyrideBeacon"
                className="react-joyride__beacon beaconButton"
                type="button"
                data-test-id="button-beacon"
                onClick={onClick}
                title={title}
            >
                <Tooltip title="Click for a tour of MARCS features" position="top" distance={20}>
                    <span className="beaconInner" />
                    <span className="beaconOuter" />
                </Tooltip>
            </button>

        );
    }
}

MarcsBeacon.propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};

MarcsBeacon.defaultProps = {
    title: '',
};
