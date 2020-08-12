import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ProteinsTable from '../tables/ProteinsTable';

export default class ProteinList extends Component {

    componentDidMount() {
        document.title = 'List of Proteins — MARCS';
    }

    render() {
        return (
            <>
                <Jumbotron fluid>
                    <Container>
                        <h3>List of proteins in the database</h3>
                        <p>
                            This page lists the proteins available in the database.
                            Our internal identifier is listed in the first column,
                            while additional metadata are available in the remaining columns.
                            Complex memberships are listed in the last column.
                        </p>
                        <p>
                            <a className="btn btn-info" href="/api/proteins.csv" role="button">Download as CSV</a>
                        </p>
                    </Container>
                </Jumbotron>
                <Container className="pb-5">
                    <ProteinsTable />
                </Container>
            </>
        );
    }
}
