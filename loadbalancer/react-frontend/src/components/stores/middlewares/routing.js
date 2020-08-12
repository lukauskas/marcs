import { encode as encodeQuery, decode as decodeQuery } from 'querystring';
import produce from 'immer';
import { push } from 'connected-react-router';
import { MODIFY_QUERY_STRING, REDIRECT } from '../actions/routing';

export const queryMiddleware = store => next => (action) => {
    if (action.type === MODIFY_QUERY_STRING) {
        const { location } = store.getState().router;

        let { search } = location;

        if (search.startsWith('?')) {
            search = search.slice(1);
        }
        const oldQueryString = decodeQuery(search);
        let newQueryStringDict = produce(oldQueryString, action.template);
        // Remove empty keys (sometimes happens..)
        // https://stackoverflow.com/a/57625661
        newQueryStringDict = Object.entries(newQueryStringDict).reduce((a, [k, v]) => (k === "" ? a : { ...a, [k]: v }), {});

        const newQueryString = encodeQuery(newQueryStringDict);

        const newLocation = `${location.pathname}?${newQueryString}${location.hash}`;
        store.dispatch(push(newLocation));
        return next(action);
    }
    return next(action);
};

export const redirectMiddleware = store => next => (action) => {
    if (action.type === REDIRECT) {
        const { pathName, queryString } = action;
        // Remove empty keys (sometimes happens)
        const newQueryStringDict = Object.entries(queryString).reduce((a, [k, v]) => (k === "" ? a : { ...a, [k]: v }), {});

        const newQueryString = encodeQuery(newQueryStringDict);
        const newLocation = `${pathName}?${newQueryString}`;
        store.dispatch(push(newLocation));
        return next(action);
    }
    return next(action);
};

//
// function updateQueryString(currentLocation, updateFunc) {
//     const oldQueryString = decodeQuery(currentLocation['search']);
//     const newQueryString = encodeQuery(produce(oldQueryString, updateFunc));
//
//     console.log(newQueryString);
// }
