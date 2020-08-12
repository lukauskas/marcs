import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {listFormatter, multiComplexFormatter, singleProteinFormatter} from "./formatters";

const columns = [{
    dataField: 'index',
    text: 'Identifier',
    formatter: singleProteinFormatter,
    filter: textFilter(),
}, {
    dataField: 'gene_names',
    text: 'Gene names',
    formatter: listFormatter,
    filter: textFilter(),
}, {
    dataField: 'gene_names_alternative',
    text: 'Gene names (alternative)',
    formatter: listFormatter,
    filter: textFilter(),
}, {
    dataField: 'protein_names',
    text: 'Protein names',
    formatter: listFormatter,
    filter: textFilter(),
},
{
    dataField: 'majority_protein_ids',
    text: 'Majority Protein IDs',
    formatter: listFormatter,
    filter: textFilter(),
},
{
    dataField: 'protein_ids',
    text: 'Protein IDs',
    formatter: listFormatter,
    filter: textFilter(),
},
{
    dataField: 'complex_memberships',
    text: 'Member of',
    formatter: multiComplexFormatter,
    filter: textFilter(),
},
];

export default class ProteinsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: true,
            data: [],
        };
    }

     mergeData = (response) => {
         if (response.status !== 200) {
             const errorStatus = response.status;

             this.setState({
                 error: `Unexpected HTTP ${errorStatus}`,
                 loading: false,
             });
             return;
         }

         const responseData = response.data;

         this.setState({
             data: responseData,
             loading: false,
             error: null,
         });
     };

    fetchData = () => {
        const URI = '/api/proteins';

        rateLimitedAxios.get(URI).then(
            this.mergeData,
        ).catch(
            (error) => {
                this.setState({
                    loading: false,
                    error,
                });
            },
        );
    };

    componentDidMount = () => {
        this.fetchData();
    };

    render() {
        const { data, loading, error } = this.state;

        if (loading) {
            return (
                <div>
                    <Spinner animation="grow" role="status" size="sm" className="mr-3" />
                Loading...
                </div>
            );
        }
        if (error !== null) {
            return (
                <Alert variant="danger">
                    <p>
                        <strong>
                            An error has occurred:
                        </strong>
                    </p>
                    <p>
                        {error}
                    </p>
                    <p>
                        Try refreshing the page.
                    </p>
                </Alert>
            );
        }

        return (
            <BootstrapTable bootstrap4={true} data={data} columns={columns} keyField="index" filter={filterFactory()} pagination={ paginationFactory() }/>
        );
    }
}
