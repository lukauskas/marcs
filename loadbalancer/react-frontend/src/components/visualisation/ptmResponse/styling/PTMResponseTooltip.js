import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';
import Table from 'react-bootstrap/Table';

import 'components/common/styles/PullDownBadges.css';
import { rangedFactorColorScale } from '../colors';

const H3_PTMS = [
    'H3K4me1',
    'H3K4me3',
    'H3ac',
    'H3K9acK14ac',
    'H3K9me2',
    'H3K9me3',
    'H3K27ac',
    'H3K27me2',
    'H3K27me3',
];

const H4_PTMS = [
    'H4ac',
    'H4K16ac',
    'H4K20me2',
    'H4K20me3',
];

const OTHER_PTMS = [
    'H2A.Z',
    'DNA Methylation',
];

export function logFCColoredSpan(
    ptm, logFC, plusMinus, significant,
    defaultStyle = {}, className='rounded p-1') {

    let ans = '?';

    const style = { ...defaultStyle };

    if ((plusMinus !== undefined) && (logFC !== undefined)) {
        const star = significant ? '' : '*';

        ans = `${logFC}${star} (± ${plusMinus})`;
        const scale = rangedFactorColorScale(ptm);

        const color = scale(logFC);
        const colorCss = color.css();
        // https://github.com/gka/chroma.js/issues/181
        const fontColor = color.get('lab.l') < 70 ? 'white' : 'black';

        if (significant) {
            style.fontWeight = 'bold';
            style.backgroundColor = colorCss;
            style.color = fontColor;
            style.whiteSpace = 'nowrap';
        } else {
            const brighterColor = color.brighten(0.5).css();
            style.background = `repeating-linear-gradient(45deg, ${brighterColor}, ${brighterColor} 4px, ${colorCss} 4px, ${colorCss} 8px)`;
            style.color = fontColor;
            style.whiteSpace = 'nowrap';
        }
    }


    return (
        <span style={style} className={className}>
            {ans}
        </span>
    );
}

function logFCStr(ptm, proteinRow) {
    const {
        confint_half_width: plusMinus,
        logFC,
        significant,
    } = proteinRow[ptm];

    return logFCColoredSpan(ptm, logFC, plusMinus, significant);
}

function logFCRow(ptm, proteinRow) {
    const values = logFCStr(ptm, proteinRow);

    return (
        <tr key={ptm}>
            <th>
                {ptm}
            </th>
            <td>
                {values}
            </td>
        </tr>
    );
}

class PTMResponseTooltip extends PureComponent {
    render() {
        const { protein, proteinRow } = this.props;

        const h3rows = H3_PTMS.map(ptm => logFCRow(ptm, proteinRow));
        const h4rows = H4_PTMS.map(ptm => logFCRow(ptm, proteinRow));
        const otherRows = OTHER_PTMS.map(ptm => logFCRow(ptm, proteinRow));

        return (
            <div>
                <h5>
                    {protein}
                </h5>

                <div className="d-flex flex-row">
                    <div className="p-1">
                        <Table size="sm" variant="borderless">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">
                                        PTM
                                    </th>
                                    <th scope="col">
                                        Effect (95% CI)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {h3rows}
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-flex flex-column p-1">
                        <div>
                            <Table size="sm" variant="borderless">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">
                                            PTM
                                        </th>
                                        <th scope="col">
                                            Effect (95% CI)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {h4rows}
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <Table size="sm" variant="borderless">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">
                                            PTM
                                        </th>
                                        <th scope="col">
                                            Effect (95% CI)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {otherRows}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row m-0 p-0">
                    <ul className="list-inline">
                        <li className="list-inline-item">
                            ? - effect could not be estimated
                        </li>
                        <li className="list-inline-item">
                            * - effect not significant at FDR 0.01
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

PTMResponseTooltip.propTypes = {
    protein: PropTypes.string.isRequired,
    proteinRow: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default function ptmTooltipFormatter(protein, proteinRow) {
    const rendered = ReactDOMServer.renderToStaticMarkup(<PTMResponseTooltip
        protein={protein}
        proteinRow={proteinRow}
    />);

    return () => rendered;
}
