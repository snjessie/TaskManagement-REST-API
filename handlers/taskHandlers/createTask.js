const crypto = require('crypto');
const { sendJSON } = require('../../middleware/resFormatter');
const { internalServerError, badRequest } = require('../errorHandler');
const { readFile, writeFile } = require('../fileHandler');
const validateTask = require('../../utils/validator');

const createTask = async (req, res) => {
    const { isValid, errors, sanitizedData } = validateTask(req.body);

    if (!isValid) {
        return badRequest(res, errors);
    }
    try {
        const fileData = await readFile();

        // Deleting made-up id of users
        delete sanitizedData.id;

        // Creating New Task
        const newTask = {
            id: crypto.randomUUID(),
            ...sanitizedData,

            status: sanitizedData.status ?? 'pending',
            priority: sanitizedData.priority ?? 'medium',
            tags: sanitizedData.tags ?? [],
            subtasks: sanitizedData.subtasks ?? [],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            dueDate: sanitizedData.dueDate ? new Date(sanitizedData.dueDate).toISOString() : null,
        };

        // Push data to the file
        fileData.tasks.push(newTask);

        // Write back to the file
        await writeFile(fileData);

        return sendJSON(res, 201, newTask);
    } catch (error) {
        return internalServerError(res);
    }
};

module.exports = createTask;
