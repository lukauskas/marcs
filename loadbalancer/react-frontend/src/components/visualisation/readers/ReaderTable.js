import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import _ from 'lodash';
import {multiComplexFormatter, singleProteinFormatter} from "../../tables/formatters";
import Button from "react-bootstrap/Button";

const customSort = (rows, field, direction) => {

    let sortDirection = direction;

    if ((field === 'neg_log10_p') || (field === 'neg_log10_p_adjust')) {
        // Swap sort direction so we're sorting by p/q value not log of it.
        if (sortDirection === 'asc') {
            sortDirection = 'desc';
        } else {
            sortDirection = 'asc';
        }
    }
    return _.orderBy(rows, field, sortDirection);
};

const conditionalFCStyles = [
  {
    when: row => row.significant && (row.logFC >= 1),
    style: {
      backgroundColor: '#b2182b',
      color: 'white',
    },
  }, {
    when: row => row.significant && (row.logFC > 0) && (row.logFC < 1),
    style: {
      backgroundColor: '#ef8a62',
      color: 'white',
    },
  }, {
    when: row => row.significant && (row.logFC <= -1),
    style: {
      backgroundColor: '#2166ac',
      color: 'white',
    },
  }, {
    when: row => row.significant && (row.logFC < 0) && (row.logFC > -1),
    style: {
      backgroundColor: '#67a9cf',
      color: 'white',
    },
  },
];


function getColumns(ptm) {

    const columns = [{
        name: 'Protein',
        selector: 'protein',
        sortable: false,
        maxWidth: '80pt',
        // grow: 2,
        // maxWidth: %',
    },
    {
        selector: 'logFC',
        name: `Effect`,
        cell: row => {
            const text = `${row.logFC} (± ${row.confint_half_width})`;
            return (
                <span style={{whiteSpace: 'nowrap'}}>
                    {text}
                </span>
            );
        },
        sortable: true,
        maxWidth: '30pt',
        conditionalCellStyles: conditionalFCStyles,
    }, {
        selector: 'neg_log10_p_adjust',
        name: 'Q-value',
        cell: row => (10 ** (-row.neg_log10_p_adjust)).toExponential(4),
        sortable: true,
        maxWidth: '30pt',
    },
    ];

    return columns;
}

const ExpandedRow = ({ data }) => {

    const proteinBadge = singleProteinFormatter(data.protein);

    let geneNames = null;

    if (data.gene_names.length > 0) {
        geneNames = data.gene_names.join(', ');
        geneNames = ' (' + geneNames + ')';
    }

    let proteinNames = null;
    if (data.protein_names.length > 0) {
        proteinNames = data.protein_names.join(', ');
        proteinNames = (<p>{proteinNames}</p>);
    }

    let complexes = null;
    if (data.complex_memberships.length > 0) {
        complexes = (
            <p>
                Member of:
                { multiComplexFormatter(data.complex_memberships) }
            </p>
        );
    }

    const pValue = (10**(-data.neg_log10_p)).toExponential(4);

    let statsParagraph = (
        <ul>
            <li>Moderated t: {data.t} (stdev: {data.moderated_t_stdev})</li>
            <li>Unadjusted p-value: {pValue}</li>
            <li>Total d.o.f: {data.df_total}</li>
        </ul>
    );

    const heatmapLink = `/proteins?k=p:${data.protein}`;

    return (
        <div className="expanded-row">
            <h3>{proteinBadge}{geneNames}</h3>
            {proteinNames}
            {statsParagraph}
            {complexes}
            <Button href={heatmapLink} size="sm">
                View in Protein Pages
            </Button>
        </div>
    );
};

export default class ReaderTable extends PureComponent {
    render() {
        const { data, ptm} = this.props;
        const columns = getColumns(ptm);

        return (
                 <DataTable
                    columns={columns}
                    data={data}
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    sortFunction={customSort}
                    defaultSortField='neg_log10_p_adjust'
                    defaultSortAsc
                    dense
                    expandableRows
                    expandableRowsComponent={<ExpandedRow />}
                    noHeader
                />
        );
    }
}

ReaderTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    ptm: PropTypes.string.isRequired,
};
