// State
// [selected_gene_keys]
// [selected_proteins]

// eslint-disable-next-line import/no-unresolved
import { GENE_SELECTOR_OPTIONS } from 'data/gene_options';
import { LOCATION_CHANGE } from 'connected-react-router';
import { decode as decodeQuery } from 'querystring';
import { GENE_SELECT_QUERY_KEY, SHOW_SIMILAR_QUERY_KEY } from 'components/stores/actions/geneSelect';

import produce from 'immer';

const PATH_DEFAULTS_ON_SHOW_SIMILAR = {
    '/pds': false,
    '/proteins': true,
    '/network': false,
};


export default function geneSelectReducer(state = {
    selected_gene_keys: [],
    selected_proteins: [],
    similar_proteins: [],
    show_similar: true,
}, action) {
    if (action.type === LOCATION_CHANGE) {
        let { search, pathname } = action.payload.location;
        if (search.startsWith('?')) {
            search = search.slice(1);
        }

        const decodedQuery = decodeQuery(search);

        let keys = decodedQuery[GENE_SELECT_QUERY_KEY];

        if (keys === undefined) {
            keys = [];
        } else if (!Array.isArray(keys)) {
            keys = [keys];
        }

        const showSimilar = decodedQuery[SHOW_SIMILAR_QUERY_KEY];

        return produce(state, (draft) => {
            const uniqueKeys = [];
            const keySet = new Set();

            const sps = new Set();
            let similar = new Set();

            keys.forEach((key) => {
                if (keySet.has(key)) return;
                const option = GENE_SELECTOR_OPTIONS[key];
                keySet.add(key);

                if (option === undefined) {
                    // eslint-disable-next-line no-console
                    console.warn(`Invalid key ${key}, skipping`);
                    return;
                }

                option.proteins.forEach(x => sps.add(x));
                option.similar_proteins.forEach(x => similar.add(x));

                uniqueKeys.push(key);
            });

            similar = [...similar].filter(x => !sps.has(x)).sort();

            // eslint-disable-next-line no-param-reassign
            draft.selected_gene_keys = uniqueKeys;
            // eslint-disable-next-line no-param-reassign
            draft.selected_proteins = Array.from(sps).sort();
            // eslint-disable-next-line no-param-reassign
            draft.similar_proteins = similar;

            if (showSimilar !== undefined) {
                // eslint-disable-next-line no-param-reassign
                draft.show_similar = (showSimilar === 'true');
            } else {
                let defaultShowSimilar = PATH_DEFAULTS_ON_SHOW_SIMILAR[pathname];
                if (defaultShowSimilar === undefined) defaultShowSimilar = false;
                // eslint-disable-next-line no-param-reassign
                draft.show_similar = defaultShowSimilar;
            }
        });
    }
    return state;
}
