import { modifyQueryString, redirect } from 'components/stores/actions/routing';

export const GENE_SELECT_QUERY_KEY = 'k';
export const SHOW_SIMILAR_QUERY_KEY = 'showsimilar';

export function changeSelection(keys) {
    return modifyQueryString((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[GENE_SELECT_QUERY_KEY] = keys;
    });
}

export function setShowSimilar(value) {
    return modifyQueryString((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[SHOW_SIMILAR_QUERY_KEY] = value;
    });
}

export function redirectToHeatmap(selectedKeys, showSimilar) {
    const queryString = {};
    queryString[GENE_SELECT_QUERY_KEY] = selectedKeys;
    queryString[SHOW_SIMILAR_QUERY_KEY] = showSimilar;
    const pathName = '/proteins';
    return redirect(pathName, queryString);
}