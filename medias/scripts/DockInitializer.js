// Dock Event Handlers - 导出到全局作用域
function HandleDockClickEvent_EmmitParticle() {
	if (window.EmmitParticle) {
		EmmitParticle();
	}
}

function HandleDockClickEvent_Contact_Via(url) {
	window.open(url, "_blank");
}

function HandleDockClickEvent_Home() {
	window.location.href = "/index.html";
}

function HandleDockClickEvent_Album() {
	// window.location.href = "#";
}

function HandleDockClickEvent_Storage() {
	window.location.href = "/pages/storage-list.html";
}

function HandleDockClickEvent_FriendlyLinks(event) {
	event.stopPropagation();
	ToggleMenu("dock_friendly-links");
}

function HandleDockClickEvent_Projects() {
	window.open("https://github.com/hayNeko", "_blank");
}

function HandleDockClickEvent_Contact(event) {
	event.stopPropagation();
	ToggleMenu("dock_contact");
}

function HandleDockClickEvent_Language(event) {
	event.stopPropagation();
	ToggleMenu("dock_language");
}

function HandleDockClickEvent_Theme() {
	if (window.SwitchTheme) {
		SwitchTheme();
	}
}

function HandleDockClickEvent_Search(event) {
	event.stopPropagation();
	ToggleMenu("dock_search");
}

function HandleDockClickEvent_Tools(event) {
	event.stopPropagation();
	ToggleMenu("dock_tools");
}

// 导出所有函数到全局作用域
window.HandleDockClickEvent_EmmitParticle = HandleDockClickEvent_EmmitParticle;
window.HandleDockClickEvent_Contact_Via = HandleDockClickEvent_Contact_Via;
window.HandleDockClickEvent_Home = HandleDockClickEvent_Home;
window.HandleDockClickEvent_Album = HandleDockClickEvent_Album;
window.HandleDockClickEvent_Storage = HandleDockClickEvent_Storage;
window.HandleDockClickEvent_FriendlyLinks = HandleDockClickEvent_FriendlyLinks;
window.HandleDockClickEvent_Projects = HandleDockClickEvent_Projects;
window.HandleDockClickEvent_Contact = HandleDockClickEvent_Contact;
window.HandleDockClickEvent_Language = HandleDockClickEvent_Language;
window.HandleDockClickEvent_Theme = HandleDockClickEvent_Theme;
window.HandleDockClickEvent_Search = HandleDockClickEvent_Search;
window.HandleDockClickEvent_Tools = HandleDockClickEvent_Tools;
