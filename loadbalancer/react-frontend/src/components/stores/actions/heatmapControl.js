import { modifyQueryString } from 'components/stores/actions/routing';
import { decode as decodeQuery } from 'querystring';

const HEATMAP_CLUSTER_PDS = 'clusterpds';
const HEATMAP_NOCLUSTER_PROTEINS = 'noclusterproteins';
const HEATMAP_ANNOTATION_TYPE = 'annotationType';

const VALID_ANNOTATION_TYPES = new Set(['complex', 'domain']);

export function parseControlsFromSearch(search) {
    let validatedSearch = search;

    if (validatedSearch.startsWith('?')) {
        validatedSearch = validatedSearch.slice(1);
    }
    const decodedSearch = decodeQuery(validatedSearch);

    const ans = {};

    const clusterPDs = decodedSearch[HEATMAP_CLUSTER_PDS];

    if (clusterPDs !== undefined) {
        ans.clusterPDs = clusterPDs === 'true';
    }

    const noclusterProteins = decodedSearch[HEATMAP_NOCLUSTER_PROTEINS];
    ans.clusterProteins = noclusterProteins === undefined;

    let annotationType = decodedSearch[HEATMAP_ANNOTATION_TYPE];

    if (annotationType !== undefined) {
        annotationType = annotationType.toLowerCase();
        if (VALID_ANNOTATION_TYPES.has(annotationType)) {
            ans.annotationType = annotationType;
        }
    }

    return ans;
}

export function setClusterPds(value) {
    return modifyQueryString((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[HEATMAP_CLUSTER_PDS] = value;
    });
}


export function setAnnotationType(annotationType) {
    return modifyQueryString((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[HEATMAP_ANNOTATION_TYPE] = annotationType.toLowerCase();
    });
}
