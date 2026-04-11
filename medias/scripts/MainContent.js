// class ArticleRenderer {
// 	constructor() {
// 		this.articleListContainer = document.getElementById('article-list-container');
// 	}

// 	// 获取文章列表
// 	async fetchArticleList() {
// 		try {
// 			const response = await fetch('./articles/article-list.json');
// 			if (!response.ok) {
// 				throw new Error(`HTTP error! status: ${response.status}`);
// 			}
// 			return await response.json();
// 		} catch (error) {
// 			console.error('Error fetching article list:', error);
// 			return [];
// 		}
// 	}

// 	// 获取单篇文章内容
// 	async fetchArticle(articlePath) {
// 		try {
// 			const response = await fetch(`./articles/${articlePath}`);
// 			if (!response.ok) {
// 				throw new Error(`HTTP error! status: ${response.status}`);
// 			}
// 			return await response.json();
// 		} catch (error) {
// 			console.error(`Error fetching article ${articlePath}:`, error);
// 			return null;
// 		}
// 	}

// 	// 获取内容的国际化文本
// 	getLocalizedContent(item) {
// 		// 如果有data-i18n且当前语言的翻译存在，使用翻译
// 		if (item['data-i18n'] && typeof item['data-i18n'] === 'object') {
// 			const currentLang = LanguageManager.currentLanguage;
// 			if (item['data-i18n'][currentLang]) {
// 				return item['data-i18n'][currentLang];
// 			}
// 			// 回退到英文
// 			if (item['data-i18n']['en']) {
// 				return item['data-i18n']['en'];
// 			}
// 		}
// 		// 如果没有i18n数据，使用content字段
// 		return item.content || '';
// 	}

// 	// 渲染文章内容
// 	renderArticleContent(contentArray, hasI18n = false) {
// 		let contentHTML = '';
		
// 		contentArray.forEach(item => {
// 			if (!item || !item.type) return;

// 			// 获取本地化内容
// 			const localizedContent = hasI18n ? this.getLocalizedContent(item) : item.content;
			
// 			switch (item.type) {
// 				case 'heading1':
// 					contentHTML += `<h1 class="article-heading1">${localizedContent}</h1>`;
// 					break;
// 				case 'heading2':
// 					contentHTML += `<h2 class="article-heading2">${localizedContent}</h2>`;
// 					break;
// 				case 'heading3':
// 					contentHTML += `<h3 class="article-heading3">${localizedContent}</h3>`;
// 					break;
// 				case 'paragraph':
// 					contentHTML += `<p class="article-paragraph">${localizedContent}</p>`;
// 					break;
// 				case 'media':
// 					const imgAlt = hasI18n && item['data-i18n'] ? this.getLocalizedContent(item) : (item.alt || 'Article media');
// 					contentHTML += `<div class="article-media">
// 						<img src="${item.content}" alt="${imgAlt}" class="article-image">
// 						${imgAlt ? `<figcaption class="article-media-caption">${imgAlt}</figcaption>` : ''}
// 					</div>`;
// 					break;
// 				case 'link':
// 					const linkText = item.text || item.content;
// 					contentHTML += `<div class="article-link">
// 						<a href="${item.content}" target="_blank" rel="noopener noreferrer" class="article-external-link">${linkText}</a>
// 					</div>`;
// 					break;
// 				case 'code':
// 					const language = item.language || 'plaintext';
// 					contentHTML += `<pre class="article-code"><code class="language-${language}">${this.escapeHtml(localizedContent)}</code></pre>`;
// 					break;
// 				case 'quote':
// 					contentHTML += `<blockquote class="article-quote">${localizedContent}</blockquote>`;
// 					break;
// 				case 'list':
// 					if (item.items && Array.isArray(item.items)) {
// 						const listTag = item.ordered ? 'ol' : 'ul';
// 						const listItems = item.items.map(listItem => {
// 							const itemContent = hasI18n && listItem['data-i18n'] ? 
// 								this.getLocalizedContent(listItem) : listItem;
// 							return `<li>${itemContent}</li>`;
// 						}).join('');
// 						contentHTML += `<${listTag} class="article-list">${listItems}</${listTag}>`;
// 					}
// 					break;
// 				default:
// 					console.warn('Unknown content type:', item.type);
// 			}
// 		});
		
// 		return contentHTML;
// 	}

// 	// HTML转义函数
// 	escapeHtml(text) {
// 		const div = document.createElement('div');
// 		div.textContent = text;
// 		return div.innerHTML;
// 	}

