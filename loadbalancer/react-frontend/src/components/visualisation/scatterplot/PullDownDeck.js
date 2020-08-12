import React, { Component } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import { connect } from 'react-redux';
import PullDownComponent from 'components/visualisation/scatterplot/scatterplot';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PropTypes from 'prop-types';

import echarts from 'echarts';
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

class PullDownDeck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: {},
            absMaxes: {},
        };
    }

    componentDidMount() {
        echarts.connect(CHART_GROUP);
    }

    componentDidUpdate(prevProps) {
        const {
            selectedProteins: prevSelectedProteins,
            selectedPullDowns: prevSelectedPullDowns,
        } = prevProps;
        const { selectedProteins, selectedPullDowns } = this.props;

        if (!_.isEqual(selectedProteins, prevSelectedProteins)) {
            const addition = selectedProteins.filter(x => !prevSelectedProteins.includes(x));
            const deletion = prevSelectedProteins.filter(x => !selectedProteins.includes(x));

            const newColorIndex = selectedProteins.length - deletion.length;
            const newSize = newColorIndex + addition.length;

            const colorPalette = palette(['cb-Set1', 'mpn65', 'tol-rainbow'], newSize);

            const { colors } = this.state;
            const newColors = {};

            Object.keys(colors).filter(x => !deletion.includes(x)).forEach((x) => {
                newColors[x] = colors[x];
            });

            for (let i = 0; i < addition.length; i += 1) {
                const item = addition[i];
                const color = colorPalette[newColorIndex + i];
                // eslint-disable-next-line no-param-reassign
                newColors[item] = `#${color}`;
            }

            this.setState({
                colors: newColors,
            });
        }

        if (!_.isEqual(selectedPullDowns, prevSelectedPullDowns)) {
            const pdDeletions = prevSelectedPullDowns.filter(x => selectedPullDowns.includes(x));
            const { absMaxes } = this.state;

            if (pdDeletions.length > 0) {
                const newAbsMaxes = Object.fromEntries(
                    Object.entries(absMaxes).filter(([k, v]) => !pdDeletions.includes(k)),
                );
                this.setState({
                    absMaxes: newAbsMaxes,
                });
            }
        }
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
