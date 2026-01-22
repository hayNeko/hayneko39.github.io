let current_theme = localStorage.getItem('preferredTheme') || 'dark';
current_theme === "light" && document.documentElement.classList.add("light-theme");

const switchThemeButton = document.getElementById("theme");

function SwitchTheme() {
	if (document.body.classList.contains('theme-transitioning')) return;
	
	const targetTheme = current_theme === "dark" ? "light" : "dark";
	
	// 添加过渡状态
	document.body.classList.add('theme-transitioning');
	
	// 创建并添加遮罩层
	const overlay = document.createElement('div');
	overlay.className = 'theme-transition-overlay';
	overlay.style.zIndex = 'var(--index-transition-overlay)';
	
	// 根据当前主题设置渐变方向
	if (current_theme === "dark") {
		// 暗 → 亮：从浅色开始渐变
		overlay.style.background = 'linear-gradient(to bottom, var(--light-bg-start), var(--light-bg-end))';
	} else {
		// 亮 → 暗：从深色开始渐变
		overlay.style.background = 'linear-gradient(to top, var(--dark-bg-start), var(--dark-bg-end))';
	}
	
	document.body.appendChild(overlay);
	
	// 开始动画
	requestAnimationFrame(() => {
		overlay.classList.add('active');
		
		// 动画完成后切换主题
		setTimeout(() => {
			// 切换主题
			if (targetTheme === "light") {
				document.documentElement.classList.add("light-theme");
				current_theme = "light";
				switchThemeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
				localStorage.setItem('preferredTheme', 'light');
			} else {
				document.documentElement.classList.remove("light-theme");
				current_theme = "dark";
				switchThemeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
				localStorage.setItem('preferredTheme', 'dark');
			}
			
			// 渐变消失
			setTimeout(() => {
				overlay.classList.remove('active');
				
				// 完全移除遮罩层
				setTimeout(() => {
					if (overlay.parentNode) {
						document.body.removeChild(overlay);
					}
					document.body.classList.remove('theme-transitioning');
				}, 100);
			}, 300);
		}, 500); // 让渐变持续一段时间
	});
}