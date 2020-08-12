import React from 'react';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';
import './styles/PullDownBadges.css';
import { PULL_DOWNS } from 'data/pull_downs';

export default function PullDownBadges(props) {
    const { identifier, width, height } = props;
    const { predictors } = PULL_DOWNS[identifier];

    const nH3ac = Object.entries(predictors).filter(([k, v]) => (k.startsWith('H3') && v === 'ac')).length;
    const nH4ac = Object.entries(predictors).filter(([k, v]) => (k.startsWith('H4') && v === 'ac')).length;

    const h3badges = [];
    const h4badges = [];
    const h2azbadges = [];
    const m5cbadges = [];

    let alreadyHaveH3 = false;
    let alreadyHaveH4 = false;

    Object.entries(predictors).forEach(([k, value]) => {
        if (k === 'DNA Methylation') {
            m5cbadges.push((
                <Badge variant="m5c" key={value}>{value}</Badge>
            ));
        } else if (k === 'H2A.Z') {
            h2azbadges.push((
                <Badge variant="h2az" key={k}>{k}</Badge>
            ));
        } else if (k.startsWith('H3')) {
            if ((value === 'ac') && (nH3ac === 5)) {
                if (alreadyHaveH3) return;
                h3badges.push(<Badge variant={value} className="ml-1" key="5-ac">5-ac</Badge>);
                alreadyHaveH3 = true;
                return;
            }
            const shortKey = k.slice(2);
            const text = `${shortKey}${value}`;
            h3badges.push(<Badge variant={value} className="ml-1" key={text}>{text}</Badge>);
        } else if (k.startsWith('H4')) {
            if ((value === 'ac') && (nH4ac === 4)) {
                if (alreadyHaveH4) return;
                h4badges.push(<Badge variant={value} className="ml-1" key="4-ac">4-ac</Badge>);
                alreadyHaveH4 = true;
                return;
            }
            const shortKey = k.slice(2);
            const text = `${shortKey}${value}`;
            h4badges.push(<Badge variant={value} className="ml-1" key={text}>{text}</Badge>);
        }
    });

    if (h3badges.length === 0) {
        h3badges.push(<span className="text-muted ml-1" key="unmodh3">(unmodified)</span>);
    }

    if (h4badges.length === 0) {
        h4badges.push(<span className="text-muted ml-1" key="unmodh4">(unmodified)</span>);
    }

    return (
        <div className="m-0 d-flex flex-row" style={{ width: width, height: height }}>
            <div className="d-flex h-100 px-1" style={{ width: '55px'}}>
                <span className="align-self-center">
                    <strong>
                        {identifier}
                    </strong>
                </span>
            </div>
            <div className="d-flex h-100 w-100">
                <div className="d-flex h-100 flex-column px-1" style={{ width: '70%'}}>
                    <div className="h-50 d-flex align-items-center mb-1">
                        H3:
                        {h3badges}
                    </div>
                    <div className="h-50 d-flex align-items-center">
                        H4:
                        {h4badges}
                    </div>
                </div>
                <div className="d-flex h-100 flex-column p-x1" style={{ width: '30%'}}>
                    <div className="h-50 d-flex align-items-center mb-1">
                        {m5cbadges.length > 0 ? 'DNA: ' : h2azbadges}
                    </div>
                    <div className="h-50 d-flex align-items-center">
                        {m5cbadges}
                    </div>
                </div>
            </div>
        </div>
    );
}

PullDownBadges.propTypes = {
    identifier: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
};

PullDownBadges.defaultProps = {
    width: '100%',
    height: '100%',
};