// 	// 渲染单篇文章
// 	renderArticle(articleData) {
// 		const articleElement = document.createElement('div');
// 		articleElement.className = 'article-item';
		
// 		// 检查是否启用了i18n
// 		const hasI18n = articleData['has-data-i18n'] === true;
		
// 		// 获取本地化标题
// 		const title = hasI18n && articleData.title && typeof articleData.title === 'object' ?
// 			(articleData.title[LanguageManager.currentLanguage] || articleData.title['en'] || 'Untitled') :
// 			articleData.title;
		
// 		// 获取本地化作者
// 		const author = hasI18n && articleData.author && typeof articleData.author === 'object' ?
// 			(articleData.author[LanguageManager.currentLanguage] || articleData.author['en'] || 'Unknown') :
// 			articleData.author;
		
// 		// 生成文章HTML
// 		articleElement.innerHTML = `
// 			<div class="article-header">
// 				<h2 class="article-title">${title}</h2>
// 				<div class="article-meta">
// 					<span class="article-author">author: ${author}</span>
// 					<span class="article-date">date: ${articleData.date}</span>
// 				</div>
// 			</div>
// 			<div class="article-content">
// 				${this.renderArticleContent(articleData.content, hasI18n)}
// 			</div>
// 			<div class="article-footer">
// 				<div class="article-tags">
// 					${articleData.tags ? articleData.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('') : ''}
// 				</div>
// 				${articleData['readmore'] && articleData['readmore']['href'] ? 
// 					`<a href="${articleData['readmore']['href']}" class="article-nav-link">${articleData['readmore']['display']}</a>` :
// 					''}
// 			</div>
// 		`;
		
// 		return articleElement;
// 	}

// 	// 渲染所有文章
// 	async renderAllArticles() {
// 		if (!this.articleListContainer) {
// 			console.error('Article list container not found');
// 			return;
// 		}

// 		// 显示加载状态
// 		this.articleListContainer.innerHTML = '<div class="loading">正在加载文章...</div>';
		
// 		try {
// 			// 获取文章列表
// 			const articleList = await this.fetchArticleList();
			
// 			// 如果没有文章
// 			if (!articleList || articleList.length === 0) {
// 				this.articleListContainer.innerHTML = '<div class="no-articles">暂无文章</div>';
// 				return;
// 			}
			
// 			// 清空容器
// 			this.articleListContainer.innerHTML = '';
			
// 			// 遍历文章列表并渲染每篇文章
// 			for (const articlePath of articleList) {
// 				const articleData = await this.fetchArticle(articlePath);
				
// 				if (articleData) {
// 					try {
// 						const articleElement = this.renderArticle(articleData);
// 						this.articleListContainer.appendChild(articleElement);
// 					} catch (error) {
// 						console.error(`Error rendering article from ${articlePath}:`, error);
// 					}
// 				} else {
// 					console.warn(`Failed to load article: ${articlePath}`);
// 				}
// 			}
			
// 			// 如果没有成功加载任何文章
// 			if (this.articleListContainer.children.length === 0) {
// 				this.articleListContainer.innerHTML = '<div class="no-articles">未能加载文章</div>';
// 			}
			
// 		} catch (error) {
// 			console.error('Error rendering articles:', error);
// 			this.articleListContainer.innerHTML = '<div class="error">加载文章时出错</div>';
// 		}
// 	}

// 	// 重新渲染文章（用于语言切换时调用）
// 	async reRenderAllArticles() {
// 		await this.renderAllArticles();
// 	}
// }

// // 初始化并渲染文章
// let articleRendererInstance = null;

// document.addEventListener('DOMContentLoaded', async function() {
// 	// 等待其他初始化完成
// 	if (window.InitializeLanguageSystem) {
// 		await InitializeLanguageSystem();
// 	}
	
// 	// 延迟初始化菜单系统
// 	setTimeout(() => {
// 		if (window.InitializeMenuSystem) {
// 			InitializeMenuSystem();
// 		}
// 	}, 100);
	
// 	// 创建文章渲染器并渲染文章
// 	articleRendererInstance = new ArticleRenderer();
// 	await articleRendererInstance.renderAllArticles();
// });

// // 监听语言变化事件，重新渲染文章
// document.addEventListener('languageChanged', async function() {
// 	if (articleRendererInstance) {
// 		await articleRendererInstance.reRenderAllArticles();
// 	}
// });