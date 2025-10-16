export const ValidationRules = {
    title: {
        pattern: /^\S(?:.*\S)?$/,
        message: 'Title cannot have leading or trailing spaces',
        test: (value) => {
            if (!value || !value.trim()) {
                return 'Title is required';
            }
            if (!ValidationRules.title.pattern.test(value)) {
                return ValidationRules.title.message;
            }
            return '';
        }
    },
    
    date: {
        pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        message: 'Date must be in YYYY-MM-DD format',
        test: (value) => {
            if (!value) {
                return 'Date is required';
            }
            if (!ValidationRules.date.pattern.test(value)) {
                return ValidationRules.date.message;
            }
            
            const [year, month, day] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
                return 'Invalid date';
            }
            return '';
        }
    },
    
    duration: {
        pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
        message: 'Duration must be a valid number (e.g., 2.5)',
        test: (value) => {
            if (!value) {
                return 'Duration is required';
            }
            if (!ValidationRules.duration.pattern.test(value)) {
                return ValidationRules.duration.message;
            }
            const num = parseFloat(value);
            if (num < 0 || num > 24) {
                return 'Duration must be between 0 and 24 hours';
            }
            return '';
        }
    },
    
    tag: {
        pattern: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
        message: 'Tag must contain only letters, spaces, or hyphens',
        test: (value) => {
            if (!value || !value.trim()) {
                return 'Tag is required';
            }
            if (!ValidationRules.tag.pattern.test(value)) {
                return ValidationRules.tag.message;
            }
            return '';
        }
    },
    
    description: {
        pattern: /\b(\w+)\s+\1\b/i,
        message: 'Description contains duplicate consecutive words',
        test: (value) => {
            if (!value) {
                return '';
            }
            if (ValidationRules.description.pattern.test(value)) {
                return ValidationRules.description.message;
            }
            return '';
        }
    }
};

export function validateField(fieldName, value) {
    const rule = ValidationRules[fieldName];
    if (!rule) {
        return '';
    }
    return rule.test(value);
}

export function validateForm(formData) {
    const errors = {};
    
    Object.keys(formData).forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) {
            errors[field] = error;
        }
    });
    
    return errors;
}

export function displayErrors(errors) {
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`error-${field}`);
        const inputElement = document.getElementById(`event-${field}`);
        
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
        if (inputElement) {
            inputElement.classList.add('error');
        }
    });
}

export function clearErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    const inputElements = document.querySelectorAll('.form-group input, .form-group textarea');
    
    errorElements.forEach(el => {
        el.textContent = '';
    });
    
    inputElements.forEach(el => {
        el.classList.remove('error');
    });
}