import { modifyQueryString } from 'components/stores/actions/routing';
// eslint-disable-next-line import/no-unresolved
import { PULL_DOWNS } from 'data/pull_downs';
import { decode as decodeQuery } from 'querystring';
import {DEFAULT_PD_ORDER} from "../../../../data/pdorder";

export const PULL_DOWN_DESELECT_QUERY_KEY = 'nopd';
export const PULL_DOWN_SELECT_QUERY_KEY = 'pd';
export const PULL_DOWN_CUSTOM_ORDER_KEY = 'pdorder';

const PATH_PREFERS_EMPTY = {
    '/pds': true,
    '/heatmap': false,
};

export function changeSelection(keys) {
    const PD_KEYS = Object.keys(PULL_DOWNS);

    const n = PD_KEYS.length;

    const positives = keys.length;
    const negatives = n - positives;

    if (positives <= negatives) {
        return modifyQueryString((draft) => {
            // eslint-disable-next-line no-param-reassign
            delete draft[PULL_DOWN_DESELECT_QUERY_KEY];
            // eslint-disable-next-line no-param-reassign
            draft[PULL_DOWN_SELECT_QUERY_KEY] = keys;
        });
        // eslint-disable-next-line no-else-return
    } else {
        const negativeKeys = PD_KEYS.filter(key => !keys.includes(key));
        return modifyQueryString((draft) => {
            // eslint-disable-next-line no-param-reassign
            draft[PULL_DOWN_DESELECT_QUERY_KEY] = negativeKeys;
            // eslint-disable-next-line no-param-reassign
            delete draft[PULL_DOWN_SELECT_QUERY_KEY];
        });
    }
}

export function togglePullDown(currentSelection, key) {
    if (currentSelection.includes(key)) {
        const ans = currentSelection.filter(k => k !== key);
        return changeSelection(ans);
    }

    const ans = [...currentSelection];
    ans.push(key);
    return changeSelection(ans);
}
export function parseOrder(search) {
    let validatedSearch = search;

    if (validatedSearch.startsWith('?')) {
        validatedSearch = validatedSearch.slice(1);
    }
    const decodedSearch = decodeQuery(validatedSearch);
    const customOrder = decodedSearch[PULL_DOWN_CUSTOM_ORDER_KEY];

    if (customOrder === undefined) {
        return DEFAULT_PD_ORDER;
    }
    const ans = customOrder.split(',').filter(x => DEFAULT_PD_ORDER.includes(x));

    console.info('Using non-default order of Pull-Downs, something might break');
    console.log(ans);
    return ans;

}

export function parseSelection(search, pathname, order) {
    let validatedSearch = search;

    let emptyIsAll = !PATH_PREFERS_EMPTY[pathname];
    if (emptyIsAll === undefined) emptyIsAll = false;

    if (validatedSearch.startsWith('?')) {
        validatedSearch = validatedSearch.slice(1);
    }
    const decodedSearch = decodeQuery(validatedSearch);

    let keysPositive = decodedSearch[PULL_DOWN_SELECT_QUERY_KEY];
    let keysNegative = decodedSearch[PULL_DOWN_DESELECT_QUERY_KEY];

    if (keysPositive === undefined) {
        keysPositive = new Set();
    } else if (!Array.isArray(keysPositive)) {
        keysPositive = new Set([keysPositive]);
    } else {
        keysPositive = new Set(keysPositive);
    }

    if (keysNegative === undefined) {
        keysNegative = new Set();
    } else if (!Array.isArray(keysNegative)) {
        keysNegative = new Set([keysNegative]);
    } else {
        keysNegative = new Set(keysNegative);
    }

    let ans = [];

    if (keysPositive.size > 0) {
        ans = order.filter(key => keysPositive.has(key));
    } else if (keysNegative.size > 0) {
        ans = order.filter(key => !keysNegative.has(key));
    }

    if (ans.length === 0) {
        if (emptyIsAll) return Array.from(order);
        return [];
    }
    return ans;
}
