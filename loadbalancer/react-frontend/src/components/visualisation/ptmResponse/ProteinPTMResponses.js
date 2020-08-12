import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';
import { encode as encodeQuery } from 'querystring';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ProteinPTMResponsesVis from './ProteinPTMResponsesVis';
import HelpQuestionMark from 'components/common/HelpQuestionMark';
import parseAxiosError from 'components/helpers/parseAxiosError';
import ErrorToast from 'components/error/ErrorToast';

class ProteinPTMResponses extends Component {
    // Initialisation
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        data: [],
        errorMessage: '',
        fetchingList: new Set(),
    });


    // Lifecycle methods
    componentDidMount() {
        const totalSelected = this.totalSelected();
        const mountedWithProteins = totalSelected.size > 0;

        // Sometimes this happens
        if (mountedWithProteins) {
            this.fetchDataFor([...totalSelected]);
        }
    }

    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps, prevState, snapshot) {
        const totalSelected = this.totalSelected();
        const prevTotalSelected = this.totalSelected(prevProps);
        const proteinSelectChanged = !_.isEqual(prevTotalSelected, totalSelected);

        const {
            fetchingList,
        } = this.state;

        if (proteinSelectChanged) {
            const arraySelectedList = [...totalSelected];
            const toAdd = arraySelectedList.filter(x => (!fetchingList.has(x))
          && (!prevTotalSelected.has(x)));

            const toRemove = [...prevTotalSelected].filter(x => !totalSelected.has(x));

            if (toAdd.length > 0) this.fetchDataFor(toAdd);
            if (toRemove.length > 0) this.removeData(toRemove);
        }
    }

    isLoading = (state = null) => {
        let validatedState = state;
        if (validatedState === null) validatedState = this.state;
        return validatedState.fetchingList.size > 0;
    };

     totalSelected = (props = null) => {
         let validatedProps = props;
         if (validatedProps === null) validatedProps = this.props;

         if (validatedProps.showSimilarProteins) {
             return new Set([...validatedProps.selectedList, ...validatedProps.selectedSimilar]);
         }
         return new Set([...validatedProps.selectedList]);
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
            console.error('Response status is not 200? not updating factor score vis.');
            this.setState({
                errorMessage: 'Data update triggered by non 200 response.',
            });
        }

        const responseData = response.data;
        const totalSelected = this.totalSelected();

        const { data } = this.state;
        const seenKeys = new Set(data.map(x => x.protein));

        const newData = responseData.filter(
            x => totalSelected.has(x.protein) && !seenKeys.has(x),
        ).map((x) => {
            // Filter scores here
            const ans = Object.assign({}, x);
            return ans;
        });

        this.setState({
            data: newData.concat(data),
        });
    };

    removeData = (keys) => {
        const {
            data,
        } = this.state;

        const keySet = new Set(keys);
        const newData = data.filter(x => !keySet.has(x.protein));

        this.setState({
            data: newData,
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
        const URI = `/api/ptms/subset?${queryString}`;

        rateLimitedAxios.get(URI).then(
            this.mergeData,
        ).catch(
            this.handleError,
        ).finally(
            () => this.removeFromFetchingList(keys),
        );
    };

    render() {
        const { errorMessage, data } = this.state;

        let loading = null;
        if (this.isLoading()) {
            loading = <Spinner animation="grow" role="status" size="sm" />;
        }

        let error = null;
        if (errorMessage) {
            error = (
                <ErrorToast
                    title="Visualisation failed"
                    errorMessage={error}
                    onClose={this.clearError}
                />
            );
        }

        return (
            <Card style={{ minWidth: 400 }}>
                <Card.Header>
                    {loading}
                    {' '}
                    Chromatin feature effect estimates
                    <HelpQuestionMark>
                        <p>
                            Brief summary of protein binding response to the modified nucleosomes.
                            The values displayed here correspond to chromatin feature effect estimates
                            which have been estimated by repeatedly measuring the change in the
                            log&#8322; H/L ratio between nucleosomes that differ by the
                            specified nucleosome (e.g. difference between H3K4me3+H3K9acK14ac vs H3K9acK14ac).
                        </p>
                        <p>
                            Note that unlike in the print figures, the box plots only summarise
                            the mean estimates of the selected proteins as we cannot empirically sample
                            the variance in the browser on-the-fly.
                            While the box plots provide sufficient approximation for the general trend,
                            beware of the variability of some of the individual estimates.
                            The 95% confidence intervals for each of such estimates are therefore
                            provided when a point is hovered with the cursor.
                        </p>
                        <p>
                            In cases where we could not estimate value due to lack of reliable data,
                            the point for a given protein will be missing.
                        </p>
                    </HelpQuestionMark>
                </Card.Header>
                <Card.Body className="p-0">
                    {error}
                    <div className="p-1" style={{ height: 300 }}>
                        <ProteinPTMResponsesVis data={data} />
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

ProteinPTMResponses.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    selectedList: PropTypes.arrayOf(PropTypes.string).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    selectedSimilar: PropTypes.arrayOf(PropTypes.string).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    showSimilarProteins: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
    const props = {};
    props.selectedList = state.geneSelect.selected_proteins;
    props.selectedSimilar = state.geneSelect.similar_proteins;
    props.showSimilarProteins = state.geneSelect.show_similar;

    return props;
}

export default connect(mapStateToProps)(ProteinPTMResponses);
