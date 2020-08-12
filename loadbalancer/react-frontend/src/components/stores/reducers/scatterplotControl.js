import { LOCATION_CHANGE } from 'connected-react-router';
import { parseControlsFromSearch } from 'components/stores/actions/scatterplotControl';

export default function heatmapControlReducer(state = { showImputed: false }, action) {
    if (action.type === LOCATION_CHANGE) {
        const { search } = action.payload.location;
        const controls = parseControlsFromSearch(search);

        if (Object.keys(controls).length === 0) return state;

        return { ...state, ...controls };
    }
    return state;
}
