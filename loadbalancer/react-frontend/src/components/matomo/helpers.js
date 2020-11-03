import { MATOMO_DISABLED } from "data/matomo";

export function isMatomoDisabled() {
    // eslint-disable-next-line eqeqeq
    return String(MATOMO_DISABLED).toLowerCase() == 'true';
}