const { sendJSON } = require('../../middleware/resFormatter');
const { readFile } = require('../fileHandler');
const { internalServerError, badRequest } = require('../errorHandler');

const getSearchedTasks = async (req, res, _, query) => {
    if (query.q === undefined) {
        return badRequest(
            res,
            "Search query parameter 'q' is required. Example: /api/search?q=task",
        );
    }
    try {
        const parsedData = await readFile();
        const tasks = parsedData.tasks || [];

        const searchTerm = (query.q || '').trim().toLowerCase();

        if (!searchTerm) {
            return sendJSON(res, 200, tasks);
        }

        const filteredResults = tasks.filter((task) => {
            const title = (task.title || '').toLowerCase();
            const description = (task.description || '').toLowerCase();

            return title.includes(searchTerm) || description.includes(searchTerm);
        });

        return sendJSON(res, 200, filteredResults);
    } catch (error) {
        return internalServerError(res);
    }
};

module.exports = getSearchedTasks;
