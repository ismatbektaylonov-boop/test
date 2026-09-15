$(function () {
	$('#searchForm').on('submit', function (event) {
		event.preventDefault()
		const search = $('#searchInput').val().trim()
		const genre = $('#collectionSelect').val()
		const params = new URLSearchParams()
		if (search) params.set('search', search)
		if (genre) params.set('genre', genre)
		window.location.href = '/products' + (params.toString() ? '?' + params : '')
	})

	$(document).on('click', '.rent-btn', function () {
		const productId = $(this).data('id')
		const form = $('<form>', { method: 'POST', action: '/orders' })
		form.append(
			$('<input>', { type: 'hidden', name: 'productId', value: productId }),
		)
		$('body').append(form)
		form.trigger('submit')
	})

	// Kartochkaning istalgan joyiga bosilganda batafsil sahifasiga o'tish
	// (tugma, havola yoki forma bosilganda o'tmaydi — ular o'z ishini qiladi)
	$(document).on('click', '.product-card', function (event) {
		if ($(event.target).closest('button, a, form, select, input').length) return
		const productId = $(this).data('id')
		if (productId) window.location.href = '/products/' + productId
	})
})
