// ===== Global Variables =====
let allNews = [];
let filteredNews = [];
let currentCategory = 'todas';
let newsPerPage = 9;
let currentPage = 1;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    updateCurrentDate();
    await loadNewsData();
    setupEventListeners();
    displayNews();
    updateMostRead();
    updateCategoryList();
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
    news.views = (news.views || 0) + 1;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'article-modal';
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
