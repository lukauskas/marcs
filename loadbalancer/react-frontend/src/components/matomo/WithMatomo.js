import React from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';

export const withMatomo = (Component) => (props) => {
    const { trackEvent, trackSiteSearch } = useMatomo();

    return <Component trackEvent={trackEvent} trackSiteSearch={trackSiteSearch} {...props} />;
};
