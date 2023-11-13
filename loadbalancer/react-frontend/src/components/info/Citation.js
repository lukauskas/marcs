import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/esm/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const equalContribTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      These authors contributed equally
    </Tooltip>
  );

export default function Citation(props) {
    const { intro } = props;

    return (
        <>
            <blockquote className="blockquote mb-0">
                <p>
                    {intro}
                    <OverlayTrigger placement="bottom" overlay={equalContribTooltip}>
                    {
                        ({ ref, ...triggerHandler }) => (
                        <Button
                            variant="link"
                            ref={ref}
                            {...triggerHandler}
                            className="d-inline-flex"
                            style={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, fontWeight: 'bold' }}
                        >
                        * Lukauskas, S.,
                        * Tvardovskiy, A.,
                        * Nguyen, N. V.
                        </Button>
                        )
                    }
                    </OverlayTrigger>,
                    Stadler, M.,
                    Faull, P.,
                    Ravnsborg, T.,
                    Özdemir Aygenli, B.,
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
                    <em>Decoding Chromatin States by Proteomic Profiling of Nucleosome Readers</em>
                    {' '}
                    Accepted (2023). 
                    {' '}<strong>*</strong> equal contribution. 
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