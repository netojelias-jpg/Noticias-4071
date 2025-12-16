// ===== Global Variables =====
let allNews = [];
let filteredNews = [];
let currentCategory = 'todas';
let newsPerPage = 9;
let currentPage = 1;
let socket = null;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupSocketIO();
    setupMobileMenu();
});

async function initializeApp() {
    updateCurrentDate();
    await loadNewsData();
    setupEventListeners();
    displayNews();
    updateMostRead();
    updateCategoryList();
}

// ===== Socket.IO - Atualizações em Tempo Real =====
function setupSocketIO() {
    try {
        socket = io('http://localhost:3000');
        
        socket.on('connect', () => {
            console.log('Conectado ao servidor de atualizações');
        });
        
        socket.on('news-created', (news) => {
            console.log('Nova notícia criada:', news);
            allNews.unshift(news);
            filteredNews = [...allNews];
            displayNews();
            updateMostRead();
            updateCategoryList();
            showNotification('Nova notícia publicada!');
        });
        
        socket.on('news-updated', (news) => {
            console.log('Notícia atualizada:', news);
            const index = allNews.findIndex(n => n.id === news.id);
            if (index !== -1) {
                allNews[index] = news;
                filteredNews = [...allNews];
                displayNews();
                updateMostRead();
            }
        });
        
        socket.on('news-deleted', ({ id }) => {
            console.log('Notícia deletada:', id);
            allNews = allNews.filter(n => n.id !== id);
            filteredNews = [...allNews];
            displayNews();
            updateMostRead();
            updateCategoryList();
        });
        
        socket.on('news-featured', (news) => {
            console.log('Destaque atualizado:', news);
            const index = allNews.findIndex(n => n.id === news.id);
            if (index !== -1) {
                allNews[index] = news;
                filteredNews = [...allNews];
                displayNews();
            }
        });
        
        socket.on('breaking-news-updated', ({ text }) => {
            console.log('Breaking news atualizada:', text);
            displayBreakingNews(text);
        });
        
        socket.on('comment-added', ({ newsId, comment }) => {
            console.log('Novo comentário:', newsId, comment);
            const newsIndex = allNews.findIndex(n => n.id === newsId);
            if (newsIndex !== -1) {
                if (!allNews[newsIndex].comments) {
                    allNews[newsIndex].comments = [];
                }
                allNews[newsIndex].comments.push(comment);
                
                // Atualizar modal se estiver aberto
                const commentsList = document.getElementById(`comments-${newsId}`);
                if (commentsList) {
                    commentsList.innerHTML = renderComments(allNews[newsIndex].comments);
                }
            }
        });
        
        socket.on('news-liked', ({ newsId, likes }) => {
            console.log('Notícia curtida:', newsId, likes);
            const newsIndex = allNews.findIndex(n => n.id === newsId);
            if (newsIndex !== -1) {
                allNews[newsIndex].likes = likes;
                
                // Atualizar modal se estiver aberto
                const likesElement = document.getElementById(`likes-${newsId}`);
                if (likesElement) {
                    likesElement.textContent = likes;
                }
            }
        });
        
        socket.on('disconnect', () => {
            console.log('Desconectado do servidor');
        });
    } catch (error) {
        console.log('Socket.IO não disponível, modo estático');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Date Display =====
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', options);
    dateElement.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

// ===== Load News Data =====
async function loadNewsData() {
    try {
        // Tentar carregar da API primeiro
        const response = await fetch('http://localhost:3000/api/news');
        if (!response.ok) {
            throw new Error('API não disponível');
        }
        const data = await response.json();
        
        if (data.success) {
            allNews = data.news;
            filteredNews = [...allNews];
            
            // Carregar breaking news
            const newsDataResponse = await fetch('data/news-data.json');
            if (newsDataResponse.ok) {
                const newsData = await newsDataResponse.json();
                if (newsData.breakingNews) {
                    displayBreakingNews(newsData.breakingNews);
                }
            }
            return;
        }
    } catch (error) {
        console.log('API não disponível, carregando do JSON estático...');
    }
    
    // Fallback para JSON estático
    try {
        const response = await fetch('data/news-data.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar notícias');
        }
        const data = await response.json();
        allNews = data.news;
        filteredNews = [...allNews];
        
        // Display breaking news if available
        if (data.breakingNews) {
            displayBreakingNews(data.breakingNews);
        }
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        // Fallback to sample data if JSON file doesn't exist
        loadSampleData();
    }
}

function loadSampleData() {
    allNews = generateSampleNews();
    filteredNews = [...allNews];
}

// ===== Display Breaking News =====
function displayBreakingNews(breakingNews) {
    const breakingText = document.getElementById('breakingText');
    breakingText.textContent = breakingNews;
}

// ===== Display News =====
function displayNews() {
    displayFeaturedStory();
    displaySecondaryStories();
    displayNewsGrid();
}

function displayFeaturedStory() {
    const featuredContainer = document.getElementById('featuredStory');
    const featured = filteredNews[0];
    
    if (!featured) return;
    
    featuredContainer.innerHTML = `
        <img src="${featured.image}" alt="${featured.title}" class="featured-image" onerror="this.src='https://via.placeholder.com/800x450?text=Imagem+Indisponível'">
        <div class="featured-content">
            <span class="featured-category">${featured.category}</span>
            <h2 class="featured-title">${featured.title}</h2>
            <p class="featured-excerpt">${featured.excerpt}</p>
            <div class="article-meta">
                <span class="article-author">Por ${featured.author}</span>
                <span class="article-date">${formatDate(featured.date)}</span>
            </div>
        </div>
    `;
    
    featuredContainer.addEventListener('click', () => {
        showArticleDetail(featured);
    });
}

function displaySecondaryStories() {
    const secondaryContainer = document.getElementById('secondaryStories');
    const secondaryNews = filteredNews.slice(1, 3);
    
    secondaryContainer.innerHTML = secondaryNews.map(news => `
        <article class="secondary-story" onclick="showArticleDetail(${JSON.stringify(news).replace(/"/g, '&quot;')})">
            <img src="${news.image}" alt="${news.title}" class="secondary-image" onerror="this.src='https://via.placeholder.com/400x200?text=Imagem+Indisponível'">
            <div class="secondary-content">
                <span class="secondary-category">${news.category}</span>
                <h3 class="secondary-title">${news.title}</h3>
                <div class="article-meta">
                    <span class="article-date">${formatDate(news.date)}</span>
                </div>
            </div>
        </article>
    `).join('');
}

function displayNewsGrid() {
    const newsGrid = document.getElementById('newsGrid');
    const startIndex = 3 + ((currentPage - 1) * newsPerPage);
    const endIndex = startIndex + newsPerPage;
    const newsToDisplay = filteredNews.slice(3, endIndex);
    
    if (currentPage === 1) {
        newsGrid.innerHTML = '';
    }
    
    newsToDisplay.forEach(news => {
        const newsCard = createNewsCard(news);
        newsGrid.appendChild(newsCard);
        // Add fade-in animation
        setTimeout(() => newsCard.classList.add('fade-in'), 10);
    });
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (endIndex >= filteredNews.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function createNewsCard(news) {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.innerHTML = `
        <img src="${news.image}" alt="${news.title}" class="news-image" onerror="this.src='https://via.placeholder.com/400x180?text=Imagem+Indisponível'">
        <div class="news-content">
            <span class="news-category">${news.category}</span>
            <h3 class="news-title">${news.title}</h3>
            <p class="news-excerpt">${news.excerpt.substring(0, 100)}...</p>
            <div class="news-meta">${formatDate(news.date)}</div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        showArticleDetail(news);
    });
    
    return card;
}

// ===== Most Read Section =====
function updateMostRead() {
    const mostReadContainer = document.getElementById('mostReadList');
    const mostRead = [...allNews]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    
    mostReadContainer.innerHTML = mostRead.map((news, index) => `
        <div class="most-read-item" onclick="showArticleDetail(${JSON.stringify(news).replace(/"/g, '&quot;')})">
            <div class="most-read-number">${index + 1}</div>
            <div class="most-read-content">
                <div class="most-read-title">${news.title}</div>
                <div class="most-read-category">${news.category}</div>
            </div>
        </div>
    `).join('');
}

// ===== Category List =====
function updateCategoryList() {
    const categoryContainer = document.getElementById('categoryList');
    const categories = {};
    
    allNews.forEach(news => {
        categories[news.category] = (categories[news.category] || 0) + 1;
    });
    
    categoryContainer.innerHTML = Object.entries(categories)
        .sort(([, a], [, b]) => b - a)
        .map(([category, count]) => `
            <div class="category-item" data-category="${category.toLowerCase()}">
                <span class="category-name">${category}</span>
                <span class="category-count">(${count})</span>
            </div>
        `).join('');
    
    // Add click listeners to category items
    categoryContainer.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            filterByCategory(item.dataset.category);
        });
    });
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Navigation category filters
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            filterByCategory(category);
            
            // Update active state
            document.querySelectorAll('.nav-list a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        displayNewsGrid();
    });
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        alert(`Obrigado por se inscrever! Confirmaremos em breve no e-mail: ${email}`);
        e.target.reset();
    });
}

// ===== Filter Functions =====
function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    if (category === 'todas') {
        filteredNews = [...allNews];
    } else {
        filteredNews = allNews.filter(news => 
            news.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    displayNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function performSearch(query) {
    if (!query.trim()) {
        filteredNews = [...allNews];
    } else {
        const searchTerm = query.toLowerCase();
        filteredNews = allNews.filter(news => 
            news.title.toLowerCase().includes(searchTerm) ||
            news.excerpt.toLowerCase().includes(searchTerm) ||
            news.content.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Article Detail Modal =====
function showArticleDetail(news) {
    // Increment views
    incrementViews(news.id);
    news.views = (news.views || 0) + 1;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'article-modal';
    modal.id = `modal-${news.id}`;
    modal.innerHTML = `
        <div class="article-modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            <img src="${news.image}" alt="${news.title}" class="modal-image" onerror="this.src='https://via.placeholder.com/800x400?text=Imagem+Indisponível'">
            <div class="modal-body">
                <span class="featured-category">${news.category}</span>
                <h1 class="modal-title">${news.title}</h1>
                <div class="article-meta">
                    <span class="article-author">Por ${news.author}</span>
                    <span class="article-date">${formatDate(news.date)}</span>
                    <span class="article-date">${news.views} visualizações</span>
                </div>
                <div class="modal-content-text">
                    <p>${news.content}</p>
                </div>
                
                <!-- Curtidas -->
                <div class="article-actions">
                    <button class="like-button" onclick="likeArticle(${news.id})">
                        ❤️ Curtir (<span id="likes-${news.id}">${news.likes || 0}</span>)
                    </button>
                </div>
                
                <!-- Comentários -->
                <div class="comments-section">
                    <h3>Comentários (${(news.comments || []).length})</h3>
                    <div class="comment-form">
                        <input type="text" id="comment-author-${news.id}" placeholder="Seu nome" required>
                        <textarea id="comment-text-${news.id}" placeholder="Escreva um comentário..." required></textarea>
                        <button onclick="addComment(${news.id})">Publicar Comentário</button>
                    </div>
                    <div class="comments-list" id="comments-${news.id}">
                        ${renderComments(news.comments || [])}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .article-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            overflow-y: auto;
            padding: 2rem;
        }
        .article-modal-content {
            background-color: white;
            max-width: 900px;
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 10;
            transition: background-color 0.3s;
        }
        .modal-close:hover {
            background-color: #c8102e;
        }
        .modal-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
        }
        .modal-body {
            padding: 2rem;
        }
        .modal-title {
            font-family: var(--font-serif);
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin: 1rem 0;
        }
        .modal-content-text {
            font-size: 1.125rem;
            line-height: 1.8;
            margin-top: 2rem;
            color: #333;
        }
        .modal-content-text p {
            margin-bottom: 1.5rem;
        }
        .article-actions {
            margin: 2rem 0;
            padding: 1rem 0;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
        }
        .like-button {
            padding: 0.75rem 1.5rem;
            background-color: #c8102e;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .like-button:hover {
            background-color: #a00d25;
        }
        .comments-section {
            margin-top: 2rem;
        }
        .comments-section h3 {
            font-family: var(--font-serif);
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        .comment-form {
            background: #f8f8f8;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        .comment-form input, .comment-form textarea {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: var(--font-sans);
        }
        .comment-form textarea {
            min-height: 100px;
            resize: vertical;
        }
        .comment-form button {
            padding: 0.75rem 1.5rem;
            background-color: #004a99;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .comment-form button:hover {
            background-color: #003a77;
        }
        .comments-list {
            margin-top: 1rem;
        }
        .comment-item {
            background: #f8f8f8;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .comment-author {
            font-weight: 600;
            color: #1a1a1a;
        }
        .comment-date {
            color: #666;
            font-size: 0.875rem;
        }
        .comment-text {
            color: #333;
            line-height: 1.6;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===== Utility Functions =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
}

// ===== Comments and Likes =====
function renderComments(comments) {
    if (!comments || comments.length === 0) {
        return '<p style="color: #666; text-align: center;">Seja o primeiro a comentar!</p>';
    }
    
    return comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${formatDate(comment.createdAt)}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `).join('');
}

async function addComment(newsId) {
    const authorInput = document.getElementById(`comment-author-${newsId}`);
    const textInput = document.getElementById(`comment-text-${newsId}`);
    
    const author = authorInput.value.trim();
    const text = textInput.value.trim();
    
    if (!author || !text) {
        alert('Por favor, preencha seu nome e o comentário.');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/news/${newsId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ author, text })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Limpar formulário
            authorInput.value = '';
            textInput.value = '';
            
            // Atualizar notícia local
            const newsIndex = allNews.findIndex(n => n.id === newsId);
            if (newsIndex !== -1) {
                if (!allNews[newsIndex].comments) {
                    allNews[newsIndex].comments = [];
                }
                allNews[newsIndex].comments.push(data.comment);
                
                // Atualizar lista de comentários
                const commentsList = document.getElementById(`comments-${newsId}`);
                if (commentsList) {
                    commentsList.innerHTML = renderComments(allNews[newsIndex].comments);
                }
            }
            
            showNotification('Comentário publicado com sucesso!');
        } else {
            alert(data.message || 'Erro ao publicar comentário.');
        }
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        alert('Erro ao publicar comentário. Tente novamente.');
    }
}

async function likeArticle(newsId) {
    try {
        const response = await fetch(`http://localhost:3000/api/news/${newsId}/like`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Atualizar contador de curtidas
            const likesElement = document.getElementById(`likes-${newsId}`);
            if (likesElement) {
                likesElement.textContent = data.likes;
            }
            
            // Atualizar notícia local
            const newsIndex = allNews.findIndex(n => n.id === newsId);
            if (newsIndex !== -1) {
                allNews[newsIndex].likes = data.likes;
            }
            
            showNotification('Obrigado por curtir!');
        } else {
            alert(data.message || 'Erro ao curtir notícia.');
        }
    } catch (error) {
        console.error('Erro ao curtir notícia:', error);
        alert('Erro ao curtir notícia. Tente novamente.');
    }
}

