import React from 'react';
import Badge from 'react-bootstrap/Badge';

export function ProteinBadge(props) {
    const { className, children } = props;
    return (
        <Badge variant="protein" className={className}>
            {children}
        </Badge>
    );
}

export function ComplexBadge(props) {
    const { className, children } = props;

    return (
        <Badge variant="complex" className={className}>
            {children}
        </Badge>
    );
}
