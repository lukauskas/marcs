// This is heavily inspired by https://github.com/dunnock/react-sigma
// but rewritten to have less functionality in general, but more funcitonality that we need.

import React, { PureComponent } from 'react';
import SigmaInstance from 'sigma';
import PropTypes from 'prop-types';
import _ from 'lodash';
import chroma from 'chroma-js';
import { rangedFactorColorScale } from '../ptmResponse/colors';

export default class Sigma extends PureComponent {
    static bindHandlers(handlers, sigma) {
        ['clickNode', 'overNode', 'outNode', 'clickEdge', 'overEdge', 'outEdge', 'clickStage'].forEach((event) => {
            const handler = `on${event[0].toUpperCase()}${event.substr(1)}`;
            if (handlers[handler]) {
                sigma.bind(event, handlers[handler]);
            }
        });
    }


    constructor(props) {
        super(props);
        const { settings } = this.props;
        this.sigma = new SigmaInstance({ settings });
        this.sigmaRenderer = null;

        this.reloadGraph(props.graph);
        Sigma.bindHandlers(this.props, this.sigma);
    }

    componentDidMount() {
        const { renderer } = this.props;
        const { el } = this;

        this.sigmaRenderer = this.sigma.addRenderer({
            type: renderer,
            container: el,
        });

        this.tooltipEl = document.createElement('div');

        this.sigma.refresh();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { graph, colourKey, colourData } = this.props;
        const { graph: prevGraph, colourKey: prevColourKey, colourData: prevColourData } = prevProps;

        const currentHighlightedNodesSet = this.highlightedNodesSet(this.props);
        const prevHighlightedNodesSet = this.highlightedNodesSet(prevProps);

        if (!_.isEqual(graph, prevGraph)) this.reloadGraph(graph);
        else if (colourKey !== prevColourKey) {
            console.log('Recolouring because of color key change');
            this.recolourGraph();
        } else if (!_.isEqual(currentHighlightedNodesSet, prevHighlightedNodesSet)) {
            console.log('Recolouring because of highlight change');
            this.recolourGraph();
        } else if ((colourKey !== 'communities') && (colourData.colourKey !== prevColourData.colourKey)) {
            console.log('Recolouring because of color data change');
            this.recolourGraph();
        }
    }

    componentWillUnmount() {
        if (this.sigmaRenderer !== null) {
            this.sigma.killRenderer(this.sigmaRenderer);
            this.sigmaRenderer = null;
        }
        this.sigma.kill();
    }

    highlightedNodesSet(props) {
        const { highlightedNodes } = props;
        return new Set(highlightedNodes);
    }


    reloadGraph(newGraph) {
        this.sigma.graph.clear();
        this.sigma.graph.read(newGraph);
        this.recolourGraph(false);
        this.sigma.refresh();
    }

    recolourGraph(refreshAfter = true) {
        const {
            colourKey,
            backgroundNodesDesaturationLevel,
            colourData,
        } = this.props;

        const highlightedNodes = this.highlightedNodesSet(this.props);
        const anyNodesHighlighted = highlightedNodes.size > 0;

        let recolor = x => x;


        if (colourKey !== 'communities') {
            const scale = rangedFactorColorScale(colourKey);
            recolor = (node) => {
                const nodeData = colourData[node.id];

                let val = 0.0;

                if ((nodeData !== undefined) && (nodeData.logFC !== undefined)) val = nodeData.logFC;

                let color = scale(val);
                if (anyNodesHighlighted) {
                    const nodeIsHighlighted = highlightedNodes.has(node.id);
                    if (!nodeIsHighlighted) color = color.desaturate(backgroundNodesDesaturationLevel);
                }

                // Assignment OK here as these objects are supposed to be mutable
                // eslint-disable-next-line no-param-reassign
                node.color = color.css();
            };
        } else {
            recolor = (node) => {
                let color = node.communityColor;
                if (anyNodesHighlighted) {
                    const nodeIsHighlighted = highlightedNodes.has(node.id);
                    if (!nodeIsHighlighted) color = chroma(color).desaturate(backgroundNodesDesaturationLevel).css();
                    // if (!nodeIsHighlighted) color = '#FF0000';
                }
                // Assignment OK here as these objects are supposed to be mutable
                // eslint-disable-next-line no-param-reassign
                node.color = color;
            };
        }

        this.sigma.graph.nodes().forEach(n => recolor(n));
        if (refreshAfter) this.sigma.refresh();
    }

    render() {
        const { style } = this.props;
        return (
            <div ref={el => this.el = el} style={style} />
        );
    }
}

Sigma.defaultProps = {
    settings: {
        defaultNodeColor: '#3388AA',
        defaultLabelSize: 16,
        defaultLabelColor: '#777',
        labelThreshold: 8,
        labelSize: 'proportional',
        // hoverFontStyle: 'text-size: 0'
        enableHovering: false,
        batchEdgesDrawing: true,
        drawEdges: true,
        drawEdgeLabels: false,
        clone: true,
        minNodeSize: 5,
        maxNodeSize: 5,
        immutable: true,
        zoomMin: 0.2,
    },
    style: {
        width: '100%',
        height: '100%',
    },
    highlightedNodes: [],
    backgroundNodesDesaturationLevel: 10,
};

Sigma.propTypes = {
    settings: PropTypes.object,
    renderer: PropTypes.oneOf(['webgl', 'canvas', 'svg']),
    style: PropTypes.object,
    children: PropTypes.any,
    graph: PropTypes.object,
    onSigmaException: PropTypes.func,
    onClickNode: PropTypes.func,
    onClickEdge: PropTypes.func,
    onOverEdge: PropTypes.func,
    onOutEdge: PropTypes.func,
    onOverNode: PropTypes.func,
    onOutNode: PropTypes.func,
    onClickStage: PropTypes.func,
    colourKey: PropTypes.string.isRequired,
    colourData: PropTypes.objectOf(PropTypes.any),
    highlightedNodes: PropTypes.arrayOf(PropTypes.string),
    backgroundNodesDesaturationLevel: PropTypes.number,
};
