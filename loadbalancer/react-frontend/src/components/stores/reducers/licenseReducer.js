import { LOCATION_CHANGE } from 'connected-react-router';
import { parseControlsFromSearch } from 'components/stores/actions/scatterplotControl';
import { ACCEPT_LICENSE_ACTION } from 'components/stores/actions/licenseActions';
 

const DEFAULT_STATE = {
    acceptedLicense: false,
};



export default function licenseReducer(state = DEFAULT_STATE, action) {
    if (action.type === ACCEPT_LICENSE_ACTION) {
        const newState = {
            acceptedLicense: true,
        }

        return { ...state, ...newState };
    }
    return state;
}
