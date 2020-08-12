import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import './styles/DataTooltip.css'

export default class DataSummaryTable extends React.PureComponent {
    render() {
        const {
            ratio_forward,
            ratio_reverse, imputation,
            log10_intensity_forward,
            log10_intensity_reverse,
            peptides_forward, peptides_reverse,
            unique_peptides_forward, unique_peptides_reverse,
        } = this.props;

        return (
            <Table size="sm">
                <thead>
                    <tr>
                        <th />
                        <th scope="col">
                        Forward
                        </th>
                        <th scope="col">
                        Reverse
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">
                        Ratio H/L (log2)
                        </th>
                        <td>
                            {ratio_forward}
                        </td>
                        <td>
                            {ratio_reverse}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                        Imputation type
                        </th>
                        <td colSpan="2">
                            {imputation}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                        MS1 Intensity (log10)
                        </th>
                        <td>
                            {log10_intensity_forward}
                        </td>
                        <td>
                            {log10_intensity_reverse}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                        Peptides (Unique)
                        </th>
                        <td>
                            {`${peptides_forward} (${unique_peptides_forward})`}
                        </td>
                        <td>
                            {`${peptides_reverse} (${unique_peptides_reverse})`}
                        </td>
                    </tr>
                </tbody>
            </Table>
        );

    }
}

DataSummaryTable.propTypes = {
    protein: PropTypes.string.isRequired,
    pd: PropTypes.string.isRequired,
    ratio_forward: PropTypes.number.isRequired,
    ratio_reverse: PropTypes.number.isRequired,
    imputation: PropTypes.string.isRequired,
    log10_intensity_forward: PropTypes.number.isRequired,
    log10_intensity_reverse: PropTypes.number.isRequired,
    peptides_forward: PropTypes.number.isRequired,
    peptides_reverse: PropTypes.number.isRequired,
    unique_peptides_forward: PropTypes.number.isRequired,
    unique_peptides_reverse: PropTypes.number.isRequired,
};
