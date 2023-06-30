import React from 'react';
import confirmLicense from 'components/controls/AcceptLicenseModal'
import { useMatomo } from '@datapunt/matomo-tracker-react';

export default function LicensedLink(props) {
    const { href, text, className, role } = props;
    const { trackEvent } = useMatomo()

    const handleClick = async (e) => {
        e.preventDefault()

        if (await confirmLicense(trackEvent)) {
            // Proceed with download only if license confirmed
            window.location.replace(href);
        }
    }

    return (
        <a href={href} onClick={ handleClick } rel="noopener noreferrer"  target="_blank" className={className} role={role}>{text}</a>
    )
}