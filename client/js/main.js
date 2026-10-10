const API_BASE = '/api';

// Fetch and Render Dynamic School Outreaches on Homepage
document.addEventListener('DOMContentLoaded', () => {
    loadPublicOutreaches();
});

async function loadPublicOutreaches() {
    const container = document.getElementById('outreachGallery');
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE}/outreaches`);
        const outreaches = await response.json();

        if (!outreaches.length) {
            container.innerHTML = `<p class="text-gray-500 col-span-full text-center py-8">No school outreaches published yet. Check back soon!</p>`;
            return;
        }

        container.innerHTML = outreaches.map(item => `
            <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                ${item.images && item.images.length > 0 ? `
                    <img src="${item.images[0]}" alt="${item.title}" class="w-full h-48 object-cover">
                ` : `
                    <div class="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image Available</div>
                `}
                <div class="p-6 space-y-3">
                    <div class="flex justify-between items-center text-xs">
                        <span class="bg-pink-100 text-pink-700 font-semibold px-2.5 py-1 rounded-full uppercase">${item.category}</span>
                        <span class="text-gray-500">${new Date(item.eventDate).toLocaleDateString()}</span>
                    </div>
                    <h3 class="font-bold text-lg text-gray-900">${item.title}</h3>
                    <p class="text-xs text-gray-600 font-semibold">📍 ${item.schoolName} (${item.location})</p>
                    <p class="text-sm text-gray-600">${item.summary}</p>
                    <div class="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                        <span>🎓 ${item.studentsImpacted} Students Impacted</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load public outreaches:', err);
        container.innerHTML = `<p class="text-red-500 col-span-full text-center">Failed to load outreach stories.</p>`;
    }
}

// Public Volunteer Form Submission
document.getElementById('volunteerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Submitting...';

    const formData = {
        fullName: e.target[0].value,
        phone: e.target[1].value,
        skillArea: e.target[2].value
    };

    try {
        const response = await fetch(`${API_BASE}/volunteers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            e.target.reset();
            // Close modal function if defined in your main UI
            if (typeof closeModal === 'function') closeModal('volunteerModal');
        }
    } catch (err) {
        alert('Server connection error. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Application';
    }
});