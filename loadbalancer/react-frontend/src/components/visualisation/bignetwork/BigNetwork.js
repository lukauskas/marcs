import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';

import _ from 'lodash';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import BigNetworkVis from './BigNetworkVis';
import { ProteinBadge } from 'components/common/ProteinBadges';
import { redirectToHeatmap } from 'components/stores/actions/geneSelect';
import parseAxiosError from "../../helpers/parseAxiosError";
import ErrorToast from "../../error/ErrorToast";


class BigNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            edges: [],
            errorMessage: null,
            colourData: {},
            isLoadingEdges: false,
            isLoadingNodes: false,
            isLoadingColours: false,
        };
    }

    handleError = (error) => {
        const errorMessage = parseAxiosError(error);
        this.setState({
            errorMessage,
            isLoadingEdges: false,
            isLoadingNodes: false,
            isLoadingColours: false,
        });
    };

     clearError = () => {
        this.setState({
            errorMessage: null,
        });
    };


    updateNodes = (response) => {
        const { data } = response;

        const graphNodes = data.map((x) => {
            const node = Object.assign({ size: 5 }, x);
            // Flip coordinates so network is not upside-down.
            node.y *= -1;
            return node;
        });

        this.setState({
            nodes: graphNodes,
            isLoadingNodes: false,
        });
    };

    updateColours = (response, colourKey) => {
        const { data } = response;
        const { colourKey: thisColourKey } = this.props;

        const newColourData = data.reduce((o, item) => ({
            ...o,
            [item.protein]: item,
        }), {});

        newColourData.colourKey = colourKey;

        // Double check for race conditions
        if (colourKey === thisColourKey) {
            this.setState({
                colourData: newColourData,
                isLoadingColours: false,
            });
        }
    };

    updateEdges = (response) => {
        const { data } = response;

        const graphEdges = data.map(x => ({
            source: x.protein_a,
            target: x.protein_b,
            id: `${x.protein_a}-${x.protein_b}`,
        }));

        this.setState({
            edges: graphEdges,
            isLoadingEdges: false,
        });
    };


    fetchData = () => {
        const uriNodes = '/api/network/full/nodes';
        const uriEdges = '/api/network/full/edges';

        this.setState({ isLoadingNodes: true, isLoadingEdges: true });

        rateLimitedAxios.get(uriNodes).then(
            this.updateNodes,
        ).catch(
            (error) => {
                this.handleError(error);
            },
        );

        rateLimitedAxios.get(uriEdges).then(
            this.updateEdges,
        ).catch(
            (error) => {
                this.handleError(error);
            },
        );
    };

    fetchColours = () => {
        const { colourKey } = this.props;
        if (colourKey === 'communities') return;

        const uri = `/api/network/ptms/${colourKey}`;
        this.setState({ isLoadingColours: true, colourData: {} });

        rateLimitedAxios.get(uri).then(
            response => this.updateColours(response, colourKey),
        ).catch(
            (error) => {
                this.handleError(error);
            },
        );
    };

    componentDidMount = () => {
        this.fetchData();
        this.fetchColours();
    };



    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { colourKey: prevColourKey } = prevProps;
        this.fetchColoursIfNewOnesNeeded(prevColourKey);
    }

    fetchColoursIfNewOnesNeeded(prevColourKey) {
        const {colourKey} = this.props;

        if (colourKey !== prevColourKey) {
            // Colour key changed
            this.fetchColours();
        }
    }

    sortedProteins = () => {
        const { selectedProteins } = this.props;
        const { nodes } = this.state;
        const nodeSet = new Set(nodes.map(x => x.id));

        const inNetwork = selectedProteins.filter(x => nodeSet.has(x));
        const outOfNetwork = selectedProteins.filter(x => !inNetwork.includes(x));

        return { inNetwork, outOfNetwork };
    };

    goToHeatmap = () => {
        const { selectedKeys, showSimilar, dispatch } = this.props;
        dispatch(redirectToHeatmap(selectedKeys, showSimilar));
    };

    isLoading = () => {
        const { isLoadingNodes, isLoadingEdges, isLoadingColours } = this.state;

        return isLoadingNodes || isLoadingEdges || isLoadingColours;
    };

    render() {
        const {
            errorMessage,
            nodes,
            edges,
            colourData,
        } = this.state;

        const { colourKey } = this.props;


        if (errorMessage !== null) {
            return (
                <div className="embed-responsive embed-responsive-1by1 border border-dark p-0" id="bignetwork-vis">
                    <ErrorToast
                        title="Visualisation failed"
                        errorMessage={errorMessage}
                        onClose={this.clearError}
                    />
                </div>
            );
        }

        const isLoading = this.isLoading();
        const spinner = isLoading ? (<Spinner animation="grow" role="status" size="sm" />) : null;


        let selectedProteinsArea = null;
        const { inNetwork, outOfNetwork } = this.sortedProteins();

        if ((inNetwork.length > 0) || (outOfNetwork.length > 0)) {
            let inNetworkCol = null;
            let outOfNetworkCol = null;

            if (inNetwork.length > 0) {
                const inNetworkList = inNetwork.map((x) => {
                    const link = `/proteins?k=p:${x}`;
                    return (
                        <li className="list-inline-item" key={x}>
                            <a href={link} rel="noopener noreferrer" target="_blank">

                                <ProteinBadge>{x}</ProteinBadge>
                            </a>
                        </li>
                    );
                });
                inNetworkCol = (
                    <Col md="4">
                        We have highlighted the following proteins from your selection in the network:
                        <ul className="list-inline">
                            {inNetworkList}
                        </ul>
                    </Col>
                );
            }

            if (outOfNetwork.length > 0) {
                const outOfNetworkList = outOfNetwork.map((x) => {
                    const link = `/proteins?k=p:${x}`;
                    return (
                        <li className="list-inline-item" key={x}>
                            <a href={link} rel="noopener noreferrer" target="_blank">
                                <ProteinBadge>{x}</ProteinBadge>
                            </a>
                        </li>
                    );
                });
                outOfNetworkCol = (
                    <Col md="4">
                        The following proteins from your selection were not shown in the network:
                        <ul className="list-inline">
                            {outOfNetworkList}
                        </ul>
                    </Col>
                );
            }

            selectedProteinsArea = (
                <Row className="mb-3">
                    {inNetworkCol}
                    {outOfNetworkCol}
                    <Col md="4">
                        <Button variant="secondary" onClick={this.goToHeatmap}>View these proteins in heatmap</Button>
                    </Col>
                </Row>
            );
        }

        return (
            <>
                {selectedProteinsArea}
                {spinner}
                <div className="embed-responsive embed-responsive-1by1 border border-dark" id="bignetwork-vis">
                    <BigNetworkVis
                        className="embed-responsive-item"
                        nodes={nodes}
                        edges={edges}
                        colourKey={colourKey}
                        colourData={colourData}
                        highlightedNodes={inNetwork}
                    />
                </div>
            </>
        );
    }
}

BigNetwork.propTypes = {
    colourKey: PropTypes.string,
    selectedProteins: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    showSimilar: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
};

BigNetwork.defaultProps = {
    colourKey: 'communities',
    selectedProteins: [],
    selectedKeys: [],
    showSimilar: [],
};

function mapStateToProps(state) {
    const props = {};

    const { network, geneSelect } = state;

    if (network.networkColor !== undefined) {
        props.colourKey = network.networkColor;
    } else {
        props.colourKey = 'communities';
    }

    let selectedList = geneSelect.selected_proteins;

    if (geneSelect.show_similar) {
        selectedList = _.uniq([...selectedList, ...geneSelect.similar_proteins]);
    }
    props.selectedProteins = [...selectedList].sort();

    props.selectedKeys = geneSelect.selected_gene_keys;
    props.showSimilar = geneSelect.show_similar;

    return props;
}

export default connect(mapStateToProps)(BigNetwork);
