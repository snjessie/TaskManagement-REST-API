const { sendJSON } = require('../../middleware/resFormatter');
const { readFile } = require('../fileHandler');
const { internalServerError, badRequest } = require('../errorHandler');

const getByStatus = async (req, res, extractedParams) => {
    try {
        const parsedData = await readFile();

        const statusList = ['pending', 'in-progress', 'completed'];

        const requestedStatus = extractedParams.status;
        // console.log(requestedStatus);

        const isValidStatus = statusList.includes(requestedStatus);

        if (!isValidStatus) {
            return badRequest(res, `Status must be one of: ${statusList.join(', ')}`);
        }

        const tasks = parsedData.tasks || [];

        const filteredBystatus = tasks.filter((task) => task.status === requestedStatus);
        console.log(`tell me about ${filteredBystatus}`);

        return sendJSON(res, 200, filteredBystatus);
    } catch (error) {
        return internalServerError(error);
    }
};

module.exports = getByStatus;
