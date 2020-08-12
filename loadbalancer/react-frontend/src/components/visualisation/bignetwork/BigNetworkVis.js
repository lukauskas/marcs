import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import Tippy, {useSingleton} from '@tippyjs/react';
// import { followCursor } from 'tippy.js';

import 'react-tippy/dist/tippy.css';

import {
    Tooltip,
} from 'react-tippy';
import DataColouredSigma from './DataColouredSigma';
import { ComplexBadge, ProteinBadge } from 'components/common/ProteinBadges';



const TOOLTIP_DIV_ID = 'network-tooltip';

const EMPTY_TOOLTIP = (
    <div id={TOOLTIP_DIV_ID} />
);

export default class BigNetworkVis extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false,
            toolTipContent: EMPTY_TOOLTIP,
        };
    }

     onOverNode = (e) => {
         const { node } = e.data;
         const { colourKey } = this.props;

         let responseInfo = null;

         if (colourKey !== 'communities') {
             const { colourData } = this.props;
             const nodeData = colourData[node.id];

             const { logFC, confint_half_width, significant } = nodeData;

             let text = null;
             if (logFC === undefined) {
                 text = 'could not be estimated.';
             } else if (significant) {
                 text = `${logFC} (± ${confint_half_width}).`;
             } else {
                 text = `${logFC} (± ${confint_half_width}, n.s. at FDR ≤0.01).`;
             }

             const textHeader = `${colourKey} effect:`;

             responseInfo = (
                 <div style={{ fontSize: '0.9em' }}>
                     {textHeader}
                     <br />
                     {text}
                 </div>
             );
         }

         const { complexMemberships } = node;
         const complexElements = complexMemberships.map(x => <li className="" key={x}><ComplexBadge className="mt-1 ml-1">{x}</ComplexBadge></li>);
         let complexes = null;
         if (complexElements.length > 0) {
             complexes = (
                 <div>
                     <span style={{ fontSize: '0.9em' }}>Member of:</span>
                     <ul className="list-unstyled">
                         {complexElements}
                     </ul>
                 </div>
             );
         }

         const content = (
             <div className="d-flex text-left flex-column p-0 m-0" id={TOOLTIP_DIV_ID}>
                 <div>
                     <ProteinBadge>{node.id}</ProteinBadge>
                 </div>
                 {responseInfo}
                 {complexes}
             </div>
         );

         this.setState({
             showTooltip: true,
             toolTipContent: content,
         });
     };

    onOutNode = (e) => {
        const { node } = e.data;
        this.setState({
            showTooltip: false,
            toolTipContent: EMPTY_TOOLTIP,
        });
    };

    render() {
        const {
            className,
            nodes,
            edges,
            colourKey,
            colourData,
            highlightedNodes,
        } = this.props;
        const { showTooltip, toolTipContent } = this.state;

        let sigma = null;
        if ((nodes.length > 0) && (edges.length > 0)) {
            const graph = { nodes, edges };
            // Load only once, when we have all data...
            sigma = (
                <DataColouredSigma
                    // graph={graph}
                    graph={graph}
                    renderer="webgl"
                    // className={className}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    onOverNode={this.onOverNode}
                    onOutNode={this.onOutNode}
                    // colourKey={colourKey}
                    colourKey={colourKey}
                    colourData={colourData}
                    highlightedNodes={highlightedNodes}
                />
            );
        }

        return (
            <>
                <div className={className}>
                    <Tooltip
                        open={showTooltip}
                        followCursor
                        html={toolTipContent}
                        position="bottom"
                        animation="none"
                        animateFill={false}
                        duration={0}
                        trigger="manual"
                        maxWidth={500}
                        title={null}
                    >
                        {sigma}
                    </Tooltip>
                </div>
            </>
        );
    }
}

BigNetworkVis.propTypes = {
    className: PropTypes.string,
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    edges: PropTypes.arrayOf(PropTypes.object).isRequired,
    colourKey: PropTypes.string,
    colourData: PropTypes.objectOf(PropTypes.any),
    highlightedNodes: PropTypes.arrayOf(PropTypes.string),
};

BigNetworkVis.defaultProps = {
    className: null,
    colourKey: 'communities',
    colourData: {},
    highlightedNodes: [],
};
