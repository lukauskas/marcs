import React, { Component } from "react";
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";
import ReaderTable from "./ReaderTable";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import './css/ptmresponse.css'
import Volcano from "./Volcano";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import parseAxiosError from "../../helpers/parseAxiosError";
import ErrorToast from "../../error/ErrorToast";

export default class VolcanoAndTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: true,
            data: [],
            highlightMode: 'all',
        };
    }

     mergeData = (response) => {
         if (response.status !== 200) {
             const errorStatus = response.status;

             this.setState({
                 error: `Unexpected HTTP ${errorStatus}`,
                 loading: false,
             });
             return;
         }

         const responseData = response.data;

         this.setState({
             data: responseData,
             loading: false,
             error: null,
         });
     };

     handleError = (error) => {
        const errorMessage = parseAxiosError(error);
        this.setState({
            error: errorMessage,
            loading: false,
        });
    };

     clearError = () => {
        this.setState({
            error: null,
        });
    };

    fetchData = () => {

        const { ptm } = this.props;

        const URI = `/api/ptms/full/${ptm}`;

        rateLimitedAxios.get(URI).then(
            this.mergeData,
        ).catch(
            this.handleError
        );
    };

    componentDidMount = () => {
        this.fetchData();
    };

    changeHighlightMode = (newMode) => {
        this.setState({
            highlightMode: newMode,
        });
    };

    render() {
        const { data, loading, error, highlightMode } = this.state;
        const { ptm } = this.props;

        if (loading) {
            return (
                <div>
                    <Spinner animation="grow" role="status" size="sm" className="mr-3" />
                Loading...
                </div>
            );
        }
        if (error !== null) {
            return (
                <Row>
                    <Col md={12} style={{minHeight: 400}}>
                        <ErrorToast
                            title="Visualisation failed"
                            errorMessage={error}
                            onClose={this.clearError}
                        />
                    </Col>
                </Row>
            );
        }

        let selectedTab = 'all';
        let filteredData = data;

        if (highlightMode === 'recruited') {
            selectedTab = 'recruited';
            filteredData = data.filter(x => x.significant && x.logFC > 0);
        } else if (highlightMode === 'excluded') {
            selectedTab = 'excluded';
            filteredData = data.filter(x => x.significant && x.logFC < 0);
        }

        const recruitedText = `Recruited by ${ptm}`;
        const excludedText = `Excluded by ${ptm}`;

        return (
            <Row>
                <Col lg={6} style={{minHeight: 500, backgroundColor: '#FFFFFF'}} id="ptmeffect-volcano-plot">
                    <Volcano ptm={ptm} dataset={data} highlightType={highlightMode} />
                </Col>
                <Col lg={6} className="p-5" style={{backgroundColor: '#FFFFFF'}} id="ptmeffect-table">
                      <Tabs
                            activeKey={selectedTab}
                            onSelect={this.changeHighlightMode}
                      >
                          <Tab eventKey='recruited' title={recruitedText} />
                          <Tab eventKey='excluded' title={excludedText} />
                          <Tab eventKey='all' title="All" />
                      </Tabs>
                    <ReaderTable id="reader-table" data={filteredData} ptm={ptm}/>
                </Col>
            </Row>
        );
    }
}

VolcanoAndTable.propTypes = {
    ptm: PropTypes.string.isRequired,
};
