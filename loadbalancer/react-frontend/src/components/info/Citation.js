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
                    Tvardovskiy, A.,
                    Nguyen, N. V.,
                    Stadler, M.,
                    Faull, P.,
                    Ravnsborg, T.,
                    Aygenli, B. Ö.,
                    Dornauer, S.,
                    Flynn, H.,
                    Lindeboom, R. G. H.,
                    Barth, T. K.,
                    Brockers, K.,
                    Hauck, S. M.,
                    Vermeulen, M.,
                    Snijders, A. P.,
                    Müller, C. L.,
                    DiMaggio, P. A.,
                    Jensen, O. N.,
                    Schneider, R.,
                    and Bartke, T.
                    {' '}
                    <em>Decoding Chromatin States by Proteomic Profiling of Modification-Dependent Nucleosome Readers.</em>
                    {' '}
                    Submitted for publication (2023).
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