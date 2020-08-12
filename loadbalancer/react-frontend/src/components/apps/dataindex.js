import React, { PureComponent } from 'react';
import Container from 'react-bootstrap/Container';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import proteinImg from './images/proteinlist.png';
import complexImg from './images/complexlist.png';
import downloadsImg from './images/downloads.png';

export default class DataIndex extends PureComponent {
    componentDidMount() {
        document.title = 'Resources — MARCS';
    }

    render() {
        return (
            <Container className="my-5">
                <CardDeck>
                    <Card>
                        <div className="embed-responsive embed-responsive-16by9 border-bottom">
                            <Card.Img variant="top" src={proteinImg} className="embed-responsive-item" />
                        </div>
                        <Card.Body className="d-flex flex-column text-center">
                            <Card.Title>
                          List of proteins
                            </Card.Title>
                            <Card.Text>
                          List of proteins in the database.
                            </Card.Text>
                            <Button variant="link" className="stretched-link card-link mt-auto" href="/data/proteins">View</Button>
                        </Card.Body>
                    </Card>
                    <Card>
                        <div className="embed-responsive embed-responsive-16by9 border-bottom">
                            <Card.Img variant="top" src={complexImg} className="embed-responsive-item" />
                        </div>
                        <Card.Body className="d-flex flex-column text-center">
                            <Card.Title>
                          List of complexes
                            </Card.Title>
                            <Card.Text>
                         Protein complexes in the database and their members.
                            </Card.Text>
                            <Button variant="link" className="stretched-link card-link mt-auto" href="/data/complexes">View</Button>
                        </Card.Body>
                    </Card>
                    <Card>
                        <div className="embed-responsive embed-responsive-16by9 border-bottom">
                            <Card.Img variant="top" src={downloadsImg} className="embed-responsive-item" />
                        </div>
                        <Card.Body className="d-flex flex-column text-center">
                            <Card.Title>
                          Downloads
                            </Card.Title>
                            <Card.Text>
                          List of MARCS datasets available to download.
                            </Card.Text>
                            <Button variant="link" className="stretched-link card-link mt-auto" href="/downloads">View</Button>
                        </Card.Body>
                    </Card>
                </CardDeck>
            </Container>
        );
    }
}
