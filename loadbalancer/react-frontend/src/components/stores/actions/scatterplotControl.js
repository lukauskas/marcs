import { modifyQueryString } from 'components/stores/actions/routing';
import { decode as decodeQuery } from 'querystring';

export const SCATTERPLOT_SHOW_IMPUTED = 'imputed';

export function parseControlsFromSearch(search) {
    let validatedSearch = search;

    if (validatedSearch.startsWith('?')) {
        validatedSearch = validatedSearch.slice(1);
    }
    const decodedSearch = decodeQuery(validatedSearch);

    const ans = {};

    const showImputed = decodedSearch[SCATTERPLOT_SHOW_IMPUTED];

    if (showImputed !== undefined) {
        ans.showImputed = showImputed === 'true';
    }

    return ans;
}

export function setShowImputed(value) {
    return modifyQueryString((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[SCATTERPLOT_SHOW_IMPUTED] = value;
    });
}
