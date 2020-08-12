import React, { Component, PureComponent } from 'react';
import { rateLimitedAxios } from 'components/helpers/rateLimitedAxios';

import {WEB_INTERFACE_BUILD_COMMIT, WEB_INTERFACE_BUILD_DATE, WEB_INTERFACE_BUILD_TYPE} from 'data/build';
import {SNAP_DATA_VERSION} from "data/dataVersion";
import Spinner from "react-bootstrap/Spinner";

export default class VersionInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apiVersion: null,
            error: null,
            isLoading: true,
        };
    }

    mergeData = (response) => {
        if (response.status !== 200) {
            console.error('Response status is not 200? not updating scatterplot.');
            this.setState({
                isLoading: false,
                error: `Unexpected response from API: ${response.status}`,
            });
            return;
        }

        const responseData = response.data;
        const parsedVersion = responseData.version;

        let error = null;
        if ((parsedVersion.snapanalysis.date !== SNAP_DATA_VERSION.date) || (parsedVersion.snapanalysis.commit !== SNAP_DATA_VERSION.commit)) {
            console.group();
            console.log(parsedVersion);
            console.log(SNAP_DATA_VERSION);
            console.groupEnd();
            error = 'Data versions in the frontend and backend do not match. This happens when the website is built incorrectly. Contact administrator';
        }

        this.setState({
            apiVersion: parsedVersion,
            error: error,
            isLoading: false,
        });
    };

    handleError = (error) => {
        const { status } = error.response;
        const { statusText } = error.response;

        this.setState({
            error: `API returned HTTP ${status}: ${statusText}`,
            isLoading: false,
        });
    };

    fetchData = () => {
        const URI = `/api/`;

        rateLimitedAxios.get(URI).then(
            this.mergeData,
        ).catch(
            this.handleError,
        );
    };

    componentDidMount = () => {
        this.fetchData();
    };

    render () {

        const frontendBuildText = `${WEB_INTERFACE_BUILD_DATE} (${WEB_INTERFACE_BUILD_COMMIT}-${WEB_INTERFACE_BUILD_TYPE})`;

        let backendBuildText = '?';
        let dataBuildText = '?';

        const {isLoading, error} = this.state;
        let errorText = null;
        if (error !== null) {
            errorText = (
                <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                </div>
            )
        }

        if (isLoading) {
            backendBuildText = <Spinner animation="grow" role="status" size="sm" />;
            dataBuildText = <Spinner animation="grow" role="status" size="sm" />;
        } else {
            const {api:apiVersion, snapanalysis:dataVersion} = this.state.apiVersion;
            backendBuildText = `${apiVersion.date} (${apiVersion.commit})`;
            dataBuildText = `${dataVersion.date} (${dataVersion.commit})`;
        }

        return (
            <>
                {errorText}
                <ul className="list-unstyled">
                    <li><strong>Data build:</strong> {dataBuildText}</li>
                    <li><strong>Website version (backend):</strong> {backendBuildText}</li>
                    <li><strong>Website version (frontend):</strong> {frontendBuildText}</li>
                </ul>
            </>
        );
    }

}