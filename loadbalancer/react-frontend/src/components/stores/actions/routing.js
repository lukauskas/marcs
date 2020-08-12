export const MODIFY_QUERY_STRING = 'MODIFY_QUERY_STRING';
export const REDIRECT = 'REDIRECT';

export function modifyQueryString(template) {
    return {
        type: MODIFY_QUERY_STRING,
        template,
    };
}

export function redirect(pathName, queryString) {
    return {
        type: REDIRECT,
        pathName,
        queryString,
    };
}


