let current_theme = localStorage.getItem('preferredTheme') || 'dark';
current_theme === "light" && document.documentElement.classList.add("light-theme");

const switchThemeButton = document.getElementById("theme");

function SwitchTheme() {
	if (current_theme === "dark") {
		document.documentElement.classList.add("light-theme");
		current_theme = "light";
		switchThemeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
		localStorage.setItem('preferredTheme', 'light');
		// alert("Switched to light theme!");
	}
	else if (current_theme === "light") {
		document.documentElement.classList.remove("light-theme");
		current_theme = "dark";
		switchThemeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
		localStorage.setItem('preferredTheme', 'dark');
	}
	else {
		document.documentElement.classList.remove("light-theme");
		current_theme = "dark";
		localStorage.setItem('preferredTheme', 'dark');
	}
}