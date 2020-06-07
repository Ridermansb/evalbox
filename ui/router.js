import { pathToRegexp } from 'path-to-regexp';

function matchURI(path, uri) {
    const keys = [];
    const pattern = pathToRegexp(path, keys); // TODO: Use caching
    const match = pattern.exec(uri);
    if (!match) return null;
    const params = Object.create(null);
    for (let i = 1; i < match.length; i++) {
        params[keys[i - 1].name] =
            match[i] !== undefined ? match[i] : undefined;
    }
    return params;
}
async function resolve(routes, context) {
    if (context.error) {
        throw context.error;
    }

    const uri = context.pathname;
    for (const route of routes) {
        const params = matchURI(route.path, uri);
        if (!params) continue;
        const result = await route.action({ ...context, params });
        if (result) return result;
    }
    const error = new Error('Not found');
    error.status = 404;
    throw error;
}
export default { resolve };
