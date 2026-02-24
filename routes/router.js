// dependencies
const parseRequest = require('../utils/parser');
const {
    getAllTasks,
    createTask,
    getByStatus,
    getTaskById,
    deleteTask,
} = require('../handlers/taskHandler');

const routes = [
    { method: 'GET', pattern: '/api/tasks', handler: getAllTasks },
    { method: 'POST', pattern: '/api/tasks', handler: createTask },
    { method: 'GET', pattern: '/api/tasks/status/:s', handler: getByStatus },
    { method: 'GET', pattern: '/api/tasks/:id', handler: getTaskById },
    { method: 'DELETE', pattern: '/api/tasks/:id', handler: deleteTask },
];

const router = {};

router.handleReqRes = (req, res) => {
    const { pathname, method, query } = parseRequest(req);
};

module.exports = router;
