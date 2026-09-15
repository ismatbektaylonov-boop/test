// home.js — bosh sahifadagi "constellation" zarralar foni (Coco uslubiga moslashtirilgan)

const particleContainer = document.querySelector('[data-home-particles]')

if (particleContainer) {
	const canvas = document.createElement('canvas'),
		context = canvas.getContext('2d'),
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)'),
		particles = [],
		connectionDistance = 120
	let animationFrame = 0,
		width = 0,
		height = 0,
		pixelRatio = 1

	particleContainer.append(canvas)

	const createParticle = () => ({
		opacity: Math.random() * 0.45 + 0.2,
		radius: Math.random() * 1.8 + 0.5,
		speedX: (Math.random() - 0.5) * 0.3,
		speedY: (Math.random() - 0.5) * 0.3,
		x: Math.random() * width,
		y: Math.random() * height,
	})

	const populateParticles = () => {
		const amount = Math.max(
			40,
			Math.min(110, Math.floor((width * height) / 19000)),
		)
		particles.length = 0
		for (let index = 0; index < amount; index += 1)
			particles.push(createParticle())
	}

	const draw = () => {
		context.clearRect(0, 0, width, height)

		particles.forEach((particle, index) => {
			context.beginPath()
			context.fillStyle = `rgba(14, 116, 144, ${particle.opacity})`
			context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
			context.fill()

			for (
				let otherIndex = index + 1;
				otherIndex < particles.length;
				otherIndex += 1
			) {
				const other = particles[otherIndex]
				const dx = particle.x - other.x
				const dy = particle.y - other.y
				const distance = Math.hypot(dx, dy)

				if (distance < connectionDistance) {
					context.beginPath()
					context.strokeStyle = `rgba(14, 116, 144, ${(1 - distance / connectionDistance) * 0.37})`
					context.lineWidth = 0.6
					context.moveTo(particle.x, particle.y)
					context.lineTo(other.x, other.y)
					context.stroke()
				}
			}
		})
	}

	const move = () => {
		particles.forEach(particle => {
			particle.x += particle.speedX
			particle.y += particle.speedY
			if (particle.x < 0 || particle.x > width) particle.speedX *= -1
			if (particle.y < 0 || particle.y > height) particle.speedY *= -1
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
		const bounds = particleContainer.getBoundingClientRect()
		pixelRatio = Math.min(window.devicePixelRatio, 1.5)
		width = bounds.width
		height = bounds.height
		canvas.width = Math.round(width * pixelRatio)
		canvas.height = Math.round(height * pixelRatio)
		context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
		populateParticles()
		updateMotion()
	}

	const resizeObserver = new ResizeObserver(resize)
	resizeObserver.observe(particleContainer)
	reducedMotion.addEventListener('change', updateMotion)
	window.addEventListener(
		'pagehide',
		() => {
			window.cancelAnimationFrame(animationFrame)
			resizeObserver.disconnect()
			reducedMotion.removeEventListener('change', updateMotion)
		},
		{ once: true },
	)
}
