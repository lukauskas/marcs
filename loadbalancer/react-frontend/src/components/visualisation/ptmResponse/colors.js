import chroma from 'chroma-js';
import React, { PureComponent } from 'react';
import { PTM_PREDICTORS } from 'data/ptms';
import './colorbar.css';
import PropTypes from 'prop-types';

const PTM_SCALE = chroma.scale('RdBu');

export function rangedFactorColorScale(ptm) {
    const { min: rangeMin, max: rangeMax } = PTM_PREDICTORS[ptm];
    return PTM_SCALE.domain([rangeMax, rangeMin]);
}

export class PTMColorBar extends PureComponent {
    render() {
        const colors = PTM_SCALE.colors(100).reverse();
        const {
            left, mid, right, title,
        } = this.props;

        const gradientSteps = colors.map(color => (<span key={color} className="grad-step" style={{ backgroundColor: color }} />));
        return (
            <>
                <div className="mt-3 p-0 text-center">
                    {title}
                </div>
                <div className="gradient px-1 my-0">
                    {gradientSteps}
                    <span className="domain-min">
                        {left}
                    </span>
                    <span className="domain-mid">
                        {mid}
                    </span>
                    <span className="domain-max">
                        {right}
                    </span>
                </div>
            </>
        );
    }
}

PTMColorBar.propTypes = {
    left: PropTypes.string,
    right: PropTypes.string,
    mid: PropTypes.string,
    title: PropTypes.string,
};

PTMColorBar.defaultProps = {
    left: '',
    mid: '',
    right: '',
    title: '',
};
