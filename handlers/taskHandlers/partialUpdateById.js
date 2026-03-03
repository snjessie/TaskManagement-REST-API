const { readFile, writeFile } = require('../fileHandler');
const { sendJSON } = require('../../middleware/resFormatter');
const { internalServerError, badRequest, notFound } = require('../errorHandler');

const partialUpdateById = async (req, res, extractedParams) => {
    try {
        const requestedId = extractedParams.id;

        const fileData = await readFile();
        const tasks = fileData.tasks ?? [];

        const taskIndex = tasks.findIndex((task) => task.id === requestedId);

        if (taskIndex === -1) {
            return notFound(req, res, `Task with ID ${requestedId} not found`);
        }

        const existingTask = tasks[taskIndex];
        const updates = req.body ?? {};

        delete updates.id;
        delete updates.createdAt;

        const allowedStatuses = ['pending', 'in-progress', 'completed'];
        const allowedPriorities = ['low', 'medium', 'high'];

        const errors = [];

        if (updates.status && !allowedStatuses.includes(updates.status)) {
            errors.push({ error: 'Invalid status value' });
        }

        if (updates.priority && !allowedPriorities.includes(updates.priority)) {
            errors.push({ error: 'Invalid priority value' });
        }

        if (updates.dueDate) {
            const newDate = new Date(updates.dueDate);
            if (!isNaN(newDate.getTime())) {
                updates.dueDate = newDate;
            } else {
                updates.dueDate = existingTask.dueDate;
            }
        }

        if (errors.length > 0) {
            return badRequest(res, errors);
        }

        // console.log('Existing Task:', existingTask);
        // console.log('Incoming Updates:', updates);

        const patchedTask = {
            ...existingTask,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        tasks[taskIndex] = patchedTask;

        fileData.tasks = tasks;

        // Write back to the file
        await writeFile(fileData);

        return sendJSON(res, 200, patchedTask);
    } catch (error) {
        return internalServerError(res);
    }
};

module.exports = partialUpdateById;
