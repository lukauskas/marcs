import React from 'react';
import { ComplexBadge, ProteinBadge } from 'components/common/ProteinBadges';

export function singleComplexFormatter(cell) {
    const link = `/proteins?k=c:${cell}`;
    return (
        <a href={link} rel="noopener noreferrer" target="_blank"><ComplexBadge>{cell}</ComplexBadge></a>
    );
}

export function multiProteinFormatter(cell) {
    const links = cell.map((x) => {
        const link = `/proteins?k=p:${x}`;
        return <li className="list-inline-item" key={x}><a href={link} rel="noopener noreferrer" target="_blank"><ProteinBadge>{x}</ProteinBadge></a></li>;
    });
    return (
        <ul className="list-inline">
            { links }
        </ul>
    );
}

export function singleProteinFormatter(cell) {
    const link = `/proteins?k=p:${cell}`;
    return (
        <a href={link} rel="noopener noreferrer"><ProteinBadge>{cell}</ProteinBadge></a>
    );
}

export function multiComplexFormatter(cell) {
    const links = cell.map((x) => {
        const link = `/proteins?k=c:${x}`;
        return <li className="list-inline-item" key={x}><a href={link} rel="noopener noreferrer" target="_blank"><ComplexBadge>{x}</ComplexBadge></a></li>;
    });
    return (
        <ul className="list-inline">
            { links }
        </ul>
    );
}

export function listFormatter(cell) {
    const items = cell.map(x => <li className="list-inline-item" key={x}>{x}</li>);
    return (
        <ul className="list-inline">
            {items}
        </ul>
    );
}

export function sourcesFormatter(cell) {
    const links = cell.map((x) => {
        const { type: sourceType, identifier: sourceId } = x;
        let link = '#';
        const content = `${sourceType}:${sourceId}`;
        if (sourceType === 'doi') {
            link = `https://dx.doi.org/${sourceId}`;
        } else if (sourceType === 'ebi') {
            link = `https://www.ebi.ac.uk/complexportal/complex/${sourceId}`;
        } else if (sourceType === 'uniprot_search') {
            link = `https://www.uniprot.org/uniprot/?query=${sourceId}&sort=score`;
        } else if (sourceType === 'corum') {
            link = 'https://mips.helmholtz-muenchen.de/corum/';
        } else if (sourceType === 'epifactors') {
            link = 'http://epifactors.autosome.ru/protein_complexes';
        }

        return <li className="list-inline-item" key={content}><a href={link} rel="noopener noreferrer" target="_blank">{content}</a></li>;
    });
    return (
        <ul className="list-inline">
            {links}
        </ul>
    );
}

export function pValueFormatter(cell) {
    return (10 ** (-cell)).toExponential(4);
}
