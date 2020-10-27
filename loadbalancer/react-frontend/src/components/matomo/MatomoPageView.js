// Inspired by https://github.com/covid19-apptracker/covid19-apptracker/blob/a627f876a510c46a8944e4908220c945231ebd2e/src/components/analytics/Matomo.js
// (MIT)

import React, {useEffect} from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';

const MatomoPageView = ({ title }) => {
    const { trackPageView } = useMatomo();

    const params = {};

    if (title !== null) {
        params.documentTitle = title;
    }

    useEffect(() => {
        trackPageView(params);
    }, []);

    return (<div id="matomo-pageview" />);
};

MatomoPageView.propTypes = {
    title: PropTypes.string,
};

MatomoPageView.defaultProps = {
    title: null,
};

export default MatomoPageView;
