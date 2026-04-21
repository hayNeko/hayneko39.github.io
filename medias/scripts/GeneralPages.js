// Global variables
let leaveMessage = "Miku! ";
let originalTitle = "Hayneko's blog";

// Initialize on page load
document.addEventListener("visibilitychange", function () {
	if (document.hidden) {
		document.title = " (>_<) " + leaveMessage + originalTitle;
	} else {
		document.title = originalTitle;
	}
});

document.addEventListener('DOMContentLoaded', async function() {
	// 初始化语言系统
	if (window.InitializeLanguageSystem) {
		await InitializeLanguageSystem();
		
		// 获取当前语言的离开消息
		if (window.LanguageManager && window.LanguageManager.GetCurrentLanguageData) {
			const langData = LanguageManager.GetCurrentLanguageData();
			leaveMessage = langData.translations['title_leave-message'] || "Miku! ";
			originalTitle = langData.translations['title'] || originalTitle;
		}
	}
	
	// 延迟初始化菜单系统
	setTimeout(() => {
		if (window.InitializeMenuSystem) {
			InitializeMenuSystem();
		}
	}, 100);
});