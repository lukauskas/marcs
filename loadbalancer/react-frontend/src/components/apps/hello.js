import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Joyride from 'react-joyride';

import Citation from 'components/info/Citation';
import networkImg from './images/network.png';
import heatmapImg from './images/heatmap.png';
import pdsImg from './images/pds.png';
import dataImg from './images/complexlist.png';
import readersImg from './images/readers.png';

import './styles/hello.css';

const START_TOUR_AFTER = 10000; // Milliseconds

export default class Hello extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tourState: 'waiting',
        };
    }

    componentDidMount() {
        this.timer = setTimeout(
            () => {
                console.log('Starting tour');
                this.startTour();
            },
            START_TOUR_AFTER,
        );
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    startTour = () => {
        this.setState({
            tourState: 'active',
        });
    };

    disableTour = () => {
        this.setState({
            tourState: 'finished',
        });
    };

    render() {

        const { tourState } = this.state;

        const runTour = tourState === 'active';

        const tourSteps = [
            {
                target: '#marcs-protein-pages',
                content: 'Head to the protein pages to get a tour of MARCS features.',
                placementBeacon: 'top',
                disableBeacon: false,
            },
        ];

        return (
            <>
                <Joyride
                    steps={tourSteps}
                    run={runTour}
                    // continuous
                    hideBackButton
                    // showProgress
                    // showSkipButton
                    locale={{
                        skip: 'Skip tour',
                        next: 'Continue tour',
                        last: 'Finish tour',
                        open: 'Need some help?',
                    }}
                    floaterProps={{
                        disableAnimation: false,
                        wrapperOptions: {
                            offset: 10,
                        },
                    }}
                    callback={(data) => {
                        if (data.action === 'close') {
                            this.disableTour();
                        }
                    }}
                    styles={{
                        options: {
                            primaryColor: '#4BA0B5',
                        },
                    }}
                />

                <Container className="my-5">
                    <Jumbotron id="marcs-jumbotron" className="mb-5">
                        <h1 id="marcs-header">MARCS</h1>
                        <h2 id="marcs-subheader">Modification Atlas of Regulation by Chromatin States</h2>
                        <Citation />
                    </Jumbotron>
                    <CardDeck id="landing-page-card-deck">
                        <Card id="marcs-protein-pages">
                            <div className="embed-responsive embed-responsive-16by9 border-bottom">
                                <Card.Img variant="top" src={heatmapImg} className="embed-responsive-item" />
                            </div>
                            <Card.Body className="d-flex flex-column text-center">
                                <Card.Title>
                                    Protein pages
                                </Card.Title>
                                <Card.Text>
                                    Determine the chromatin states bound by protein or protein complex.
                                </Card.Text>
                                <Button variant="link" className="stretched-link card-link mt-auto" href="/proteins">Explore</Button>
                            </Card.Body>
                        </Card>
                        <Card>
                            <div className="embed-responsive embed-responsive-16by9 border-bottom">
                                <Card.Img variant="top" src={networkImg} className="embed-responsive-item" />
                            </div>
                            <Card.Body className="d-flex flex-column text-center">
                                <Card.Title>
                                    Regulatory network
                                </Card.Title>
                                <Card.Text>
                                    Browse interactions between epigenetic proteins.
                                </Card.Text>
                                <Button variant="link" className="stretched-link card-link mt-auto" href="/network">Explore</Button>
                            </Card.Body>
                        </Card>
                        {/* Spacer for responsive view */}
                        <div className="w-100 d-none d-lg-none d-md-block d-sm-block mb-4" />
                        <Card>
                            <div className="embed-responsive embed-responsive-16by9 border-bottom">
                                <Card.Img variant="top" src={readersImg} className="embed-responsive-item" />
                            </div>
                            <Card.Body className="d-flex flex-column text-center">
                                <Card.Title>
                                    Chromatin feature effects
                                </Card.Title>
                                <Card.Text>
                                    Browse predicted effects and readers of chromatin modifications.
                                </Card.Text>
                                <Button variant="link" className="stretched-link card-link mt-auto" href="/readers">Browse</Button>
                            </Card.Body>
                        </Card>
                        <Card>
                            <div className="embed-responsive embed-responsive-16by9 border-bottom">
                                <Card.Img variant="top" src={pdsImg} className="embed-responsive-item" />
                            </div>
                            <Card.Body className="d-flex flex-column text-center">
                                <Card.Title>
                                    Pull-Downs
                                </Card.Title>
                                <Card.Text>
                                    Investigate individual SILAC experiments.
                                </Card.Text>
                                <Button variant="link" className="stretched-link card-link mt-auto" href="/pds">Explore</Button>
                            </Card.Body>
                        </Card>
                        <Card>
                            <div className="embed-responsive embed-responsive-16by9 border-bottom">
                                <Card.Img variant="top" src={dataImg} className="embed-responsive-item" />
                            </div>
                            <Card.Body className="d-flex flex-column text-center">
                                <Card.Title>
                                    Resources
                                </Card.Title>
                                <Card.Text>
                                    Browse and download supporting datasets.
                                </Card.Text>
                                <Button variant="link" className="stretched-link card-link mt-auto" href="/data">Browse</Button>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Container>
                </>
        );
    }
}
