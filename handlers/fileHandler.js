const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/tasks.json');

const readFile = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');

        return data ? JSON.parse(data) : { tasks: [], lastUpdated: new Date().toISOString() };
    } catch (error) {
        // If file doesn't exist
        if (error.code === 'ENOENT') {
            return { tasks: [], lastUpdated: new Date().toISOString() };
        }
        throw error;
    }
};

const writeFile = async (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf-8');
};

module.exports = { readFile, writeFile };
