// ===================================
// Application Core
// Navigation & State Management
// ===================================

class App {
    constructor() {
        this.currentView = 'resume';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadInitialData();
    }

    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');

        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(viewName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.view === viewName) {
                tab.classList.add('active');
            }
        });

        // Update active view section
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }

        this.currentView = viewName;

        // Refresh data for the new view
        if (viewName === 'comparison') {
            comparisonEngine.loadSelectors();
        }
    }

    loadInitialData() {
        // Initialize managers
        resumeManager.loadResumes();
        jobManager.loadJobs();
    }
}

// ===================================
// Storage Helper
// ===================================

const Storage = {
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }
};

// ===================================
// Utility Functions
// ===================================

const Utils = {
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    extractSkills(text) {
        if (!text) return [];

        // Split by commas, newlines, or semicolons
        const skills = text
            .split(/[,\n;]+/)
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

        return [...new Set(skills)]; // Remove duplicates
    },

    normalizeSkill(skill) {
        return skill.toLowerCase().trim();
    },

    showNotification(message, type = 'success') {
        // Simple notification (can be enhanced with a toast library)
        console.log(`[${type.toUpperCase()}] ${message}`);

        // You could add a toast notification here
        // For now, we'll use a simple alert for important messages
        if (type === 'error') {
            alert(message);
        }
    }
};

// ===================================
// Initialize App
// ===================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});
