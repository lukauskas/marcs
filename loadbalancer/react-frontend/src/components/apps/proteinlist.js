import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ProteinsTable from '../tables/ProteinsTable';
import MatomoPageView from '../matomo/MatomoPageView';
import LicensedLink from "components/controls/LicensedLink";

export default class ProteinList extends Component {
    componentDidMount() {
        document.title = 'List of Proteins — MARCS';
    }

    render() {
        return (
            <>
                <MatomoPageView />
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
                            <LicensedLink className="btn btn-info" href="/api/proteins.csv" role="button" text="Download as CSV" />
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
