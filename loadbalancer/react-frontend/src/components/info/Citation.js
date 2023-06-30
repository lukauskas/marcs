import React from 'react';
import PropTypes from 'prop-types';

export default function Citation(props) {
    const { intro } = props;

    return (
        <>
            <blockquote className="blockquote mb-0">
                <p>
                    {intro}
                    Lukauskas, S.,
                    Nguyen, N. V.,
                    Tvardovskiy, A.,
                    Stadler, M.,
                    Faull, P.,
                    Flynn, H.,
                    Lindeboom, R. G. H.,
                    Barth, T. K.,
                    Ravnsborg, T.,
                    Hauck, S. M.,
                    Jensen, O. N.,
                    Vermeulen, M.,
                    Snijders, A. P.,
                    Müller, C. L.,
                    Schneider, R.,
                    DiMaggio, P. A.,
                    and Bartke, T.
                    {' '}
                    <em>Decoding Chromatin States by Proteomic Profiling of Modification-Dependent Nucleosome Readers.</em>
                    {' '}
                    Submitted for publication (2022).
                </p>
            </blockquote>
        </>
    );
}

Citation.propTypes = {
    intro: PropTypes.string,
}

Citation.defaultProps = {
    intro: '',
};