import React, { PureComponent } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
// eslint-disable-next-line import/no-unresolved
import { PULL_DOWNS } from 'data/pull_downs';
import { connect } from 'react-redux';
import { changeSelection } from 'components/stores/actions/pullDownSelect';
import PropTypes from 'prop-types';
import 'components/controls/css/geneSelect.css';
import PullDownBadges from 'components/common/PullDownBadges';
import ReactMultiselectCheckboxes
    from 'react-multiselect-checkboxes/lib/ReactMultiselectCheckboxes';
import _ from 'lodash';
import Form from 'react-bootstrap/Form';
import CheckboxWithIndeterminate from 'react-multiselect-checkboxes/lib/CheckboxWithIndeterminate';
import { css } from 'emotion';

function getOptions() {
    return Object.entries(PULL_DOWNS).map(([key, pd]) => {
        const {
            type, subtype, predictors, name,
        } = pd;

        const d = {
            key,
            type,
            subtype,
            name,
        };


        const search = [key];

        Object.entries(predictors).forEach(([k, value]) => {
            if (k === 'DNA Methylation') {
                search.push(k.toLowerCase());
                search.push(value.toLowerCase());
            } else if (k === 'H2A.Z') {
                search.push(k.toLowerCase());
            } else {
                search.push(`${k}${value}`.toLowerCase());
            }
        });

        d.search = search;
        d.badges = <PullDownBadges identifier={key} />;
        d.label = key;
        d.value = key;

        return d;
    });
}

const OPTIONS = getOptions();

function filterOption(option, rawInput) {
    const { search } = option.data;
    const input = rawInput.toLowerCase();
    return search.some(x => x.indexOf(input) > -1);
}

function optionLabel(option) {
    const { badges } = option;

    return badges;
}

function dropDownLabel({ value }) {
    const nSelected = value.length;
    const nTotal = OPTIONS.length;

    return { nSelected, nTotal };
}

function buttonGenerator(variantFunc) {
    // eslint-disable-next-line react/prop-types
    return function BootstrapDropdownButton({ onPress, children, iconAfter }) {
        const { nSelected, nTotal } = children;
        const variant = variantFunc(nSelected, nTotal);
        return (
            <Dropdown.Toggle variant={variant} onClick={onPress} size="sm">
                { `${nSelected}/${nTotal} selected` }
            </Dropdown.Toggle>
        );
    };
}

function CustomCheckboxOption(props) {
    const {
        // eslint-disable-next-line react/prop-types
        children,
        // eslint-disable-next-line react/prop-types
        className,
        // eslint-disable-next-line react/prop-types
        cx,
        // eslint-disable-next-line react/prop-types
        getStyles,
        // eslint-disable-next-line react/prop-types
        isDisabled,
        // eslint-disable-next-line react/prop-types
        isFocused,
        // eslint-disable-next-line react/prop-types
        isSelected,
        // eslint-disable-next-line react/prop-types
        innerRef,
        // eslint-disable-next-line react/prop-types
        innerProps,
    } = props;

    const cxName = cx(
        css(getStyles('option', props)),
        {
            option: true,
            'option--is-disabled': isDisabled,
            'option--is-focused': isFocused,
            'option--is-selected': isSelected,
        },
        className,
    );

    return (
        <div
            ref={innerRef}
            className={`${cxName} d-flex flex-row`}
            {...innerProps}
        >
            <div className="d-flex h-100 px-1 align-items-center" style={{ width: '30px' }}>
                <CheckboxWithIndeterminate readOnly type="checkbox" checked={isSelected} />
            </div>
            <div className="d-flex w-100 h-100">
                {children}
            </div>
        </div>
    );
}

const customStyles = {
    option: (provided, opts) => {
        if (opts.isSelected) {
            return {
                ...provided,
                color: '#000',
                minWidth: 300,
                height: '50px',
                fontSize: '10pt',
                backgroundColor: 'transparent',
                borderBottom: 'solid 1px #F0F0F0',
                ':hover': { backgroundColor: '#DEEBFF' },
            };
        }
        return {
            ...provided,
            backgroundColor: 'transparent',
            minWidth: 300,
            height: '50px',
            fontSize: '10pt',
            borderBottom: 'solid 1px #F0F0F0',
            ':hover': { backgroundColor: '#DEEBFF' },
        };
    },
};


export class PullDownSelect extends PureComponent {
    handleChange = (value) => {
        let validatedValue = value;
        if ((validatedValue === null) || (validatedValue === undefined)) {
            validatedValue = [];
        }

        const keys = _.uniq(validatedValue.map(x => x.key));
        const { dispatch } = this.props;
        dispatch(changeSelection(keys));
    };

    getValue = () => {
        const { selected } = this.props;
        return OPTIONS.filter(x => selected.includes(x.key));
    };

    render() {
        const value = this.getValue();
        const { variantSelectFunc } = this.props;

        return (
            <>
                <Form.Group id="pulldown-selector">
                    <Form.Label>Selected Pull-Downs:</Form.Label>
                    <ReactMultiselectCheckboxes
                        options={OPTIONS}
                        value={value}
                        filterOption={filterOption}
                        getOptionLabel={optionLabel}
                        getDropdownButtonLabel={dropDownLabel}
                        components={{
                            DropdownButton: buttonGenerator(variantSelectFunc),
                            Option: CustomCheckboxOption,
                        }}
                        onChange={this.handleChange}
                        styles={customStyles}
                    />
                </Form.Group>
            </>
        );
    }
}

PullDownSelect.propTypes = {
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    dispatch: PropTypes.func.isRequired,
    variantSelectFunc: PropTypes.func,
};

PullDownSelect.defaultProps = {
    variantSelectFunc(selected, total) {
        if (selected === 0) {
            return 'danger';
        }
        if (selected === total) {
            return 'success';
        }
        return 'danger';
    },
};

function mapStateToProps(state) {
    const props = {};
    props.selected = state.pullDowns.selection;
    return props;
}

export default connect(mapStateToProps)(PullDownSelect);