async function incrementViews(newsId) {
    try {
        await fetch(`http://localhost:3000/api/news/${newsId}/view`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Erro ao incrementar visualizações:', error);
    }
}


// ===== Sample Data Generator =====
function generateSampleNews() {
    const categories = ['Economia', 'Política', 'Tecnologia', 'Esportes', 'Cultura', 'Mundo'];
    const authors = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira', 'Juliana Lima'];
    
    const sampleTitles = [
        'Mercado financeiro registra alta histórica neste trimestre',
        'Nova lei de incentivo à tecnologia é aprovada no Senado',
        'Inteligência artificial revoluciona setor de atendimento ao cliente',
        'Campeonato brasileiro: time local conquista vitória importante',
        'Exposição de arte contemporânea atrai milhares de visitantes',
        'Acordo internacional promete reduzir emissões de carbono',
        'Startups brasileiras recebem investimento recorde',
        'Reforma tributária entra em nova fase de discussão',
        'Aplicativo nacional de mobilidade expande para 50 cidades',
        'Atleta brasileiro quebra recorde em competição internacional',
        'Festival de música reúne artistas de todo o país',
        'Mudanças climáticas: cientistas alertam para urgência de ação',
        'Cooperativas de crédito crescem 25% no último ano',
        'Eleições municipais: candidatos apresentam propostas',
        'Robótica e automação transformam indústria manufatureira',
        'Copa do mundo: seleção brasileira se prepara para estreia',
        'Cinema nacional ganha destaque em festival internacional',
        'ONU apresenta novo relatório sobre desenvolvimento sustentável'
    ];
    
    return sampleTitles.map((title, index) => ({
        id: index + 1,
        title: title,
        category: categories[index % categories.length],
        author: authors[index % authors.length],
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        image: `https://picsum.photos/800/450?random=${index + 1}`,
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
        views: Math.floor(Math.random() * 10000)
    }));
}

// Make showArticleDetail available globally
window.showArticleDetail = showArticleDetail;

// ===== Mobile Menu =====
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}
