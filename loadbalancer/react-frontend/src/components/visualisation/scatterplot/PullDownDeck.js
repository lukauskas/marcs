import React, { Component } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import { connect } from 'react-redux';
import PullDownComponent from 'components/visualisation/scatterplot/scatterplot';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PropTypes from 'prop-types';

import * as echarts from 'echarts/core';

import _ from 'lodash';

// eslint-disable-next-line import/no-unresolved
import Card from 'react-bootstrap/Card';
import ProteinColorSelector from 'components/controls/ProteinColorSelector';
import palette from 'google-palette';
import Alert from 'react-bootstrap/Alert';

function mapStateToProps(state) {
    const props = {};

    const { selected_proteins, similar_proteins, show_similar } = state.geneSelect;
    const { showImputed } = state.scatterplotControl;

    let selected = [...selected_proteins];

    if (show_similar) {
        selected = selected.concat(similar_proteins);
    }

    props.selectedProteins = selected.sort();
    props.selectedPullDowns = state.pullDowns.selection;
    props.showImputed = showImputed;
    return props;
}

const CHART_GROUP = 'scatterplots';
// 65 Colours should be enough (they will start repeating afterwards)
const COLOR_PALETTE = palette(['mpn65'], 65);

class PullDownDeck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: {},
            absMaxes: {},
        };
    }

    componentDidMount() {

        // Connect echarts first
        echarts.connect(CHART_GROUP);

        // Now check if we need to update state
        const { selectedProteins, selectedPullDowns } = this.props;

        const stateUpdate = {}

        // If mounted with proteins already, assign their colour
        if (selectedProteins.length > 0) {
            console.log("Mounted with proteins, assigning colours");
            stateUpdate.colors = this.assignColours(selectedProteins, [])
        }

        if (selectedPullDowns.length > 0) {
            console.log("Mounted with PDs, assigning maxes");
            const newAbsMaxes = this.updateAbsMaxes(selectedPullDowns, []);
            if (newAbsMaxes !== null) {
                stateUpdate.absMaxes = newAbsMaxes;
            }
        }
        
        // Update state if needed
        if (Object.keys(stateUpdate).length > 0) this.setState(stateUpdate);
        
    }

    assignColours(selectedProteins, prevSelectedProteins) {
        const addition = selectedProteins.filter(x => !prevSelectedProteins.includes(x));
        const deletion = prevSelectedProteins.filter(x => !selectedProteins.includes(x));


        const { colors } = this.state;
        const newColors = {};

        Object.keys(colors).filter(x => !deletion.includes(x)).forEach((x) => {
            newColors[x] = colors[x];
        });

        let colorPalette = COLOR_PALETTE;
        let newColorIndex;

        if (selectedProteins.length < COLOR_PALETTE.length) {
            // If we have selected fewer proteins than we have colours, filter out the colours that we already using
            const usedColors = new Set(Object.values(colors).map(x => x.slice(1)))
            colorPalette = colorPalette.filter(x => !usedColors.has(x))
            // Take first colour
            newColorIndex = 0;
        } else {
            // If we have more proteins than we have colours
            // just keep cycling through the colours
            newColorIndex = prevSelectedProteins.length - deletion.length;
        }
        
        // Assign colors 
        for (let i = 0; i < addition.length; i += 1) {
            const item = addition[i];

            // Assign a color from COLOR_PALETTE
            const colorIndex = (newColorIndex + i) % colorPalette.length;

            const color = colorPalette[colorIndex];
            // eslint-disable-next-line no-param-reassign
            newColors[item] = `#${color}`;
        }

        return newColors
    }

    updateAbsMaxes(selectedPullDowns, prevSelectedPullDowns) {
        const pdDeletions = prevSelectedPullDowns.filter(x => selectedPullDowns.includes(x));
        const { absMaxes } = this.state;

        if (pdDeletions.length > 0) {
            const newAbsMaxes = Object.fromEntries(
                Object.entries(absMaxes).filter(([k, v]) => !pdDeletions.includes(k)),
            );
            return newAbsMaxes
        }
        return null
    }

    componentDidUpdate(prevProps) {
        const {
            selectedProteins: prevSelectedProteins,
            selectedPullDowns: prevSelectedPullDowns,
        } = prevProps;
        const { selectedProteins, selectedPullDowns } = this.props;
        
        const stateUpdate = {}

        if (!_.isEqual(selectedProteins, prevSelectedProteins)) {
            stateUpdate.colors = this.assignColours(selectedProteins, prevSelectedProteins);
        }

        if (!_.isEqual(selectedPullDowns, prevSelectedPullDowns)) {

            const newAbsMaxes = this.updateAbsMaxes(selectedPullDowns, prevSelectedPullDowns);
            if (newAbsMaxes !== null) {
                stateUpdate.absMaxes = newAbsMaxes;
            }
        }

        // Update state if needed
        if (Object.keys(stateUpdate).length > 0) this.setState(stateUpdate);
    };

    updateAbsMax = (pd, absMax) => {
        const { absMaxes: prevAbsMaxes } = this.state;
        const newAbsMaxes = Object.assign({}, prevAbsMaxes);
        newAbsMaxes[pd] = absMax;

        this.setState({
            absMaxes: newAbsMaxes,
        });
    };

    setColor = (key, color) => {
        const { colors } = this.state;

        const newColors = Object.assign({}, colors);
        newColors[key] = color;
        this.setState({
            colors: newColors,
        });
    };

    render() {
        const { selectedPullDowns, selectedProteins, showImputed } = this.props;
        const { colors, absMaxes } = this.state;

        let perRowLg = null;

        if (selectedPullDowns.length >= 6) {
            perRowLg = 3;
        } else if (selectedPullDowns.length >= 2) {
            perRowLg = 2;
        } else {
            perRowLg = 1;
        }

        const perRowMd = Math.min(perRowLg, 2);
        const perRowSm = 1;

        const cards = [];

        let absMax = null;
        if (Object.keys(absMaxes).length > 0) {
            absMax = Math.round((Math.max(...Object.values(absMaxes)) * 1.1) * 100) / 100;
        }

        for (let i = 0; i < selectedPullDowns.length; i += 1) {
            // Responsive row wrappers inserts wrappers
            if ((i > 0) && ((i % perRowLg) === 0)) {
                cards.push((
                    <div className="w-100 d-none d-lg-block mb-4" key={`spacer-lg-${i}`} />
                ));
            }
            if ((i > 0) && ((i % perRowMd) === 0)) {
                cards.push((
                    <div className="w-100 d-none d-lg-none d-md-block mb-4" key={`spacer-mb-${i}`} />
                ));
            }

            if ((i > 0) && ((i % perRowSm) === 0)) {
                cards.push((
                    <div className="w-100 d-none d-lg-none d-md-none d-sm-block mb-4" key={`spacer-sm-${i}`} />
                ));
            }

            const pd = selectedPullDowns[i];

            cards.push((
                <PullDownComponent
                    key={pd}
                    pd={pd}
                    chartGroup={CHART_GROUP}
                    proteinHighlights={colors}
                    absMax={absMax}
                    showImputed={showImputed}
                    reportAbsMaxFunc={v => this.updateAbsMax(pd, v)}
                />
            ));
        }

        const colorSelector = (
            <Row>
                <Col>
                    <ProteinColorSelector
                        selectedProteins={selectedProteins}
                        colors={colors}
                        onColorChange={this.setColor}
                    />
                </Col>
            </Row>
        );

        const noPdAlert = (
            <Alert variant="info">
                <Alert.Heading>
                    No data selected
                </Alert.Heading>
                <p>
                    To display the visualisation, select a Pull-Down from the menu above.
                </p>
            </Alert>
        );

        const pdDeck = (
            <CardDeck>
                {cards}
            </CardDeck>
        );

        return (
            <Card id="component-pulldown-deck">
                <Card.Header>
                    Scatterplots
                </Card.Header>
                <Card.Body>
                    { selectedProteins.length > 0 ? colorSelector : null }
                    { selectedPullDowns.length > 0 ? pdDeck : noPdAlert }
                </Card.Body>
            </Card>

        );
    }
}

PullDownDeck.propTypes = {
    selectedPullDowns: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedProteins: PropTypes.arrayOf(PropTypes.string).isRequired,
    showImputed: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(PullDownDeck);
