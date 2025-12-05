// ===================================
// Resume Manager
// Handle resume CRUD operations
// ===================================

class ResumeManager {
    constructor() {
        this.resumes = [];
        this.storageKey = 'app_resumes';
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.setupForm();
        this.loadResumes();
    }

    setupForm() {
        const form = document.getElementById('resume-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveResume();
        });
    }

    saveResume() {
        const formData = {
            id: this.currentEditId || Utils.generateId(),
            name: document.getElementById('resume-name').value.trim(),
            email: document.getElementById('resume-email').value.trim(),
            phone: document.getElementById('resume-phone').value.trim(),
            location: document.getElementById('resume-location').value.trim(),
            summary: document.getElementById('resume-summary').value.trim(),
            skills: document.getElementById('resume-skills').value.trim(),
            experience: document.getElementById('resume-experience').value.trim(),
            education: document.getElementById('resume-education').value.trim(),
            certifications: document.getElementById('resume-certifications').value.trim(),
            createdAt: this.currentEditId ?
                this.resumes.find(r => r.id === this.currentEditId)?.createdAt : Date.now(),
            updatedAt: Date.now()
        };

        if (this.currentEditId) {
            // Update existing
            const index = this.resumes.findIndex(r => r.id === this.currentEditId);
            if (index !== -1) {
                this.resumes[index] = formData;
            }
            this.currentEditId = null;
        } else {
            // Add new
            this.resumes.push(formData);
        }

        Storage.set(this.storageKey, this.resumes);
        this.renderResumes();
        this.resetForm();

        Utils.showNotification('Resume saved successfully!');
    }

    loadResumes() {
        const stored = Storage.get(this.storageKey);
        this.resumes = stored || [];
        this.renderResumes();
    }

    renderResumes() {
        const container = document.getElementById('resume-list');

        if (this.resumes.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📄</div>
          <p>No resumes saved yet. Create your first resume above!</p>
        </div>
      `;
            return;
        }

        container.innerHTML = this.resumes.map(resume => {
            const skillsList = Utils.extractSkills(resume.skills);
            const skillsPreview = skillsList.slice(0, 5).join(', ') +
                (skillsList.length > 5 ? ` +${skillsList.length - 5} more` : '');

            return `
        <div class="item-card" data-id="${resume.id}">
          <div class="item-header">
            <div>
              <h3 class="item-title">${Utils.escapeHtml(resume.name)}</h3>
              <p class="item-subtitle">${Utils.escapeHtml(resume.email)}</p>
            </div>
            <div class="item-actions">
              <button class="btn btn-sm btn-secondary edit-resume" data-id="${resume.id}">Edit</button>
              <button class="btn btn-sm btn-danger delete-resume" data-id="${resume.id}">Delete</button>
            </div>
          </div>
          <div class="item-meta">
            <span class="tag">${skillsList.length} skills</span>
            <span class="tag">Updated ${Utils.formatDate(resume.updatedAt)}</span>
          </div>
          ${skillsPreview ? `<p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">${Utils.escapeHtml(skillsPreview)}</p>` : ''}
        </div>
      `;
        }).join('');

        // Attach event listeners
        container.querySelectorAll('.edit-resume').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editResume(btn.dataset.id);
            });
        });

        container.querySelectorAll('.delete-resume').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteResume(btn.dataset.id);
            });
        });
    }

    editResume(id) {
        const resume = this.resumes.find(r => r.id === id);
        if (!resume) return;

        this.currentEditId = id;

        // Populate form
        document.getElementById('resume-name').value = resume.name;
        document.getElementById('resume-email').value = resume.email;
        document.getElementById('resume-phone').value = resume.phone;
        document.getElementById('resume-location').value = resume.location;
        document.getElementById('resume-summary').value = resume.summary;
        document.getElementById('resume-skills').value = resume.skills;
        document.getElementById('resume-experience').value = resume.experience;
        document.getElementById('resume-education').value = resume.education;
        document.getElementById('resume-certifications').value = resume.certifications;

        // Scroll to form
        document.getElementById('resume-form').scrollIntoView({ behavior: 'smooth' });
    }

    deleteResume(id) {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        this.resumes = this.resumes.filter(r => r.id !== id);
        Storage.set(this.storageKey, this.resumes);
        this.renderResumes();

        Utils.showNotification('Resume deleted');
    }

    resetForm() {
        document.getElementById('resume-form').reset();
        this.currentEditId = null;
    }

    getResume(id) {
        return this.resumes.find(r => r.id === id);
    }

    getAllResumes() {
        return this.resumes;
    }
}

// Initialize
const resumeManager = new ResumeManager();
