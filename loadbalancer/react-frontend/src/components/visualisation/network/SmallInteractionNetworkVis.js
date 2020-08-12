import React, { PureComponent } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import PropTypes from 'prop-types';
import Cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
Cytoscape.use(cola);

const DEFAULT_LAYOUT = {
    name: 'cola',
    fit: true,
    padding: 10,
    nodeDimensionsIncludeLabels: true,
    avoidOverlap: true,
    randomize: true,
    nodeSpacing: () => 5,
    // edgeLength: (n) => {
    //     const score = n.weight;
    //     const offset = Math.min(Math.max(0, (score - 3) / (6 - 3)), 1);
    //     return 1 + (1 - offset) * 5;
    // },
};


const DEFAULT_STYLING = [
    {
        selector: 'node',
        style: {
            borderWidth: 1,
            backgroundColor: '#378cb9',
            borderColor: 'black',
            label: 'data(id)',
            color: 'black',
        },
    },
    {
        selector: 'edge[interactionExists = "n"]',
        style: {
            lineColor: '#CC503E',
        },
    },
    {
        selector: 'edge[interactionExists = "y"]',
        style: {
            lineColor: '#4e8db6',
        },
    },
    {
        selector: 'edge',
        style: {
            width: 'data(weight)',
        },
    },
];

export default class SmallInteractionNetworkVis extends PureComponent {
    getElements() {
        const { nodes, edges } = this.props;

        const nodeSet = new Set(nodes);

        const nodeElements = nodes.map(x => ({
            group: 'nodes',
            data: {
                id: x,
            },
        }));

        // Filter is needed as cytoscape crashes otherwise.
        const edgeElements = edges.filter(x => nodeSet.has(x.protein_a) && nodeSet.has(x.protein_b))
            .map(x => ({
                group: 'edges',
                data: {
                    source: x.protein_a,
                    target: x.protein_b,
                    negLog10Q: x.neg_log10_q,
                    interactionExists: x.interaction_exists,
                    weight: Math.max(Math.min((x.neg_log10_q - 3) + 1, 10), 1),
                },
            }));

        return [...nodeElements, ...edgeElements];
    }

    render() {
        const elements = this.getElements();
        return (
            <CytoscapeComponent
                elements={elements}
                style={{ width: '100%', height: '100%' }}
                layout={DEFAULT_LAYOUT}
                stylesheet={DEFAULT_STYLING}
            />
        );
    }
}

SmallInteractionNetworkVis.propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    edges: PropTypes.arrayOf(PropTypes.object).isRequired,
};
