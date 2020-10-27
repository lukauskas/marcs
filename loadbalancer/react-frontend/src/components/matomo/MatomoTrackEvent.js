import React from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';

export const withMatomoTrackEvent = (Component) => (props) => {
    const { trackEvent } = useMatomo();

    return <Component trackEvent={trackEvent} {...props} />;
};
