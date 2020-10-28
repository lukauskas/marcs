import React, {useEffect} from 'react';
import Toast from 'react-bootstrap/Toast';
import PropTypes from 'prop-types';
import Badge from 'react-bootstrap/Badge';
import './styles/ErrorToast.css';
import {useMatomo} from "@datapunt/matomo-tracker-react";

export default function ErrorToast(props) {

    const { onClose, title, errorMessage, badgeVariant, errorType } = props;
    const { trackEvent } = useMatomo();

    useEffect(() => {
        trackEvent({
            category: 'error',
            action: 'error-toast-shown',
            name: errorType,
            value: errorMessage,
        });
    }, [errorMessage, errorType]);

    return (
        <div
            // aria-live="polite"
            //  aria-atomic="true"
            className="d-flex justify-content-center align-items-center error-toast-container"
        >

            <Toast role="alert" onClose={onClose}>
                <Toast.Header>
                    <Badge variant={badgeVariant} className="mr-1">{errorType}</Badge>
                    <span style={{ color: 'black' }}>{title}</span>
                </Toast.Header>
                <Toast.Body>
                    <p>{errorMessage}</p>
                    <p>Try refreshing the page. If the problem persists, contact the administrator.</p>
                </Toast.Body>
            </Toast>
        </div>
    );
}


ErrorToast.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    title: PropTypes.string,
    // children: PropTypes.node.isRequired,
    errorMessage: PropTypes.string.isRequired,
    onClose: PropTypes.any,
    errorType: PropTypes.string,
    badgeVariant: PropTypes.string,
};

ErrorToast.defaultProps = {
    title: '',
    onClose: null,
    errorType: 'Error',
    badgeVariant: 'danger',
};
