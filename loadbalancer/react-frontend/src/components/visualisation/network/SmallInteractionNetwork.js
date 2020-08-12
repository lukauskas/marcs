import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { encode as encodeQuery } from 'querystring';

import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';

import HelpQuestionMark from 'components/common/HelpQuestionMark';
import parseAxiosError from 'components/helpers/parseAxiosError';
import ErrorToast from 'components/error/ErrorToast';
import SmallInteractionNetworkVis from './SmallInteractionNetworkVis';

class SmallInteractionNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            error: null,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { selectedProteins } = this.props;
        const { selectedProteins: prevSelectedProteins } = prevProps;

        if (!_.isEqual(selectedProteins, prevSelectedProteins)) {
            this.fetchData();
        }
    }

    mergeData = (response) => {
        if (response.status !== 200) {
            // eslint-disable-next-line no-console
            console.error('Response status is not 200?');
            this.setState({
                isLoading: false,
                error: 'Data update triggered by non 200 response.',
            });
            return;
        }
        const { data } = response;
        this.setState({
            isLoading: false,
            data,
        });
    };

    fetchData = () => {
        const { selectedProteins } = this.props;

        if (selectedProteins.length === 0) {
            this.setState({
                isLoading: false,
                data: [],
            });
            return;
        }
        const queryString = encodeQuery({ protein_ids: [...selectedProteins].sort() });

        const URI = `/api/network/subset/edges?${queryString}`;

        rateLimitedAxios.get(URI).then(
            this.mergeData,
        ).catch(
            this.handleError,
        );

        this.setState({
            isLoading: true,
        });
    };

    // Handlers
    clearError = () => {
        this.setState({
            error: null,
        });
    };

    handleError = (error) => {
        const errorMessage = parseAxiosError(error);
        this.setState({
            error: errorMessage,
            isLoading: false,
        });
    };

    render() {
        const { selectedProteins } = this.props;

        const { isLoading, error, data } = this.state;

        let body = null;
        if (isLoading) {
            body = (
                <>
                    <Spinner animation="grow" role="status" size="sm" className="mr-3" />
                    Loading...
                </>
            );
        } else if (error !== null) {
            body = (
                <ErrorToast
                    title="Visualisation failed"
                    errorMessage={error}
                    onClose={this.clearError}
                />
            );
        } else {
            body = (
                <div className="w-100 h-100 p-3">
                    <SmallInteractionNetworkVis
                        nodes={selectedProteins}
                        edges={data}
                    />
                </div>
            );
        }
        return (
            <Card className="h-100">
                <Card.Header>
                    Neighbourhood
                    <HelpQuestionMark>
                        <p>
                            Predicted protein interactions based on the similarities in response
                            to the modified nucleosomes.
                        </p>
                        <p>
                            Blue lines indicate predicted interactions that have also been
                            reported in BioGRID database.
                            Red lines indicate other predicted interactions.
                        </p>
                    </HelpQuestionMark>
                </Card.Header>
                <Card.Body className="h-100 p-0" style={{minHeight: 300}}>
                    { body }
                </Card.Body>
            </Card>
        );
    }
}

SmallInteractionNetwork.propTypes = {
    selectedProteins: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function mapStateToProps(state) {
    const { geneSelect } = state;
    const props = {};

    let selectedList = geneSelect.selected_proteins;

    if (geneSelect.show_similar) {
        selectedList = _.uniq([...selectedList, ...geneSelect.similar_proteins]);
    }
    props.selectedProteins = [...selectedList].sort();

    return props;
}

export default connect(mapStateToProps)(SmallInteractionNetwork);
