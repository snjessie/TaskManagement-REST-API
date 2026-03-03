const fs = require('fs').promises;
const path = require('path');
const { notFound, internalServerError } = require('../errorHandler');

const { readFile, writeFile } = require('../fileHandler');

const deleteTask = async (req, res, extractedParams) => {
    try {
        const requestedId = extractedParams.id;
        console.log(`deleteTask page ${requestedId}`);
        const fileData = await readFile();
        const tasks = fileData.tasks ?? [];

        const taskExists = tasks.some((task) => task.id === requestedId);

        if (!taskExists) {
            return notFound(req, res, `Task with ID '${requestedId}' not found.`);
        }

        const deletedTaskToBeStored = tasks.find((task) => task.id === requestedId);

        const backupPath = path.join(
            __dirname,
            '../../data/backup',
            `tasks-${requestedId}-${Date.now()}.json`,
        );

        await fs.writeFile(backupPath, JSON.stringify(deletedTaskToBeStored, null, 2));

        fileData.tasks = tasks.filter((task) => task.id !== requestedId);

        // Write updated data back to the file
        await writeFile(fileData);

        res.writeHead(204);
        return res.end();
    } catch (error) {
        return internalServerError(res);
    }
};

module.exports = deleteTask;
