import { modifyQueryString } from 'components/stores/actions/routing';
import { decode as decodeQuery } from 'querystring';
import { PTM_PREDICTOR_ORDER } from 'data/ptms';

const NETWORK_COLORS = 'networkcolors';
const VALID_COLORS = new Set(['communities', ...PTM_PREDICTOR_ORDER]);

export function parseControlsFromSearch(search) {
    let validatedSearch = search;

    if (validatedSearch.startsWith('?')) {
        validatedSearch = validatedSearch.slice(1);
    }
    const decodedSearch = decodeQuery(validatedSearch);

    const ans = {};

    const networkColor = decodedSearch[NETWORK_COLORS];

    if ((networkColor !== undefined) && (VALID_COLORS.has(networkColor))) {
        ans.networkColor = networkColor;
    }

    return ans;
}

export function changeNetworkColor(newColor) {
    return modifyQueryString((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[NETWORK_COLORS] = newColor;
    });
}
