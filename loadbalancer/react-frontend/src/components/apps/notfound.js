import React, { PureComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import MatomoPageView from "../matomo/MatomoPageView";

export default class NotFound extends PureComponent {
    render() {
        return (
            <>
                <MatomoPageView />
                <Container className="my-5">
                    <Jumbotron>
                        <h1 className="display-4">
                        404
                        </h1>
                        <p className="lead">
                        The page you were looking for does not exist.
                        </p>
                        <hr className="my-4" />
                        <p>
                          Please use the navigation above to continue browsing,
                          or proceed to the <a href="/">Homepage</a>
                        </p>
                    </Jumbotron>
                </Container>
            </>
        );
    }
}
