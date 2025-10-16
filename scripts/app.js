import { state } from './state.js';
import { loadEvents, loadTheme, saveTheme, exportToJSON, validateImportData } from './storage.js';
import { validateForm, clearErrors, displayErrors } from './validators.js';
import { searchEvents, filterByTag, sortEvents } from './search.js';
import { updateStats, updateTagFilter, renderEvents, showModal, hideModal, populateForm, clearForm, showStatus } from './ui.js';

let currentSearchQuery = '';
let currentFilterTag = 'all';
let currentSort = 'date';

function init() {
    const savedEvents = loadEvents();
    state.setEvents(savedEvents);
    
    const savedTheme = loadTheme();
    applyTheme(savedTheme);
    
    state.subscribe(() => {
        updateUI();
    });
    
    setupEventListeners();
    updateUI();
}

function applyTheme(theme) {
    document.body.className = `${theme}-theme`;
    saveTheme(theme);
}

function toggleTheme() {
    const currentTheme = document.body.className.includes('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    updateUI(); // Updates the theme display in settings
}

/**
 * Toggles visibility between the main planner, about section, and settings section.
 * @param {string} sectionId - The ID of the section to show ('planner', 'about-section', or 'settings-section').
 */
function toggleView(sectionId) {
    const eventManagerContent = document.getElementById('event-manager-content');
    const aboutSection = document.getElementById('about-section');
    const settingsSection = document.getElementById('settings-section');
    
    // An array of all non-planner sections
    const secondarySections = [aboutSection, settingsSection];
    // Close modal if open
    if (!document.getElementById('event-modal').classList.contains('hidden')) {
        hideModal();
    }

    // 1. Hide all secondary sections first
    secondarySections.forEach(sec => sec.classList.add('hidden'));

    if (sectionId === 'planner') {
        // 2. Show Planner
        eventManagerContent.classList.remove('hidden');
    } else {
        // 2. Hide Planner
        eventManagerContent.classList.add('hidden');
        
        // 3. Show the requested secondary section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    }
}

// Function to toggle between Planner and About View
function toggleAboutView() {
    // If the planner is visible, show About. Otherwise, show Planner.
    const isPlannerVisible = !document.getElementById('event-manager-content').classList.contains('hidden');
    toggleView(isPlannerVisible ? 'about-section' : 'planner');
}

// Function to toggle between Planner and Settings View (Attached to Settings Icon)
function toggleSettingsView() {
    // If the planner is visible, show Settings. Otherwise, show Planner.
    const isPlannerVisible = !document.getElementById('event-manager-content').classList.contains('hidden');
    toggleView(isPlannerVisible ? 'settings-section' : 'planner');
}
// END VIEW FUNCTIONS

function setupEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // About Page Listeners
    document.getElementById('about-btn').addEventListener('click', toggleAboutView);
    document.getElementById('back-to-planner-btn').addEventListener('click', toggleAboutView);
    
    // Settings Page Listeners
    document.getElementById('settings-btn').addEventListener('click', toggleSettingsView);
    document.getElementById('back-to-planner-from-settings-btn').addEventListener('click', toggleSettingsView);

    // New element to trigger import from settings view
    document.getElementById('settings-import-btn').addEventListener('click', () => {
        document.getElementById('import-file-settings').click();
    });
    
    // Reuse existing functions for buttons inside settings
    document.getElementById('settings-theme-toggle-btn').addEventListener('click', toggleTheme);
    document.getElementById('settings-export-btn').addEventListener('click', handleExport);
    
    document.getElementById('new-event-btn').addEventListener('click', () => {
        clearForm();
        clearErrors();
        showModal(false);
    });
    
    document.getElementById('modal-close').addEventListener('click', hideModal);
    document.getElementById('cancel-btn').addEventListener('click', hideModal);
    
    document.getElementById('event-modal').addEventListener('click', (e) => {
        if (e.target.id === 'event-modal') {
            hideModal();
        }
    });
    
    document.getElementById('event-form').addEventListener('submit', handleFormSubmit);
    
    document.getElementById('search-input').addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        updateUI();
    });
    
    document.getElementById('filter-tag').addEventListener('change', (e) => {
        currentFilterTag = e.target.value;
        updateUI();
    });
    
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        updateUI();
    });
    
    // Main Export/Import Handlers
    document.getElementById('export-btn').addEventListener('click', handleExport);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    
    // Handle both import file inputs
    document.getElementById('import-file').addEventListener('change', handleImport);
    document.getElementById('import-file-settings').addEventListener('change', handleImport);
    
    document.getElementById('events-container').addEventListener('click', handleEventActions);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !document.getElementById('event-modal').classList.contains('hidden')) {
            hideModal();
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();
    
    const formData = {
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        duration: document.getElementById('event-duration').value,
        tag: document.getElementById('event-tag').value,
        description: document.getElementById('event-description').value
    };
    
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        showStatus('Please fix validation errors', 'error');
        return;
    }
    
    const editingEvent = state.getEditingEvent();
    
    if (editingEvent) {
        state.updateEvent(editingEvent.id, formData);
        showStatus('Event updated successfully');
    } else {
        state.addEvent(formData);
        showStatus('Event created successfully');
    }
    
    hideModal();
    clearForm();
}

function handleEventActions(e) {
    const target = e.target.closest('button');
    if (!target) return;
    
    const eventId = target.dataset.id;
    if (!eventId) return;
    
    if (target.classList.contains('complete-btn')) {
        state.toggleComplete(eventId);
    } else if (target.classList.contains('edit-btn')) {
        const event = state.getEvent(eventId);
        if (event) {
            state.setEditingEvent(eventId);
            populateForm(event);
            clearErrors();
            showModal(true);
        }
    } else if (target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this event?')) {
            state.deleteEvent(eventId);
            showStatus('Event deleted successfully');
        }
    }
}

function handleExport() {
    const events = state.getAllEvents();
    if (events.length === 0) {
        showStatus('No events to export', 'error');
        return;
    }
    exportToJSON(events);
    showStatus('Events exported successfully');
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            const validation = validateImportData(imported);
            
            if (!validation.valid) {
                showStatus(`Import failed: ${validation.error}`, 'error');
                return;
            }
            
            state.setEvents(imported);
            showStatus(`Successfully imported ${imported.length} events`);
        } catch (error) {
            showStatus('Failed to import: Invalid JSON file', 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset the files input.
}

function updateUI() {
    updateStats();
    updateTagFilter();
    
    let events = state.getAllEvents();
    events = filterByTag(events, currentFilterTag);
    events = searchEvents(events, currentSearchQuery);
    events = sortEvents(events, currentSort);
    
    renderEvents(events, currentSearchQuery);
    
    // Update theme display in settings
    const currentTheme = document.body.className.includes('dark') ? 'Dark' : 'Light';
    const themeDisplay = document.getElementById('current-theme-display');
    if (themeDisplay) {
        themeDisplay.textContent = currentTheme;
    }
}

document.addEventListener('DOMContentLoaded', init);