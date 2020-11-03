import React from 'react';

import { MATOMO_URL_BASE } from 'data/matomo';
import { isMatomoDisabled } from './helpers';

const MatomoOptoutForm = () => {
    if (isMatomoDisabled()) {
        return (<div id="matomo-ouptout">[Cannot display opt-out form as Matomo tracking has been disabled by administrator]</div>);
    }

    const urlBase = MATOMO_URL_BASE;
    const url = `${urlBase}index.php?module=CoreAdminHome&action=optOut&language=en&backgroundColor=&fontColor=&fontSize=16px&fontFamily=Helvetica`;
    return (
        <>
            <iframe
                className="cookieconsent-iframe-exception"
                style={{ border: 0, height: 100, width: '100%' }}
                src={url}
                title="Matomo opt-out"
            />
            <p>
                If your browser does not display the information about your tracking status
                and the option to opt-out in the frame above, you can access it via <a href={url}>this link instead</a>.
            </p>
        </>
    );
};

export default MatomoOptoutForm;
