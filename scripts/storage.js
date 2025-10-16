const STORAGE_KEY = 'campusEvents';
const THEME_KEY = 'campusTheme';

export function loadEvents() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to load events:', error);
        return [];
    }
}

export function saveEvents(events) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        return true;
    } catch (error) {
        console.error('Failed to save events:', error);
        return false;
    }
}

export function loadTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

export function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

export function exportToJSON(events) {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campus_events_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

export function validateImportData(data) {
    if (!Array.isArray(data)) {
        return { valid: false, error: 'Data must be an array' };
    }

    for (let i = 0; i < data.length; i++) {
        const event = data[i];
        
        if (!event.id || typeof event.id !== 'string') {
            return { valid: false, error: `Event at index ${i} missing valid id` };
        }
        
        if (!event.title || typeof event.title !== 'string') {
            return { valid: false, error: `Event at index ${i} missing valid title` };
        }
        
        if (!event.date || typeof event.date !== 'string') {
            return { valid: false, error: `Event at index ${i} missing valid date` };
        }
        
        if (!event.duration || (typeof event.duration !== 'string' && typeof event.duration !== 'number')) {
            return { valid: false, error: `Event at index ${i} missing valid duration` };
        }
        
        if (!event.tag || typeof event.tag !== 'string') {
            return { valid: false, error: `Event at index ${i} missing valid tag` };
        }
    }

    return { valid: true };
}