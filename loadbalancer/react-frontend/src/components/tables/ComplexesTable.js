import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';
import Spinner from 'react-bootstrap/Spinner';
import { ComplexBadge, ProteinBadge } from '../common/ProteinBadges';
import Alert from "react-bootstrap/Alert";
import {
    listFormatter,
    multiProteinFormatter,
    singleComplexFormatter,
    sourcesFormatter
} from "./formatters";

// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const columns = [{
    dataField: 'complex',
    text: 'Complex',
    formatter: singleComplexFormatter,
}, {
    dataField: 'proteins',
    text: 'Members in dataset',
    formatter: multiProteinFormatter,
}, {
    dataField: 'missing_members',
    text: 'Members missing',
    formatter: listFormatter,
}, {
    dataField: 'source',
    text: 'Source',
    formatter: sourcesFormatter,
},
];

export default class ComplexesTable extends Component {
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
        const URI = '/api/complexes';

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
            <BootstrapTable bootstrap4={true} data={data} columns={columns} keyField="complex" />
        );
    }
}
