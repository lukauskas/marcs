import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import ComplexesTable from 'components/tables/ComplexesTable';
import Jumbotron from 'react-bootstrap/Jumbotron';
import MatomoPageView from "../matomo/MatomoPageView";
import LicensedLink from "components/controls/LicensedLink";

export default class ComplexList extends Component {

    componentDidMount() {
        document.title = 'List of Complexes — MARCS';
    }

    render() {
        return (
            <>
                <MatomoPageView/>
                <Jumbotron fluid>
                    <Container>
                        <h3>List of protein complexes in the database</h3>
                        <p>
                            This page lists the protein complexes available to search in this database.
                            Members of the complexes that are identified in our database are listed using our identifiers.
                            The members of complexes which could not be identified in our database are listed using the identifiers used by the source.
                            Sources are listed in the appropriate column.
                        </p>
                        <p>
                            <LicensedLink className="btn btn-info" href="/api/complexes.csv" role="button" text="Download as CSV" />
                        </p>
                    </Container>
                </Jumbotron>
                <Container className="pb-5">
                    <ComplexesTable />
                </Container>
            </>
        );
    }
}
