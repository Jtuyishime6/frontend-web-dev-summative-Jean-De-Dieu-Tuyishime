import { state } from './state.js';
import { compileRegex, highlightMatches } from './search.js';

export function updateStats() {
    const stats = state.getStats();
    
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-completed').textContent = stats.completed;
    document.getElementById('stat-hours').textContent = `${stats.totalHours}h`;
    document.getElementById('stat-top-tag').textContent = stats.topTag;
    document.getElementById('stat-recent').textContent = stats.recentEvents;
}

export function updateTagFilter() {
    const filterSelect = document.getElementById('filter-tag');
    const currentValue = filterSelect.value;
    const tags = state.getUniqueTags();
    
    filterSelect.innerHTML = '<option value="all">All Categories</option>';
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        filterSelect.appendChild(option);
    });
    
    if (tags.includes(currentValue)) {
        filterSelect.value = currentValue;
    }
}

export function renderEvents(events, searchQuery = '') {
    const container = document.getElementById('events-container');
    const emptyState = document.getElementById('empty-state');
    
    if (events.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    const regex = compileRegex(searchQuery);
    
    container.innerHTML = events.map(event => createEventCard(event, regex)).join('');
}

function createEventCard(event, regex) {
    const completedClass = event.completed ? 'completed' : '';
    const checkIcon = event.completed
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
        : '<circle cx="12" cy="12" r="10"></circle>';
    
    return `
        <div class="event-card ${completedClass}">
            <div class="event-header">
                <button class="complete-btn" data-id="${event.id}" aria-label="${event.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${checkIcon}
                    </svg>
                </button>
                <h3 class="event-title">${highlightMatches(event.title, regex)}</h3>
            </div>
            
            <div class="event-meta">
                <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${event.date}</span>
                </div>
                <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${event.duration}h</span>
                </div>
                <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    <span class="tag-badge">${highlightMatches(event.tag, regex)}</span>
                </div>
            </div>
            
            ${event.description ? `<p class="event-description">${highlightMatches(event.description, regex)}</p>` : ''}
            
            <div class="event-actions">
                <button class="icon-btn edit-btn" data-id="${event.id}" aria-label="Edit event">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="icon-btn danger delete-btn" data-id="${event.id}" aria-label="Delete event">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

export function showModal(isEdit = false) {
    const modal = document.getElementById('event-modal');
    const title = document.getElementById('modal-title');
    const submitText = document.getElementById('submit-text');
    
    title.textContent = isEdit ? 'Edit Event' : 'New Event';
    submitText.textContent = isEdit ? 'Update Event' : 'Create Event';
    
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('event-title').focus();
    document.body.style.overflow = 'hidden';
}

export function hideModal() {
    const modal = document.getElementById('event-modal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.clearEditingEvent();
}

export function populateForm(event) {
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-duration').value = event.duration;
    document.getElementById('event-tag').value = event.tag;
    document.getElementById('event-description').value = event.description || '';
}

export function clearForm() {
    document.getElementById('event-form').reset();
}

export function showStatus(message, type = 'success') {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = 'status-message';
    
    if (type === 'error') {
        statusEl.style.background = '#e74c3c';
    } else {
        statusEl.style.background = '#2ecc71';
    }
    
    statusEl.classList.remove('hidden');
    statusEl.innerHTML = `
        ${message}
        <button class="status-close" aria-label="Close notification">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    const closeBtn = statusEl.querySelector('.status-close');
    closeBtn.addEventListener('click', () => hideStatus());
    
    setTimeout(() => {
        hideStatus();
    }, 5000);
}

export function hideStatus() {
    const statusEl = document.getElementById('status-message');
    statusEl.classList.add('hidden');
}