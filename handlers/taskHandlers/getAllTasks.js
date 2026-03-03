const { sendJSON } = require('../../middleware/resFormatter');
const { readFile } = require('../fileHandler');
const { internalServerError } = require('../errorHandler');

const getAllTasks = async (req, res, _, query) => {
    try {
        const parsedData = await readFile();

        const safeQuery = query || {};
        let tasks = parsedData.tasks || [];

        //  FILTERING
        if (safeQuery.status) {
            tasks = tasks.filter((task) => task.status === safeQuery.status);
        }

        if (safeQuery.priority) {
            tasks = tasks.filter((task) => task.priority === safeQuery.priority);
        }

        //  SORTING
        if (safeQuery.sortBy) {
            const order = safeQuery.order === 'desc' ? -1 : 1;

            tasks.sort((a, b) => {
                let valA = a[safeQuery.sortBy];
                let valB = b[safeQuery.sortBy];

                // for priority logic
                if (safeQuery.sortBy === 'priority') {
                    const weights = { low: 1, medium: 2, high: 3 };
                    valA = weights[valA] || 0;
                    valB = weights[valB] || 0;
                }

                if (valA > valB) return order;
                if (valA < valB) return -order;
                return 0;
            });
        }

        // Pagination(page & limit)
        const page = parseInt(safeQuery.page, 10) || 1;
        const limit = parseInt(safeQuery.limit, 10) || 3;
        // Offset
        const startIndex = (page - 1) * limit;

        const paginatedTasks = tasks.slice(startIndex, startIndex + limit);
        return sendJSON(res, 200, paginatedTasks);
    } catch (error) {
        return internalServerError(res);
    }
};

module.exports = getAllTasks;
