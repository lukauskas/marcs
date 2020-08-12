import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';

import PullDownBadges from "components/common/PullDownBadges";
import DataSummaryTable from "components/common/DataSummaryTable";

class ToolTip extends PureComponent {
    render() {

        const maxAnnotsToShow = 10;

        const { pd, proteinData, annotationData, annotationIsComplexes } = this.props;

        let proteinInfoElement = null;

        if (proteinData !== null) {
            const { protein } = proteinData;

            proteinInfoElement = (
                <div className="border-top">
                    <h5 className="mt-2">{protein}</h5>
                    <DataSummaryTable {...proteinData} />
                </div>
            );
        }

        let annotationElement = null;

        if (annotationData.length > 0) {
            let lis = annotationData.map(x => (
                <li key={x.value} className="d-flex">
                    <span
                        className="m-1 d-flex float-left"
                        style={{
                            backgroundColor: x.color,
                            width: 11,
                            height: 11,
                            borderRadius: 11,
                        }}
                    />
                    {x.value}
                </li>
            ));

            if (lis.length > maxAnnotsToShow) {
                lis = lis.slice(0, maxAnnotsToShow);
                const diff = annotationData.length - maxAnnotsToShow;
                const text = diff === 1 ? 'other' : 'others';

                lis.push((
                    <li className="d-flex">
                        {`and ${diff} ${text}`}
                    </li>
                ));
            }

            annotationElement = (
                <div className="border-top">
                    <h5 className="mt-2">
                        {annotationIsComplexes ? 'Member of:' : 'Contains:'}
                    </h5>
                    <ul className="list-unstyled">
                        {lis}
                    </ul>
                </div>
            );
        }

        return (
            <>
                <div>
                    <PullDownBadges identifier={pd} />
                </div>
                {proteinInfoElement}
                {annotationElement}
            </>
        );
    }
}

ToolTip.propTypes = {
    pd: PropTypes.string.isRequired,
    proteinData: PropTypes.object,
    annotationData: PropTypes.arrayOf(PropTypes.object),
    annotationIsComplexes: PropTypes.bool,
};

ToolTip.defaultProps = {
    proteinData:  null,
    annotationData: [],
    annotationIsComplexes: false,
};

export function tooltipFormatter(params) {

    let paramsAsArray = params;
    if (!Array.isArray(paramsAsArray)) paramsAsArray = [paramsAsArray];
    // First we sort the provided params by axis
    const headerParams = params.filter(x => (x.axisId === 'header-x-0') && (x.seriesId === 'headerSeries'));
    // Nothing we can do without header as we need the columns
    if (headerParams.length === 0) return null;
    const column = headerParams[0].axisValue;

    const annotationParams = params.filter(x => x.axisId === 'heatmap-y-3');

    // Prefilter the params for column at this step already
    // Since both fwd and reverse contain the same data we can prefilter this.
    const dataParams = params.filter(
        x => (
            (x.axisId === 'heatmap-y-1')
            && (x.data.pd === column)
            && (x.seriesId === 'heatmapSeriesFwd')
        ),
    );

    if (dataParams.length > 1) {
        console.warn('Dataparams length >1, ignoring tooltip');
        return null;
    }

    const proteinData = (dataParams.length > 0) ? dataParams[0].data : null;
    const annotationData = annotationParams.map((x) => {
        const ans = { color: x.color };
        const { data: d } = x;

        if (d.complex !== undefined) {
            ans.value = d.complex;
        } else {
            ans.value = d.desc;
        }

        return ans;
    });

    const annotationIsComplexes = annotationParams.some(x => x.data.complex !== undefined);

    return ReactDOMServer.renderToStaticMarkup(<ToolTip
        pd={column}
        proteinData={proteinData}
        annotationData={annotationData}
        annotationIsComplexes={annotationIsComplexes}
    />);

}
