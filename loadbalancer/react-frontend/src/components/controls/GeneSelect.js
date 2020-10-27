import React, { PureComponent } from 'react';
import Select, { components } from 'react-select';
import { connect } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { PROTEIN_COLOR, COMPLEX_COLOR } from 'components/common/colors';
import WindowedSelect from 'react-windowed-select';

// eslint-disable-next-line import/no-unresolved
import { GENE_SELECTOR_OPTIONS } from 'data/gene_options';
import { changeSelection, setShowSimilar } from 'components/stores/actions/geneSelect';
import './css/geneSelect.css';
import Badge from 'react-bootstrap/Badge';
import {withMatomoTrackEvent} from "../matomo/MatomoTrackEvent";

const OPTION_HEIGHT = 50;

const customStyles = {
    groupHeading: styles => ({
        ...styles,
        height: 25,
        maxHeight: 25,
        overflow: 'hidden',
    }),
    multiValue: (styles, { data }) => {
        const color = (data.type === 'p') ? PROTEIN_COLOR : COMPLEX_COLOR;
        return {
            ...styles,
            backgroundColor: color,
        };
    },
    multiValueLabel: styles => ({
        ...styles,
        color: 'white',
    }),
    multiValueRemove: styles => ({
        ...styles,
        color: 'white',
    }),
    option: styles => ({
        ...styles,
        fontSize: '10pt',
        height: OPTION_HEIGHT,
        maxHeight: OPTION_HEIGHT,
        overflow: 'hidden',
    }),
};


function mapStateToProps(state) {
    const props = {};

    const { geneSelect } = state;

    const keys = geneSelect.selected_gene_keys;

    props.value = keys.map(key => Object.assign(
        { value: key }, GENE_SELECTOR_OPTIONS[key],
    ));

    props.showSimilar = geneSelect.show_similar;

    return props;
}

const CustomMultiValue = props => (
    <components.MultiValue {...props}>
        {props.data.label}
    </components.MultiValue>
);

function formatOption([key, value]) {
    const {
        label,
        names,
        alternative_names: alternativeNames,
        long_names: longNames,
        proteins,
    } = value;

    const d = Object.assign({ key }, value);
    let searchQuery = [label];
    searchQuery = searchQuery.concat(names);
    searchQuery = searchQuery.concat(alternativeNames);
    searchQuery = searchQuery.concat(longNames);
    searchQuery = searchQuery.concat(proteins);

    searchQuery = searchQuery.map(x => x.toLowerCase());
    searchQuery = _.uniq(searchQuery);

    d.searchQuery = searchQuery;

    return d;
}

function getOptions() {
    const entries = Object.entries(GENE_SELECTOR_OPTIONS);

    const proteins = entries.filter(([key, value]) => value.type === 'p').map(formatOption);
    const complexes = entries.filter(([key, value]) => value.type === 'c').map(formatOption);

    const options = [
        {
            label: 'Protein complexes',
            options: complexes,
        },
        {
            label: 'Proteins',
            options: proteins,
        },
    ];

    return options;
}


function optionLabel(option) {
    const {
        long_names: longNames,
        names,
        label,
        type: optionType,
    } = option;

    let namesComponent = '';
    if (names.length > 1) {
        namesComponent = (
            <small className="text-muted">{ names.join('; ') }</small>
        );
    } else if (names.length === 1) {
        const name = names[0];
        if (name !== option.label) {
            namesComponent = (
                <small className="text-muted">{name}</small>
            );
        }
    }

    let longNamesComponent = longNames.join('; ');

    if (longNamesComponent.length === 0) {
        longNamesComponent = optionType === 'p' ? `Protein ${label}` : `${label} complex`;
    }

    longNamesComponent = (
        <small>{longNamesComponent}</small>
    );

    const badgeVariant = optionType === 'p' ? 'protein' : 'complex';

    // let badgeClass = optionType === 'p' ? styles['badge-protein'] : styles['badge-complex'];
    // let badgeClass = 'badge-primary';
    // badgeClass = `badge badge-pill ${badgeClass} mx-1`;


    return (
        <>
            <div>
                <Badge className="mx-1" variant={badgeVariant}>{label}</Badge>
                {namesComponent}
            </div>
            <div className="mx-1">
                {longNamesComponent}
            </div>
        </>
    );
}

function filterOption(option, rawInput) {
    const { searchQuery } = option.data;

    const input = rawInput.toLowerCase();

    return searchQuery.some(x => x.indexOf(input) > -1);
}

const options = getOptions();

class GeneSelect extends PureComponent {
    handleChange = (value) => {
        let validatedValue = value;

        if ((validatedValue === null) || (validatedValue === undefined)) {
            validatedValue = [];
        }

        const keys = _.uniq(validatedValue.map(x => x.key));

        const { dispatch, trackEvent } = this.props;

        const nSelected = keys.length;

        trackEvent({
            category: 'interaction-with-vis-control',
            action: 'change',
            name: 'GeneSelect',
            value: `n=${nSelected}`,
        });

        dispatch(changeSelection(keys));
    };

    toggleShowSimilar = () => {
        const { dispatch, showSimilar, trackEvent } = this.props;
        const newValue = !showSimilar;

        trackEvent({
            category: 'interaction-with-vis-control',
            action: 'toggle',
            name: 'GeneSelect.showSimilar',
            value: `${newValue}`,
        });

        dispatch(setShowSimilar(newValue));
    };

    render() {
        const { value, showSimilar } = this.props;

        return (
            <>
                <Form.Group id="gene-selector">
                    <Form.Label>Selected proteins:</Form.Label>
                    <WindowedSelect
                        options={options}
                        styles={customStyles}
                        value={value}
                        onChange={this.handleChange}
                        windowThreshold={5}
                        components={{ MultiValue: CustomMultiValue }}
                        filterOption={filterOption}
                        isMulti
                        name="gene-select"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Type protein or complex name"
                        getOptionLabel={optionLabel}
                    />
                    <Form.Text className="text-muted">For instance: ORC, TBRG1</Form.Text>
                </Form.Group>
                <Form.Group controlId="form-similarproteins-checkbox" id="similar-proteins-selector">
                    <Form.Check
                        type="checkbox"
                        checked={showSimilar}
                        label="Include similar proteins as well"
                        onChange={this.toggleShowSimilar}
                    />
                </Form.Group>
            </>
        );
    }
}

GeneSelect.propTypes = {
    dispatch: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.object),
    showSimilar: PropTypes.bool,
};

GeneSelect.defaultProps = {
    value: [],
    showSimilar: false,
};


const GeneSelectWithTracking = withMatomoTrackEvent(GeneSelect);
export default connect(mapStateToProps)(GeneSelectWithTracking);
