import React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';

import ReactDOM from 'react-dom';
import Menu from 'components/nav/Menu';
import Footer from 'components/nav/Footer';
import store, { history } from 'components/stores/main';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import Hello from 'components/apps/hello';
import ProteinDetails from 'components/apps/proteindetails';
import PullDowns from 'components/apps/pds';
import Network from 'components/apps/network';
import ComplexList from 'components/apps/complexlist';
import ProteinList from 'components/apps/proteinlist';
import NotFound from 'components/apps/notfound';
import DataIndex from 'components/apps/dataindex';
import ReaderInfo from 'components/apps/readerinfo';

import { PTM_PREDICTOR_ORDER, PTM_PREDICTOR_ORDER_WEBSAFE } from 'data/ptms';
import ReaderLandingPage from 'components/apps/readerlandingpage';
import DownloadsPage from 'components/apps/downloads';
import AboutPage from 'components/apps/about';

import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import {
    MATOMO_DEBUG, MATOMO_DISABLED, MATOMO_SITE_ID, MATOMO_URL_BASE,
} from 'data/matomo';


// eslint-disable-next-line react/prop-types
function ReaderInfoSwitch({ match }) {
    // eslint-disable-next-line react/prop-types
    let { ptm } = match.params;
    // eslint-disable-next-line react/prop-types
    ptm = ptm.toLowerCase();

    const index = PTM_PREDICTOR_ORDER_WEBSAFE.indexOf(ptm);

    if (index >= 0) {
        ptm = PTM_PREDICTOR_ORDER[index];

        return (
            <ReaderInfo ptm={ptm} />
        );
    }

    return (<NotFound />);
}

function makeMatomo() {
    const options = {
        urlBase: MATOMO_URL_BASE,
        siteId: MATOMO_SITE_ID,
        configurations: {
            disableCookies: true,
        },
    };

    // eslint-disable-next-line eqeqeq
    const isMatomoDisabled = String(MATOMO_DISABLED).toLowerCase() == "true";

    if (isMatomoDisabled) {
        // MatomoContext will just ignore this and not say anything
        console.log('MATOMO tracking is disabled');
        options.disabled = true;
    }

    const instance = createInstance(options);
    if (MATOMO_DEBUG && !isMatomoDisabled) {
        console.group('Matomo tracking is on');
        console.log(`MATOMO_URL_BASE=${MATOMO_URL_BASE}`);
        console.log(`MATOMO_SITE_ID=${MATOMO_SITE_ID}`);
        console.log(instance);
        console.groupEnd();
    }
    return instance;
}

const matomoInstance = makeMatomo();

// eslint-disable-next-line no-shadow
const Root = ({ store }) => {
    return (
        <Provider store={store}>
            <MatomoProvider value={matomoInstance}>
                <ConnectedRouter history={history}>
                    <div>
                        <Menu />
                        <Switch>
                            <Route exact path="/" component={Hello} />
                            <Route path="/about" component={AboutPage} />
                            <Route path="/proteins" component={ProteinDetails} />
                            <Route path="/network" component={Network} />
                            <Route path="/pds" component={PullDowns} />
                            <Route path="/data/complexes" component={ComplexList} />
                            <Route path="/data/proteins" component={ProteinList} />
                            <Route path="/downloads" component={DownloadsPage} />
                            <Route path="/data/" component={DataIndex} />
                            <Route exact path="/readers/" component={ReaderLandingPage} />
                            <Route path="/readers/:ptm" component={ReaderInfoSwitch} />
                            <Route component={NotFound} />
                        </Switch>
                        <Footer />
                    </div>
                </ConnectedRouter>
            </MatomoProvider>
        </Provider>
    );
};

Root.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    store: PropTypes.object.isRequired,
};

ReactDOM.render(
    <Root store={store} />,
    document.getElementById('root'),
);
