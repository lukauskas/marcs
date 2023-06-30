import React, { PureComponent, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import LicenseBadge from 'components/info/LicenseBadge';
import { confirmable, createConfirmation } from "react-confirm";
import PropType from 'prop-types';
import store from 'components/stores/main'
import { acceptLicenseAction } from 'components/stores/actions/licenseActions'
import { useMatomo } from '@datapunt/matomo-tracker-react';

class AcceptLicenseModal extends React.Component {
    render () {
        const { show, proceed } = this.props;

        return (
            <>
                <Modal
                show={show}
                onHide={() => proceed(false)}
                backdrop="static"
                keyboard={false}
                >
                <Modal.Header>
                    <Modal.Title>One small thing...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Before we can proceed with the download, we have to ask you
                    to accept the terms and conditions of the
                    {" "}
                    <LicenseBadge
                        variant="small"
                        title="CC NC BY SA"
                        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                    /> license.
                    </p>
                    <p>
                    You can read more about it on the <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons webpage</a>.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => proceed(false) }>
                    Cancel download
                    </Button>
                    <Button variant="primary" onClick={ () => proceed(true) } >Accept license terms</Button>
                </Modal.Footer>
                </Modal>
            </>
        );
    }
}

AcceptLicenseModal.propTypes = {
    show: PropType.bool.isRequired,
    proceed: PropType.func.isRequired, // called when ok button is clicked.
};

export default async function confirmLicense (trackEvent=null) {

    const {license} = store.getState()

    const tryTrack = (params) => {
        if (trackEvent !== null) return trackEvent(params)
    };

    if (license.acceptedLicense) {
        tryTrack({
            category: 'download-with-license-check',
            action: 'license-previously-accepted',
        });
        // License already accepted
        return true
    } else {
        tryTrack({
            category: 'download-with-license-check',
            action: 'ask-to-accept-license',
        });

        if (await createConfirmation(confirmable(AcceptLicenseModal))()) {
            tryTrack({
                category: 'download-with-license-check',
                action: 'license-accepted',
            });
            store.dispatch(acceptLicenseAction());
            return true;
        }
        else {
            tryTrack({
                category: 'download-with-license-check',
                action: 'license-declined',
            });
            return false;
        }
    }
}