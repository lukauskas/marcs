import React, { useEffect } from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const _MatomoProteinSearchTracker = ({
    selectedGeneKeys,
    selectedList,
    selectedSimilar,
    showSimilar,
}) => {

    const { trackSiteSearch } = useMatomo();

    const query = selectedGeneKeys.join(' ');
    const nResults = selectedList.length + selectedSimilar.length;

    const searchType = (showSimilar === true) ? "proteins-incl-similar" : "proteins-excl-similar";

    useEffect(() => {
        if (query) {
            trackSiteSearch({
                keyword: query,
                category: searchType,
                count: nResults,
            });
        }
    }, [selectedGeneKeys, showSimilar]);

    return (<div id="matomo-searchtrack" />);
};

function mapStateToProps(state) {
    const props = {};
    props.selectedGeneKeys = state.geneSelect.selected_gene_keys;
    props.selectedList = state.geneSelect.selected_proteins;
    props.selectedSimilar = state.geneSelect.similar_proteins;
    props.showSimilar = state.geneSelect.show_similar;

    return props;
}

export default connect(mapStateToProps)(_MatomoProteinSearchTracker);
