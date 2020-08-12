import React, { PureComponent } from 'react';
import { Form } from 'react-bootstrap';
import { PTM_PREDICTORS, PTM_PREDICTOR_ORDER } from 'data/ptms';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { PTMColorBar } from '../visualisation/ptmResponse/colors';
import { changeNetworkColor } from 'components/stores/actions/networks';


function mapStateToProps(state) {
    const props = {};

    const { network } = state;

    if (network.networkColor !== undefined) { props.selection = network.networkColor; }
    else { props.selection = 'communities'; }

    return props;
}

class NetworkColorSelect extends PureComponent {
    handleChange = (event) => {
        const { value } = event.target;
        const { dispatch } = this.props;
        dispatch(changeNetworkColor(value));
    };

    render() {
        const { selection } = this.props;

        const factorIsSelected = selection !== 'communities';

        const factorOptions = PTM_PREDICTOR_ORDER.map((x) => {
            const { name } = PTM_PREDICTORS[x];
            return {
                key: x,
                label: name,
            };
        });

        const options = [...factorOptions];
        const optionElements = options.map((x) => {
            const { key, label } = x;
            return <option key={key} value={key}>{label}</option>;
        });

        let additionalElement = null;

        if (factorIsSelected) {
            const { min: ptmMin, max: ptmMax } = PTM_PREDICTORS[selection];

            const left = `≤ ${ptmMin}`;
            const right = `≥ +${ptmMax}`;
            const mid = '0';
            const title = 'Estimated effect on log₂ H/L ratio';

            additionalElement = <PTMColorBar left={left} title={title} mid={mid} right={right} />;
        }
        return (
            <div id="network-colour-select">
                <Form.Group>
                    <Form.Label>Colour network by: </Form.Label>
                    <Form.Control as="select" onChange={this.handleChange} value={selection}>
                        <optgroup>
                            <option value="communities">Communities</option>
                        </optgroup>
                        <optgroup label="Average response to">
                            {optionElements}
                        </optgroup>
                    </Form.Control>
                    { additionalElement }
                </Form.Group>
            </div>
        );
    }
}

NetworkColorSelect.propTypes = {
    selection: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
};

NetworkColorSelect.defaultProps = {
    selection: 'communities',
};

export default connect(mapStateToProps)(NetworkColorSelect);
