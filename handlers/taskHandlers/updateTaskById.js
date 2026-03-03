const { readFile, writeFile } = require('../fileHandler');
const validateTask = require('../../utils/validator');
const { sendJSON } = require('../../middleware/resFormatter');
const { internalServerError, badRequest, notFound } = require('../errorHandler');

const updateTaskById = async (req, res, extractedParams) => {
    console.log(extractedParams);
    const requestedId = extractedParams.id;

    const { isValid, errors, sanitizedData } = validateTask(req.body);

    if (!isValid) {
        return badRequest(res, errors);
    }

    try {
        const fileData = await readFile();
        const tasks = fileData.tasks ?? [];

        const taskIndex = tasks.findIndex((task) => task.id === requestedId);

        if (taskIndex === -1) {
            return notFound(req, res, `Task with ID ${requestedId} not found`);
        }

        const updatedTask = {
            id: requestedId,
            ...sanitizedData,

            status: sanitizedData.status ?? 'pending',
            priority: sanitizedData.priority ?? 'medium',
            tags: sanitizedData.tags ?? [],
            subtasks: sanitizedData.subtasks ?? [],

            dueDate: sanitizedData.dueDate ? new Date(sanitizedData.dueDate).toISOString() : null,

            createdAt: tasks[taskIndex].createdAt,

            updatedAt: new Date().toISOString(),
        };

        fileData.tasks[taskIndex] = updatedTask;

        // Write back to the file
        await writeFile(fileData);

        return sendJSON(res, 200, updatedTask);
    } catch (error) {
        return internalServerError(res);
    }
};

module.exports = updateTaskById;
