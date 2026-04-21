function CreateParticles(x, y) {
	const particleCount = 15;
	const particleColors = [
		"#FF6B6B",
		"#4ECDC4",
		"#FFD166",
		"#06D6A0",
		"#118AB2",
		"#EF476F",
		"#073B4C"
	];
			
	for (let i = 0; i < particleCount; i++) {
		const particle = document.createElement("div");
		particle.classList.add("dock_particle");
		
		const color = particleColors[Math.floor(Math.random() * particleColors.length)];
		particle.style.backgroundColor = color;
		
		const size = Math.random() * 16 + 8;
		particle.style.width = `${size}px`;
		particle.style.height = `${size}px`;
		
		const angle = Math.random() * Math.PI * 2;
		const distance = Math.random() * 100 + 20;
		const startX = x;
		const startY = y;

		particle.style.left = `${startX}px`;
		particle.style.top = `${startY}px`;
		
		document.body.appendChild(particle);
		
		const duration = Math.random() * 1000 + 1000;
		const endX = startX + distance * Math.cos(angle);
		const endY = startY + distance * Math.sin(angle);
		
		particle.animate([
			{
				transform: "translate(0, 0) scale(1)",
				opacity: 1
			},
			{
				transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.1)`,
				opacity: 0
			}
		], {
			duration: duration,
			easing: "cubic-bezier(0.215, 0.610, 0.355, 1)",
			fill: "forwards"
		});
		
		setTimeout(() => {
			if (particle.parentNode) {
				particle.parentNode.removeChild(particle);
			}
		}, duration);
	}
	// console.log("created");
}
	
function EmmitParticle() {
	const avatar = document.getElementById("avatar");

	// console.log("clicked");
	
	avatar.classList.add("clicked");
	
	const rect = avatar.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;
	
	CreateParticles(centerX, centerY);
	
	setTimeout(() => {
		avatar.classList.remove("clicked");
	}, 300);
}

window.EmmitParticle = EmmitParticle;