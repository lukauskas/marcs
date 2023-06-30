import {
    createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import geneSelectReducer from 'components/stores/reducers/geneSelect';
import pullDownSelectReducer from 'components/stores/reducers/pullDownSelect';
import { queryMiddleware, redirectMiddleware } from 'components/stores/middlewares/routing';
import heatmapControlReducer from 'components/stores/reducers/heatmapControl';
import scatterplotControlReducer from 'components/stores/reducers/scatterplotControl';
import networkReducer from './reducers/networks';
import licenseReducer from './reducers/licenseReducer';

function historyReducer(history) {
    return combineReducers({
        router: connectRouter(history),
        geneSelect: geneSelectReducer,
        pullDowns: pullDownSelectReducer,
        heatmapControl: heatmapControlReducer,
        scatterplotControl: scatterplotControlReducer,
        network: networkReducer,
        license: licenseReducer,
    });
}

export const history = createBrowserHistory();


let composeEnhancers = compose;

if (process.env.NODE_ENV !== 'production') {
    console.log("Debug mode detected, enabling REDUX devtools");
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const store = createStore(historyReducer(history), composeEnhancers(
    applyMiddleware(
        routerMiddleware(history),
        queryMiddleware,
        redirectMiddleware,
    ),
));

export default store;
