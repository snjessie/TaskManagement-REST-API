/* eslint-disable prefer-const */
// dependencies
const { parseRequest, parseBody } = require('../utils/parser');
const getAllTasks = require('../handlers/taskHandlers/getAllTasks');
const createTask = require('../handlers/taskHandlers/createTask');
const getByStatus = require('../handlers/taskHandlers/getByStatus');
const getTaskById = require('../handlers/taskHandlers/getTaskById');
const getTaskByStats = require('../handlers/taskHandlers/getTaskByStats');
const updateTaskById = require('../handlers/taskHandlers/updateTaskById');
const partialUpdateById = require('../handlers/taskHandlers/partialUpdateById');
const deleteTask = require('../handlers/taskHandlers/deleteTask');

const { notFound, badRequest, internalServerError } = require('../handlers/errorHandler');

const routes = [
    { method: 'GET', pattern: '/api/tasks', handler: getAllTasks },
    { method: 'POST', pattern: '/api/tasks', handler: createTask },
    { method: 'GET', pattern: '/api/tasks/status/:status', handler: getByStatus },
    { method: 'GET', pattern: '/api/tasks/:id', handler: getTaskById },
    { method: 'GET', pattern: '/api/stats', handler: getTaskByStats },
    { method: 'PUT', pattern: '/api/tasks/:id', handler: updateTaskById },
    { method: 'PATCH', pattern: '/api/tasks/:id', handler: partialUpdateById },
    { method: 'DELETE', pattern: '/api/tasks/:id', handler: deleteTask },
];

const router = {};

// Path resolver
const matchRoute = (pattern, pathname) => {
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');

    if (patternParts.length !== pathParts.length) {
        return null;
    }

    const params = {};

    for (let i = 0; i < patternParts.length; i += 1) {
        if (patternParts[i].startsWith(':')) {
            const key = patternParts[i].slice(1);
            params[key] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
            return null;
        }
    }
    return params;
};

router.handleReqRes = async (req, res) => {
    const { pathname, method, query } = parseRequest(req);

    let extractedParams = {};

    const matchedRoute = routes.find((route) => {
        if (route.method !== method) {
            return false;
        }

        const params = matchRoute(route.pattern, pathname);

        if (params !== null) {
            extractedParams = params;
            return true;
        }
        return false;
    });

    if (!matchedRoute) {
        return notFound(req, res);
    }

    // Parse body when required
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
            req.body = await parseBody(req);
        } catch (err) {
            return badRequest(res, { error: err.message });
        }
    } else {
        req.body = {};
    }

    try {
        await matchedRoute.handler(req, res, extractedParams, query);
    } catch (err) {
        return internalServerError(res);
    }
};

module.exports = router;
