export function compileRegex(pattern, flags = 'i') {
    try {
        return pattern ? new RegExp(pattern, flags) : null;
    } catch (error) {
        console.warn('Invalid regex pattern:', error);
        return null;
    }
}

export function highlightMatches(text, regex) {
    if (!regex || !text) {
        return escapeHtml(text);
    }
    
    try {
        const parts = text.split(regex);
        const matches = text.match(regex) || [];
        
        let result = '';
        for (let i = 0; i < parts.length; i++) {
            result += escapeHtml(parts[i]);
            if (matches[i]) {
                result += `<mark class="highlight">${escapeHtml(matches[i])}</mark>`;
            }
        }
        return result;
    } catch (error) {
        return escapeHtml(text);
    }
}

export function searchEvents(events, query) {
    if (!query || !query.trim()) {
        return events;
    }
    
    const regex = compileRegex(query);
    
    if (!regex) {
        const lowerQuery = query.toLowerCase();
        return events.filter(event => 
            event.title.toLowerCase().includes(lowerQuery) ||
            event.tag.toLowerCase().includes(lowerQuery) ||
            (event.description && event.description.toLowerCase().includes(lowerQuery))
        );
    }
    
    return events.filter(event => 
        regex.test(event.title) ||
        regex.test(event.tag) ||
        (event.description && regex.test(event.description))
    );
}

export function filterByTag(events, tag) {
    if (tag === 'all') {
        return events;
    }
    return events.filter(event => event.tag.toLowerCase() === tag.toLowerCase());
}

export function sortEvents(events, sortBy) {
    const sorted = [...events];
    
    switch (sortBy) {
        case 'date':
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'duration':
            sorted.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
            break;
        default:
            break;
    }
    
    return sorted;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}