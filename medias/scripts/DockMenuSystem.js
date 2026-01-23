// 菜单系统
let dock_active_menu = null;
let dock_menu_positions = {};
let dock_click_timeout = null;
let dock_menu_timeout_ids = {}; // 存储每个菜单的超时ID

// 初始化菜单系统
function InitializeMenuSystem() {
	// 修改点击其他地方关闭菜单的逻辑
	document.addEventListener('click', function(event) {
		// 检查点击的元素是否是菜单或菜单按钮
		const isMenuClick = event.target.closest('.dock_language-menu') || 
						event.target.closest('.dock_search-menu') || 
						event.target.closest('.dock_tools-menu') ||
						event.target.closest('.dock_contact-menu');
		
		const isButtonClick = event.target.closest('#language') || 
							event.target.closest('#search') || 
							event.target.closest('#tools') ||
							event.target.closest('#contact');

		if (!isMenuClick && !isButtonClick) {
			CloseAllDockMenus();
		}
		
	});
	
	// 初始化时更新当前语言选中状态
	UpdateDockLanguageSelection();
}

// 切换菜单显示/隐藏
function ToggleMenu(menuId) {
	const menu = document.getElementById(menuId);
	
	// 如果点击的是当前已激活的菜单，则关闭它
	if (dock_active_menu === menuId) {
		CloseAllDockMenus();
		return;
	}
	
	// 关闭其他菜单
	CloseAllDockMenus();
	
	// 显示当前菜单
	if (menu) {
		dock_active_menu = menuId;
		
		// 获取对应的按钮位置
		const buttonId = menuId.replace('dock_', '');
		const button = document.getElementById(buttonId);
		const dock = document.querySelector('.dock');
		
		if (button && dock) {
			const buttonRect = button.getBoundingClientRect();
			const dockRect = dock.getBoundingClientRect();
			
			// 计算按钮中心相对于视口的位置
			const buttonCenterX = buttonRect.left + buttonRect.width / 2;
			const buttonCenterY = buttonRect.top + buttonRect.height / 2;
			
			// 计算菜单最终位置（固定在中心）
			const menuFinalX = window.innerWidth / 2;
			const menuFinalY = dockRect.top - 110;
			
			// 计算从按钮到菜单最终位置的相对位移
			const offsetX = (buttonCenterX - menuFinalX) / 2;
			const offsetY = (buttonCenterY - menuFinalY) / 2;
			
			// 设置CSS变量用于动画起点
			menu.style.setProperty('--menu-pop-origin', 
				`translate(calc(-50% + ${offsetX}px), ${offsetY}px)`);
		}
		
		// 显示菜单并添加动画
		menu.style.visibility = 'visible';
		menu.style.display = 'block';
		
		// 延迟添加show类，确保animation生效
		setTimeout(() => {
			menu.classList.add('show');
			menu.style.opacity = '1';
		}, 10);
		
		// 如果是语言菜单，更新选中状态
		if (menuId === 'dock_language') {
			UpdateDockLanguageSelection();
		}
	}
}

// 关闭所有菜单
function CloseAllDockMenus() {
	const menus = document.querySelectorAll('.dock_language-menu, .dock_search-menu, .dock_tools-menu, .dock_contact-menu');
	menus.forEach(menu => {
		// 清除之前的超时
		if (dock_menu_timeout_ids[menu.id]) {
			clearTimeout(dock_menu_timeout_ids[menu.id]);
			delete dock_menu_timeout_ids[menu.id];
		}
		
		// 只对已显示的菜单进行收起动画
		if (menu.classList.contains('show') || menu.style.display === 'block') {
			menu.classList.remove('show');
			menu.style.animation = 'dock_menu_collapse 0.3s cubic-bezier(0.5, 0, 0.5, -0.5) forwards';
			
			// 延迟隐藏以等待动画完成
			dock_menu_timeout_ids[menu.id] = setTimeout(() => {
				menu.style.opacity = '0';
				menu.style.display = 'none';
				menu.style.animation = '';
				delete dock_menu_timeout_ids[menu.id];
			}, 300);
		} else {
			// 如果菜单本来就没显示，直接重置
			menu.style.opacity = '0';
			menu.style.display = 'none';
			menu.style.animation = '';
		}
	});
	dock_active_menu = null;
}

// 设置语言
function SetLanguage(langCode) {
	// 使用LanguageManager设置语言

	if (window.LanguageManager && LanguageManager.SetLanguage) {
		LanguageManager.SetLanguage(langCode);
		if (window.UpdatePageLanguage) {
			UpdatePageLanguage();
		}
		
		// 更新语言选择状态
		UpdateDockLanguageSelection();
		
	} else {
		console.error('LanguageManager not available');
	}
}

// 更新语言选择状态
function UpdateDockLanguageSelection() {
	const langOptions = document.querySelectorAll('.dock_menu_option');
	const currentLang = window.LanguageManager ? LanguageManager.currentLanguage : 'en';
	
	langOptions.forEach(option => {
		const onClickAttr = option.getAttribute('onclick');
		if (onClickAttr) {
			// 从onclick属性中提取语言代码
			const langMatch = onClickAttr.match(/SetLanguage\('([^']+)'\)/);
			if (langMatch) {
				const langCode = langMatch[1];
				if (langCode === currentLang) {
					option.classList.add('active');
				} else {
					option.classList.remove('active');
				}
			}
		}
	});
}

// 导出函数到全局作用域
window.InitializeMenuSystem = InitializeMenuSystem;
window.ToggleMenu = ToggleMenu;
window.SetLanguage = SetLanguage;
window.CloseAllDockMenus = CloseAllDockMenus;
window.UpdateDockLanguageSelection = UpdateDockLanguageSelection;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
	// 延迟初始化以确保所有元素已加载
	setTimeout(() => {
		if (window.InitializeMenuSystem) {
			InitializeMenuSystem();
		}
	}, 100);
});