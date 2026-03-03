const { sendJSON } = require('../../middleware/resFormatter');
const { readFile } = require('../fileHandler');
const { internalServerError, notFound } = require('../errorHandler');

const getTaskById = async (req, res, extractedParams, _) => {
    try {
        const parsedData = await readFile();

        const requestedId = extractedParams.id;
        // console.log(requestedId);

        const tasks = parsedData.tasks || [];

        const filteredById = tasks.find((task) => task.id === requestedId);

        if (!filteredById) {
            return notFound(req, res, `This ${requestedId} id is Not Found`);
        }

        return sendJSON(res, 200, filteredById);
    } catch (error) {
        return internalServerError(res);
    }
};

module.exports = getTaskById;
