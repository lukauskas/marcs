import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';
import _ from 'lodash';
import { encode as encodeQuery } from 'querystring';
import HeatmapVis from 'components/visualisation/heatmap/HeatmapVis';
import { agnes } from 'ml-hclust';
import PropTypes from 'prop-types';
import parseAxiosError from 'components/helpers/parseAxiosError';

class HeatmapComponent extends Component {
    static totalSelected(props) {
        if (props.showSimilarProteins) {
            return new Set([...props.selectedList, ...props.selectedSimilar]);
        }
        return new Set([...props.selectedList]);
    }

    // Initialisation
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    // Note that this function is agnostic at props, this is expected
    // We will be triggering state update in componentDidMount instead
    getInitialState = () => ({
            fetchingList: new Set(),
            data: [],
            dataComplexes: [],
            dataDomains: [],
            proteinOrder: [],
            complexOrder: [],
            domainOrder: [],
            errorMessage: '',
            needsReclustering: 'no',
            pdOrder: [],
    });

    // Lifecycle
    componentDidMount() {

        const prevTotalSelected = new Set([]);
        const prevSelectedPullDowns = new Set([]);
        // TODO: This should not be hardcoded here
        // It should use a variable with the default setting
        // This might cause problems if defaults change somewhere upstream;
        const prevUseDefaultPdOrder = true;
        const prevAnnotationType = 'complex';

        // This is needed for cases when we mount with protein/pd selection
        this.updateStateBasedOnNewSelection(
            prevTotalSelected,
            prevSelectedPullDowns,
            prevUseDefaultPdOrder,
            prevAnnotationType,
        );

    }


    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps, prevState, snapshot) {

        const prevTotalSelected = HeatmapComponent.totalSelected(prevProps);
        const {
            selectedPullDowns: prevSelectedPullDowns,
            useDefaultPdOrder: prevUseDefaultPdOrder,
            annotationType: prevAnnotationType,
        } = prevProps;

        const stateUpdated = this.updateStateBasedOnNewSelection(
            prevTotalSelected,
            prevSelectedPullDowns,
            prevUseDefaultPdOrder,
            prevAnnotationType,
        );

        if (!stateUpdated) this.tryReclusterIfNeeded();
    }

    tryReclusterIfNeeded() {
        const {
            useDefaultPdOrder,
            clusterProteins,
            annotationType,
        } = this.props;

        const {
            needsReclustering,
        } = this.state;

        // If we are waiting for recluster, and we're not currently loading new data
        if ((needsReclustering !== 'no') && (!this.isLoading(this.state))) {

            const newState = {
                needsReclustering: 'no',
            };

            if (['all', 'row'].includes(needsReclustering)) {
                // Recluster rows
                let newProteinOrder;
                if (!clusterProteins) {
                    console.info('Protein clustering is off');
                    newProteinOrder = Array.from(HeatmapComponent.totalSelected(this.props)).sort().reverse();
                } else {
                    newProteinOrder = this.clusterData('row');
                }

                if (newProteinOrder !== null) {
                    newState.proteinOrder = newProteinOrder;
                }
            }

            if ((!useDefaultPdOrder) && ['all', 'col'].includes(needsReclustering)) {
                // Recluster cols
                const newPdOrder = this.clusterData('col');
                if (newPdOrder !== null) {
                    newState.pdOrder = newPdOrder;
                }
            }

            if (['all', 'annotation'].includes(needsReclustering)) {
                if (annotationType === 'domain') {
                    const newDomainOrder = this.clusterAnnotData('domain');
                    if (newDomainOrder !== null) {
                        newState.domainOrder = newDomainOrder;
                    }
                } else {
                    const newComplexOrder = this.clusterAnnotData('complex');
                    if (newComplexOrder !== null) {
                        newState.complexOrder = newComplexOrder;
                    }
                }
            }

            this.setState(newState);
            return true;
        }

        return false;

    }

    updateStateBasedOnNewSelection(
        prevTotalSelected,
        prevSelectedPullDowns,
        prevUseDefaultPdOrder,
        prevAnnotationType,
    ) {

        const totalSelected = HeatmapComponent.totalSelected(this.props);
        const {
            selectedPullDowns,
            useDefaultPdOrder,
            annotationType
        } = this.props;

        const proteinSelectChanged = !_.isEqual(prevTotalSelected, totalSelected);
        const pdSelectChanged = !_.isEqual(selectedPullDowns, prevSelectedPullDowns);
        const useDefaultOrderChanged = prevUseDefaultPdOrder !== useDefaultPdOrder;
        const annotationTypeChanged = prevAnnotationType !== annotationType;

        if (!proteinSelectChanged && !pdSelectChanged && !useDefaultOrderChanged && !annotationTypeChanged) return false;

        const {
            fetchingList,
            proteinOrder,
            pdOrder,
        } = this.state;

        const selectionUpdateState = {};

        if (proteinSelectChanged) {
            const arraySelectedList = [...totalSelected];
            const toAdd = arraySelectedList.filter(x => (!fetchingList.has(x))
                && (!prevTotalSelected.has(x)));

            const toRemove = [...prevTotalSelected].filter(x => !totalSelected.has(x));

            if (toAdd.length > 0) this.fetchDataFor(toAdd);
            if (toRemove.length > 0) this.removeData(toRemove);

            const newProteinOrder = [...proteinOrder.filter(x => !toRemove.includes(x)),
                ...toAdd];

            selectionUpdateState.proteinOrder = newProteinOrder;
            selectionUpdateState.needsReclustering = 'all';
        }

        if (pdSelectChanged || useDefaultOrderChanged) {
            const { defaultPdOrder } = this.props;
            const setSelectedPulldowns = new Set(selectedPullDowns);

            let newPdOrder = null;

            if (useDefaultPdOrder) {
                selectionUpdateState.pdOrder = defaultPdOrder.filter(x => setSelectedPulldowns.has(x));
                if (pdSelectChanged) selectionUpdateState.needsReclustering = 'all';

            } else {

                if (pdSelectChanged) {
                        const toAddPd = selectedPullDowns
                        .filter(x => !prevSelectedPullDowns.includes(x));
                    const toRemovePd = [...prevSelectedPullDowns]
                        .filter(x => !setSelectedPulldowns.has(x));

                    newPdOrder = [
                        ...pdOrder.filter(x => !toRemovePd.includes(x)),
                        ...toAddPd,
                    ];
                    selectionUpdateState.pdOrder = newPdOrder;
                    selectionUpdateState.needsReclustering = 'all';
                } else {
                    selectionUpdateState.needsReclustering = 'col';
                }
            }
        }

        if (annotationTypeChanged) {
            if (selectionUpdateState.needsReclustering === undefined) {
                selectionUpdateState.needsReclustering = 'annotation';
            } else {
                selectionUpdateState.needsReclustering = 'all';
            }
        }

        this.setState(selectionUpdateState);
        return true;
    }

    isLoading = (state = null) => {
        let validatedState = state;
        if (validatedState === null) validatedState = this.state;
        return validatedState.fetchingList.size > 0;
    };

    // Handlers
    clearError = () => {
        this.setState({
            errorMessage: '',
        });
    };

    mergeData = (response) => {
        if (response.status !== 200) {
            // eslint-disable-next-line no-console
            console.error('Response status is not 200? not updating heatmap.');
            this.setState({
                errorMessage: 'Data update triggered non 200 response.',
            });
            return;
        }
        const responseData = response.data;

        const { heatmap, complexes, domains } = responseData;

        const totalSelected = HeatmapComponent.totalSelected(this.props);

        const {
            data,
            dataComplexes,
            dataDomains,
            complexOrder,
            domainOrder,
        } = this.state;

        const seenKeys = new Set(data.map(x => x.protein));

        const newDataHeatmap = heatmap.filter(
            x => totalSelected.has(x.protein) && !seenKeys.has(x),
        );
        let newDataComplexes = complexes.filter(
            x => totalSelected.has(x.protein) && !seenKeys.has(x),
        );
        let newDataDomains = domains.filter(
            x => totalSelected.has(x.protein) && !seenKeys.has(x),
        );

        newDataComplexes = newDataComplexes.concat(dataComplexes);
        newDataDomains = newDataDomains.concat(dataDomains);

        const uniqComplexes = _.uniq(newDataComplexes.map(x => x.complex)).sort();
        const uniqDomains = _.uniq(newDataDomains.map(x => x.desc)).sort();

        const seenComplexes = new Set(complexOrder);
        const seenDomains = new Set(domainOrder);

        const newComplexOrder = complexOrder.concat(
            uniqComplexes.filter(x => !seenComplexes.has(x)),
        );
        const newDomainOrder = domainOrder.concat(
            uniqDomains.filter(x => !seenDomains.has(x)),
        );

        this.setState({
            data: newDataHeatmap.concat(data),
            dataComplexes: newDataComplexes,
            dataDomains: newDataDomains,
            complexOrder: newComplexOrder,
            domainOrder: newDomainOrder,
        });
    };

    removeData = (keys) => {
        const {
            data,
            dataComplexes,
            dataDomains,
            complexOrder,
            domainOrder,
        } = this.state;

        const keySet = new Set(keys);

        const newDataHeatmap = data.filter(x => !keySet.has(x.protein));
        const newDataComplexes = dataComplexes.filter(x => !keySet.has(x.protein));
        const newDataDomains = dataDomains.filter(x => !keySet.has(x.protein));

        const complexSet = new Set(newDataComplexes.map(x => x.complex));
        const domainSet = new Set(newDataDomains.map(x => x.desc));

        this.setState({
            data: newDataHeatmap,
            dataComplexes: newDataComplexes,
            dataDomains: newDataDomains,
            complexOrder: complexOrder.filter(x => complexSet.has(x)),
            domainOrder: domainOrder.filter(x => domainSet.has(x)),
        });
    };

    removeFromFetchingList = (keys) => {
        const { fetchingList } = this.state;

        const newFetchingList = [...fetchingList].filter(x => !keys.includes(x));
        this.setState(
            {
                fetchingList: new Set(newFetchingList),
            },
        );
    };

    handleError = (error) => {
        const errorMessage = parseAxiosError(error);
        this.setState({
            errorMessage,
        });
    };

    fetchDataFor = (keys) => {
        const { fetchingList } = this.state;
        const newFetchingList = new Set([...fetchingList].concat(keys));

        this.setState({
            fetchingList: new Set(newFetchingList),
        });

        const queryString = encodeQuery({ protein_ids: keys });
        const URI = `/api/heatmap/data?${queryString}`;

        rateLimitedAxios.get(URI).then(
            this.mergeData,
        ).catch(
            this.handleError,
        ).finally(
            () => this.removeFromFetchingList(keys),
        );
    };


    clusterData = (axis = 'row') => {
        const { data: longData } = this.state;
        const { selectedPullDowns } = this.props;

        const rows = Array.from(HeatmapComponent.totalSelected(this.props)).sort();
        const columns = Array.from(selectedPullDowns).sort();

        const nRows = rows.length;
        const nCols = columns.length;

        // Nothing to cluster
        if ((axis === 'row') && (nRows < 3)) return null;
        if ((axis === 'col') && (nCols < 3)) return null;

        // If we get there we can cluster

        const rowMap = {};
        for (let i = 0; i < nRows; i += 1) {
            rowMap[rows[i]] = i;
        }

        const colMap = {};
        for (let i = 0; i < nCols; i += 1) {
            colMap[columns[i]] = i;
        }

        // Create empty matrix
        const matrix = [];

        if (axis === 'row') {
            for (let i = 0; i < nRows; i += 1) {
                matrix[i] = new Array(nCols);
            }

            longData.forEach((d) => {
                const rowIndex = rowMap[d.protein];
                const colIndex = colMap[d.pd];

                if ((rowIndex === undefined) || (colIndex === undefined)) return;
                const mean = 0.5 * (d.ratio_forward + -d.ratio_reverse);

                matrix[rowIndex][colIndex] = mean;
            });
        } else {
            // axis = 'col'
            for (let i = 0; i < nCols; i += 1) {
                matrix[i] = new Array(nRows);
            }

            longData.forEach((d) => {
                const rowIndex = rowMap[d.protein];
                const colIndex = colMap[d.pd];

                if ((rowIndex === undefined) || (colIndex === undefined)) return;
                const mean = 0.5 * (d.ratio_forward + -d.ratio_reverse);

                matrix[colIndex][rowIndex] = mean;
            });
        }
        const clusters = agnes(matrix, {
            method: 'ward',
        });

        let newOrder;

        if (axis === 'row') {
            newOrder = clusters.indices().map(ix => rows[ix]);
        } else {
            newOrder = clusters.indices().map(ix => columns[ix]);
        }

        return newOrder;
    };

    clusterAnnotData = (annotType) => {
        const {
            dataDomains,
            domainOrder,
            dataComplexes,
            complexOrder,
        } = this.state;

        let longData = null;
        let selected = null;
        let yLabel = null;

        if (annotType === 'domain') {
            yLabel = 'desc';
            longData = dataDomains;
            selected = domainOrder;
        } else {
            yLabel = 'complex';
            longData = dataComplexes;
            selected = complexOrder;
        }

        const columns = Array.from(HeatmapComponent.totalSelected(this.props)).sort();
        const rows = selected.sort();

        const nRows = rows.length;
        const nCols = columns.length;

        // Nothing to cluster
        if (nRows < 3) return null;

        // If we get there we can cluster

        const rowMap = {};
        for (let i = 0; i < nRows; i += 1) {
            rowMap[rows[i]] = i;
        }

        const colMap = {};
        for (let i = 0; i < nCols; i += 1) {
            colMap[columns[i]] = i;
        }

        // Create empty matrix
        const matrix = [];

        for (let i = 0; i < nRows; i += 1) {
            matrix[i] = new Array(nCols).fill(0);
        }

        longData.forEach((d) => {
            const dyLabel = d[yLabel];

            const rowIndex = rowMap[dyLabel];
            const colIndex = colMap[d.protein];

            if (rowIndex === undefined) {
                console.log(`Skipping ${dyLabel} as it is no longer in row index`);
                return;
            }

            matrix[rowIndex][colIndex] = 1;
        });

        const clusters = agnes(matrix, {
            method: 'complete',
        });

        return clusters.indices().map(ix => rows[ix]);
    };


    dataToEchartsDatasetSource() {
        const { data } = this.state;
        return data;
    }

    annotationDataEcharts() {
        const {
            dataComplexes,
            dataDomains,
        } = this.state;

        const {
            annotationType,
        } = this.props;

        if (annotationType === 'domain') return dataDomains;
        return dataComplexes;
    }

    annotationOrder() {
        const {
            complexOrder,
            domainOrder,
        } = this.state;

        const {
            annotationType,
        } = this.props;

        if (annotationType === 'domain') return domainOrder;
        return complexOrder;
    }

    annotationXLabel() {
        const {
            annotationType,
        } = this.props;

        return (annotationType === 'domain') ? 'desc' : 'complex';
    }

    render() {
        const { proteinOrder, errorMessage, pdOrder } = this.state;
        return (
            <>
                <HeatmapVis
                    data={this.dataToEchartsDatasetSource()}
                    selectedProteins={proteinOrder}
                    showLoading={this.isLoading()}
                    errorMessage={errorMessage}
                    onErrorMessageClose={this.clearError}
                    dataAnnotation={this.annotationDataEcharts()}
                    annotationOrder={this.annotationOrder()}
                    annotationXLabel={this.annotationXLabel()}
                    selectedPullDowns={pdOrder}
                />
            </>
        );
    }
}

HeatmapComponent.propTypes = {
    selectedList: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedSimilar: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedPullDowns: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultPdOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    useDefaultPdOrder: PropTypes.bool.isRequired,
    showSimilarProteins: PropTypes.bool.isRequired,
    annotationType: PropTypes.string.isRequired,
    clusterProteins: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
    const props = {};
    props.selectedList = state.geneSelect.selected_proteins;
    props.selectedSimilar = state.geneSelect.similar_proteins;
    props.selectedPullDowns = state.pullDowns.selection;
    props.defaultPdOrder = state.pullDowns.order;
    props.useDefaultPdOrder = !state.heatmapControl.clusterPDs;
    props.showSimilarProteins = state.geneSelect.show_similar;
    props.annotationType = state.heatmapControl.annotationType;
    props.clusterProteins = state.heatmapControl.clusterProteins;

    return props;
}


export default connect(mapStateToProps)(HeatmapComponent);
