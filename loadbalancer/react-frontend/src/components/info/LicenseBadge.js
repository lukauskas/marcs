import React from 'react';
import PropTypes from 'prop-types';

export default function LicenseBadge(props) {
    const {
        variant, href, title, alt,
    } = props;

    if (variant === 'large') {
        return (
            <p>
                <a href={href} title={title}>
                    <img
                        src="/static/by-nc-sa.eu.large.svg"
                        alt={alt}
                        style={{ height: 50 }}
                    />
                </a>
            </p>
        );
    }
    return (
        <a href={href} title={title}>
            <img src="/static/by-nc-sa-small.svg" alt={alt} style={{ height: 20 }} />
        </a>
    );
}

LicenseBadge.propTypes = {
    variant: PropTypes.oneOf(['large', 'small']),
    href: PropTypes.string.isRequired,
    alt: PropTypes.string,
    title: PropTypes.string,
};

LicenseBadge.defaultProps = {
    variant: 'large',
    alt: '[CC BY NC SA]',
    title: 'CC BY NC SA',
};
