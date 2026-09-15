// auth-nova.js — login sahifasi: forma yuborish + fondagi "constellation" zarralar animatsiyasi

/* ---------- ZARRALAR FONI ---------- */
;(function initAuthNova() {
	const container = document.querySelector('[data-auth-nova]')
	if (!container) return

	const canvas = document.createElement('canvas'),
		context = canvas.getContext('2d'),
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)'),
		particles = [],
		connectionDistance = 110
	let animationFrame = 0,
		width = 0,
		height = 0,
		pixelRatio = 1

	container.append(canvas)

	const createParticle = () => ({
		opacity: Math.random() * 0.5 + 0.15,
		radius: Math.random() * 1.6 + 0.4,
		speedX: (Math.random() - 0.5) * 0.25,
		speedY: (Math.random() - 0.5) * 0.25,
		x: Math.random() * width,
		y: Math.random() * height,
	})

	const populate = () => {
		const amount = Math.max(
			50,
			Math.min(140, Math.floor((width * height) / 12000)),
		)
		particles.length = 0
		for (let i = 0; i < amount; i += 1) particles.push(createParticle())
	}

	const draw = () => {
		context.clearRect(0, 0, width, height)
		particles.forEach((p, i) => {
			context.beginPath()
			context.fillStyle = `rgba(14, 116, 144, ${p.opacity})`
			context.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
			context.fill()

			for (let j = i + 1; j < particles.length; j += 1) {
				const other = particles[j]
				const distance = Math.hypot(p.x - other.x, p.y - other.y)
				if (distance < connectionDistance) {
					context.beginPath()
					context.strokeStyle = `rgba(14, 116, 144, ${(1 - distance / connectionDistance) * 0.37})`
					context.lineWidth = 0.6
					context.moveTo(p.x, p.y)
					context.lineTo(other.x, other.y)
					context.stroke()
				}
			}
		})
	}

	const move = () => {
		particles.forEach(p => {
			p.x += p.speedX
			p.y += p.speedY
			if (p.x < 0 || p.x > width) p.speedX *= -1
			if (p.y < 0 || p.y > height) p.speedY *= -1
		})
	}

	const animate = () => {
		move()
		draw()
		animationFrame = window.requestAnimationFrame(animate)
	}

	const updateMotion = () => {
		window.cancelAnimationFrame(animationFrame)
		draw()
		if (!reducedMotion.matches)
			animationFrame = window.requestAnimationFrame(animate)
	}

	const resize = () => {
		const bounds = container.getBoundingClientRect()
		pixelRatio = Math.min(window.devicePixelRatio, 1.5)
		width = bounds.width
		height = bounds.height
		canvas.width = Math.round(width * pixelRatio)
		canvas.height = Math.round(height * pixelRatio)
		context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
		populate()
		updateMotion()
	}

	const resizeObserver = new ResizeObserver(resize)
	resizeObserver.observe(container)
	reducedMotion.addEventListener('change', updateMotion)
})()
