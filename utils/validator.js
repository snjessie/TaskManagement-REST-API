const validateTask = (data) => {
    const errors = [];
    const statusList = ['pending', 'in-progress', 'completed'];
    const priorityList = ['low', 'medium', 'high'];

    // Required Fields and Sanitization
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
        errors.push('Title is required and must be a non-empty string.');
    } else {
        data.title = data.title.trim();
    }

    if (
        !data.description
        || typeof data.description !== 'string'
        || data.description.trim() === ''
    ) {
        errors.push('Description is required and must be a non-empty string');
    } else {
        data.description = data.description.trim();
    }

    // Enum Validation
    if (data.status && !statusList.includes(data.status)) {
        errors.push(`Status must be one of: ${statusList.join(', ')}`);
    }

    if (data.priority && !priorityList.includes(data.priority)) {
        errors.push(`Priority must be one of: ${priorityList.join(', ')}`);
    }

    // Type checks(Arrays)
    if (data.tags !== undefined && !Array.isArray(data.tags)) {
        errors.push('Tags must be an array of strings');
    }

    if (data.subtasks !== undefined) {
        if (
            !Array.isArray(data.subtasks)
            || (data.subtasks.length > 0 && typeof data.subtasks[0] !== 'object')
        ) {
            errors.push('Subtasks must be an array of objects.');
        }
    }

    // Date Validation
    if (data.dueDate) {
        const date = new Date(data.dueDate);
        if (isNaN(date.getTime())) {
            errors.push('dueDate must be a valid ISO data string.');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitizedData: data,
    };
};

module.exports = validateTask;
