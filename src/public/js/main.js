// main.js — barcha sahifalar uchun umumiy yordamchi funksiyalar

axios.defaults.headers.common['Content-Type'] = 'application/json'

/** Statusni chiroyli belgi (tag) sifatida render qilish */
function renderStatusTag(status) {
	const labels = {
		PENDING: 'Kutilmoqda',
		APPROVE: 'Tasdiqlangan',
		REJECT: 'Rad etilgan',
		RETURNED: 'Qaytarilgan',
	}
	return `<span class="status-tag status-${status}">${labels[status] || status}</span>`
}

/** Xatolik xabarini ko'rsatish */
function showError(selector, message) {
	const el = document.querySelector(selector)
	if (!el) return
	el.textContent = message
	el.style.display = 'block'
}

/** Escape user-controlled values before placing them in an HTML template. */
function escapeHtml(value) {
	return String(value ?? '').replace(/[&<>'\"]/g, function (character) {
		return {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			"'": '&#39;',
			'"': '&quot;',
		}[character]
	})
}
