const { sendJSON } = require('../../middleware/resFormatter');
const { readFile } = require('../fileHandler');
const { internalServerError } = require('../errorHandler');

const getTaskByStats = async (req, res) => {
    try {
        const parsedData = await readFile();
        const allTasks = parsedData.tasks || [];
        const totalTasks = allTasks.length;
        const now = new Date();

        const stats = allTasks.reduce(
            (acc, task) => {
                // Counts by status
                acc.statusCounts[task.status] = (acc.statusCounts[task.status] ?? 0) + 1;

                // Counts by priority
                acc.priorityCounts[task.priority] = (acc.priorityCounts[task.priority] ?? 0) + 1;

                // Overdue Tasks
                if (task.status !== 'completed' && task.dueDate) {
                    const dueDate = new Date(task.dueDate);
                    if (dueDate < now) {
                        acc.overdueCount += 1;
                    }
                }

                return acc;
            },
            {
                statusCounts: {},
                priorityCounts: {},
                overdueCount: 0,
            },
        );

        // Calculate completion Percentage
        const completedCount = stats.statusCounts.completed ?? 0;

        const completionPercentage =            totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

        const finalStats = {
            totalTasks,
            statusCounts: stats.statusCounts,
            priorityCounts: stats.priorityCounts,
            overdueCount: stats.overdueCount,
            completionPercentage: `${completionPercentage}%`,
        };

        return sendJSON(res, 200, finalStats);
    } catch (errror) {
        return internalServerError(res);
    }
};

module.exports = getTaskByStats;
