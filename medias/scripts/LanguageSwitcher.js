
const LanguageManager = {
data: null,
currentLanguage: localStorage.getItem('siteLanguage') || 'en',
languageOrder: ['en', 'zh-CN', 'zh-TW', 'ja'],

async LoadLanguageData() {
	try {
		const response = await fetch('medias/i18n-data/i18n-translate-table.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		this.data = await response.json();
		console.log('Language data loaded.');
		return true;
	} catch (error) {
		console.error('Error loading language data:', error);
		this.data = {
			'en': {
				name: 'English',
				"translations": {
					"home": "Home",
					"album": "Album",
					"about": "About",
					"projects": "Projects",
					"contact": "Contact",
					"language": "Language",
					"switch theme": "Switch Theme",
					"search": "Search",
					"tools": "Tools",
					"title": "Hayneko's Blog",
					"title_leave-message": "Miku! Come back soon to ",

					"construction": "NEW SITE IS UNDER CONSTRUCTION"
				}
			},
			languages: ['en']
		};
		return false;
	}
},
	
	// 获取当前语言数据
	GetCurrentLanguageData() {
		if (!this.data) {
			console.warn('Language data not loaded yet, returning default English data.');
			return {
				name: 'English',
				translations: {
					"home": "Home",
					"album": "Album",
					"about": "About",
					"projects": "Projects",
					"contact": "Contact",
					"language": "Language",
					"switch theme": "Switch Theme",
					"search": "Search",
					"tools": "Tools",
					"title": "Hayneko's Blog",
					"title_leave-message": "Miku! Come back soon to ",

					"construction": "NEW SITE IS UNDER CONSTRUCTION"
				}
			};
		}
		if (!this.data[this.currentLanguage]) {
			console.warn(`Language ${this.currentLanguage} not found, falling back to English.`);
			return this.data['en'] || this.data.en; // 两种访问方式都试试
		}

		return this.data[this.currentLanguage];
	},
	
	// 获取所有支持的语言
	GetSupportedLanguages() {
		return this.languageOrder;
	},
	
	// 切换语言
	SwitchToNextLanguage() {
		// 使用 JSON 中的 languages 数组，如果没有则使用默认的 languageOrder
		const languageOrder = this.data && this.data.languages ? this.data.languages : this.languageOrder;
		const currentIndex = languageOrder.indexOf(this.currentLanguage);
		
		// 如果当前语言不在列表中，默认到第一个
		if (currentIndex === -1) {
			this.currentLanguage = languageOrder[0];
		} else {
			const nextIndex = (currentIndex + 1) % languageOrder.length;
			this.currentLanguage = languageOrder[nextIndex];
		}
		
		localStorage.setItem('siteLanguage', this.currentLanguage);
		return this.currentLanguage;
	},
	
	// 设置特定语言
	SetLanguage(langCode) {
		if (this.languageOrder.includes(langCode)) {
			this.currentLanguage = langCode;
			localStorage.setItem('siteLanguage', this.currentLanguage);
			return true;
		}
		return false;
	},
	
	// 获取翻译
	GetTranslation(key) {
		const langData = this.GetCurrentLanguageData();
		return langData.translations[key] || key;
	},
	
};

async function InitializeLanguageSystem() {
	await LanguageManager.LoadLanguageData();
	
	UpdatePageLanguage();
	
	console.log(`Current language: ${LanguageManager.currentLanguage}`);
}

function UpdatePageLanguage() {
	const langData = LanguageManager.GetCurrentLanguageData();
	
	// document.querySelectorAll('[data-tooltip]').forEach(element => {
	// 	const key = element.getAttribute('data-tooltip');
	// 	if (langData.translations[key]) {
	// 		element.setAttribute('data-tooltip', langData.translations[key]);
	// 	}
	// });

	// data-i18n-tooltip elements
	document.querySelectorAll('[data-i18n-tooltip]').forEach(element => {
		const key = element.getAttribute('data-i18n-tooltip');
		const translation = langData.translations[key];
		if (translation) {
			// 将翻译设置到 data-tooltip 属性，因为 CSS 使用这个属性
			element.setAttribute('data-tooltip', translation);
		}
	});
	
	if (langData.translations['title']) {
		document.title = langData.translations['title'];
		originalTitle = langData.translations['title'];
	}

	// data-i18n elements
	document.querySelectorAll('[data-i18n]').forEach(element => {
		const key = element.getAttribute('data-i18n');
		const translation = langData.translations[key];
		if (translation) {
			if (element.tagName === 'INPUT' && element.type === 'submit') {
				element.value = translation;
			} else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
				if (element.hasAttribute('placeholder')) {
				} else {
					element.value = translation;
				}
			} else {
				element.textContent = translation;
			}
		}
	});

	// data-i18n-placeholder elements
	document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
		const key = element.getAttribute('data-i18n-placeholder');
		const translation = langData.translations[key];
		if (translation && element.hasAttribute('placeholder')) {
			element.setAttribute('placeholder', translation);
		}
	});

	// data-i18n-value elements
	document.querySelectorAll('[data-i18n-value]').forEach(element => {
		const key = element.getAttribute('data-i18n-value');
		const translation = langData.translations[key];
		if (translation) {
			element.value = translation;
		}
	});

	// data-i18n-alt elements
	document.querySelectorAll('[data-i18n-alt]').forEach(element => {
		const key = element.getAttribute('data-i18n-alt');
		const translation = langData.translations[key];
		if (translation && element.hasAttribute('alt')) {
			element.setAttribute('alt', translation);
		}
	});

	localStorage.setItem('siteLanguage', LanguageManager.currentLanguage);
	document.documentElement.lang = LanguageManager.currentLanguage;
}

