import { LOCATION_CHANGE } from 'connected-react-router';
import {parseOrder, parseSelection} from 'components/stores/actions/pullDownSelect';

import produce from 'immer';
import { DEFAULT_PD_ORDER } from 'data/pdorder';

export default function pullDownSelectReducer(state = { selection: [], order: DEFAULT_PD_ORDER }, action) {
    if (action.type === LOCATION_CHANGE) {
        const { search, pathname } = action.payload.location;

        const order = parseOrder(search);
        const selection = parseSelection(search, pathname, order);

        return produce(state, (draft) => {
            // eslint-disable-next-line no-param-reassign
            draft.selection = selection;
            // eslint-disable-next-line no-param-reassign
            draft.order = order;
        });
    }
    return state;
}
