import { MATOMO_DISABLED } from "data/matomo";
import {MATOMO_DEBUG} from "../../../data/matomo";

export function isMatomoDisabled() {
    // eslint-disable-next-line eqeqeq
    return String(MATOMO_DISABLED).toLowerCase() == 'true';
}

export function isMatomoDebugOn() {
    // eslint-disable-next-line eqeqeq
    return String(MATOMO_DEBUG).toLowerCase() == 'true';
}