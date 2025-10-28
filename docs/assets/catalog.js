// Course Catalog JavaScript
// Loads courses from catalog.json and renders them

let allCourses = [];
let currentFilter = 'all';

// Load courses on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadCourses();
    setupFilters();
});

// Load courses from catalog.json
async function loadCourses() {
    try {
        const response = await fetch('catalog.json');
        const data = await response.json();
        allCourses = data.courses || [];
        renderCourses(allCourses);
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('courses').innerHTML = `
            <div class="error-message">
                <p>Unable to load course catalog. Please try again later.</p>
            </div>
        `;
    }
}

// Render courses to the grid
function renderCourses(courses) {
    const coursesContainer = document.getElementById('courses');

    if (courses.length === 0) {
        coursesContainer.innerHTML = `
            <div class="no-courses">
                <p>No courses available at this time.</p>
            </div>
        `;
        return;
    }

    coursesContainer.innerHTML = courses.map(course => createCourseCard(course)).join('');
}

// Create a course card HTML
function createCourseCard(course) {
    const levelClass = `level-${course.level}`;
    const topics = course.topics ? course.topics.map(tag =>
        `<span class="topic-tag">${tag}</span>`
    ).join('') : '';

    return `
        <article class="course-card" data-level="${course.level}">
            <div class="course-header">
                <h2 class="course-title">${course.title}</h2>
                <span class="course-level ${levelClass}">${course.level}</span>
            </div>

            ${course.description ? `<p class="course-description">${course.description}</p>` : ''}

            <div class="course-meta">
                ${course.version ? `<span class="course-meta-item">📦 v${course.version}</span>` : ''}
                ${course.language ? `<span class="course-meta-item">🌐 ${course.language.toUpperCase()}</span>` : ''}
            </div>

            ${topics ? `<div class="topics">${topics}</div>` : ''}

            <a href="${course.repo}" class="course-link" target="_blank" rel="noopener">
                View Course →
            </a>
        </article>
    `;
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter courses
            const filter = button.dataset.filter;
            currentFilter = filter;

            if (filter === 'all') {
                renderCourses(allCourses);
            } else {
                const filtered = allCourses.filter(course => course.level === filter);
                renderCourses(filtered);
            }
        });
    });
}
