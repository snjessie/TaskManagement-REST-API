const fs = require('fs');
const path = require('path');
const { sendJSON } = require('../../middleware/resFormatter');
const { internalServerError } = require('../errorHandler');

const getAllTasks = (req, res, _, query) => {
    const filePath = path.join(__dirname, '../../data/tasks.json');

    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        // If file doesn't exist
        if (err) {
            if (err.code === 'ENOENT') {
                const initialData = {
                    version: '1.0',
                    lastUpdated: new Date().toISOString(),
                    tasks: [],
                };
                fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
                return sendJSON(res, 200, []);
            }
            // console.error(err);
            return internalServerError(res);
        }

        let parsedData;

        try {
            parsedData = JSON.parse(fileData);
        } catch (parseError) {
            // console.error(parseError);
            return internalServerError(res);
        }

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
        const startIndex = (page - 1) * limit;

        const paginatedTasks = tasks.slice(startIndex, startIndex + 3);
        return sendJSON(res, 200, paginatedTasks);
    });
};

module.exports = getAllTasks;
