import { saveEvents } from './storage.js';

class AppState {
    constructor() {
        this.events = [];
        this.editingEventId = null;
        this.listeners = [];
    }

    setEvents(events) {
        this.events = events;
        saveEvents(events);
        this.notify();
    }

    addEvent(eventData) {
        const newEvent = {
            ...eventData,
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false
        };
        
        this.events.push(newEvent);
        saveEvents(this.events);
        this.notify();
        return newEvent;
    }

    updateEvent(id, eventData) {
        const index = this.events.findIndex(e => e.id === id);
        if (index !== -1) {
            this.events[index] = {
                ...this.events[index],
                ...eventData,
                updatedAt: new Date().toISOString()
            };
            saveEvents(this.events);
            this.notify();
            return true;
        }
        return false;
    }

    deleteEvent(id) {
        const index = this.events.findIndex(e => e.id === id);
        if (index !== -1) {
            this.events.splice(index, 1);
            saveEvents(this.events);
            this.notify();
            return true;
        }
        return false;
    }

    toggleComplete(id) {
        const event = this.events.find(e => e.id === id);
        if (event) {
            event.completed = !event.completed;
            event.updatedAt = new Date().toISOString();
            saveEvents(this.events);
            this.notify();
            return true;
        }
        return false;
    }

    getEvent(id) {
        return this.events.find(e => e.id === id);
    }

    getAllEvents() {
        return [...this.events];
    }

    getStats() {
        const total = this.events.length;
        const completed = this.events.filter(e => e.completed).length;
        const totalHours = this.events.reduce((sum, e) => sum + parseFloat(e.duration || 0), 0);
        
        const tagCounts = this.events.reduce((acc, e) => {
            acc[e.tag] = (acc[e.tag] || 0) + 1;
            return acc;
        }, {});
        
        const topTag = Object.keys(tagCounts).length > 0
            ? Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])[0]
            : 'None';
        
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const recentEvents = this.events.filter(e => new Date(e.date) >= lastWeek).length;
        
        return {
            total,
            completed,
            totalHours: totalHours.toFixed(1),
            topTag,
            recentEvents
        };
    }

    getUniqueTags() {
        return [...new Set(this.events.map(e => e.tag))].sort();
    }

    setEditingEvent(id) {
        this.editingEventId = id;
    }

    getEditingEvent() {
        return this.editingEventId ? this.getEvent(this.editingEventId) : null;
    }

    clearEditingEvent() {
        this.editingEventId = null;
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(callback => callback());
    }
}

export const state = new AppState();