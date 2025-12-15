// Admin Panel JavaScript
const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('authToken');
let currentUser = null;
let socket = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        loadUserData();
    } else {
        showLogin();
    }
    
    setupSocketIO();
    setupForms();
});

// Socket.IO para atualizações em tempo real
function setupSocketIO() {
    socket = io('http://localhost:3000');
    
    socket.on('news-created', (news) => {
        showAlert('Nova notícia publicada!', 'success');
        loadNews();
    });
    
    socket.on('news-updated', (news) => {
        showAlert('Notícia atualizada!', 'success');
        loadNews();
    });
    
    socket.on('news-deleted', () => {
        showAlert('Notícia removida!', 'success');
        loadNews();
    });
    
    socket.on('breaking-news-updated', () => {
        showAlert('Notícia urgente atualizada!', 'success');
    });
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            token = data.token;
            localStorage.setItem('authToken', token);
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showAdmin();
        } else {
            showLoginError(data.message);
        }
    } catch (error) {
        showLoginError('Erro ao fazer login. Verifique se o servidor está rodando.');
    }
});

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function showLogin() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
}

function showAdmin() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    
    if (currentUser) {
        document.getElementById('userGreeting').textContent = `Bem-vindo, ${currentUser.name}`;
        document.getElementById('userRole').textContent = 
            currentUser.role === 'editor-chefe' ? 'Editor Chefe' : 
            `Editor Setorial - ${currentUser.sector}`;
        
        // Mostrar tab de breaking news apenas para Editor Chefe
        if (currentUser.role === 'editor-chefe') {
            document.getElementById('tabBreakingNews').classList.remove('hidden');
        }
    }
    
    loadNews();
}

async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showAdmin();
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showLogin();
}

// Tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tabName === 'myNews') {
        document.getElementById('myNewsTab').classList.add('active');
    } else if (tabName === 'allNews') {
        document.getElementById('allNewsTab').classList.add('active');
    } else if (tabName === 'breakingNews') {
        document.getElementById('breakingNewsTab').classList.add('active');
        loadBreakingNews();
    }
}

// Carregar notícias
async function loadNews() {
    try {
        const response = await fetch(`${API_URL}/news`);
        const data = await response.json();
        
        if (data.success) {
            renderMyNews(data.news);
            renderAllNews(data.news);
        }
    } catch (error) {
        showAlert('Erro ao carregar notícias', 'error');
    }
}

function renderMyNews(allNews) {
    const container = document.getElementById('myNewsList');
    
    let myNews = allNews;
    
    // Filtrar por setor se for Editor Setorial
    if (currentUser.role === 'editor-setorial') {
        myNews = allNews.filter(n => n.category === currentUser.sector);
    }
    
    if (myNews.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">Nenhuma notícia encontrada</p>';
        return;
    }
    
    container.innerHTML = myNews.map(news => createNewsItem(news, true)).join('');
}

function renderAllNews(allNews) {
    const container = document.getElementById('allNewsList');
    
    if (allNews.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">Nenhuma notícia encontrada</p>';
        return;
    }
    
    container.innerHTML = allNews.map(news => createNewsItem(news, false)).join('');
}

function createNewsItem(news, canEdit) {
    const canEditThis = canEdit || currentUser.role === 'editor-chefe';
    const canSetFeatured = currentUser.role === 'editor-chefe';
    
    return `
        <div class="news-item">
            <img src="${news.image}" alt="${news.title}">
            <div class="news-item-content">
                <div class="news-item-title">
                    ${news.title}
                    ${news.featured ? '<span class="featured-badge">⭐ DESTAQUE</span>' : ''}
                </div>
                <div class="news-item-meta">
                    <span>📁 ${news.category}</span>
                    <span>👤 ${news.author}</span>
                    <span>📅 ${formatDate(news.date)}</span>
                    <span>👁️ ${news.views || 0} visualizações</span>
                </div>
                <p>${news.excerpt.substring(0, 150)}...</p>
                <div class="news-item-actions">
                    ${canEditThis ? `
                        <button class="btn-secondary" onclick="openEditModal(${news.id})">✏️ Editar</button>
                        <button class="btn-danger" onclick="deleteNews(${news.id})">🗑️ Excluir</button>
                    ` : ''}
                    ${canSetFeatured ? `
                        <button class="btn-secondary" onclick="toggleFeatured(${news.id}, ${!news.featured})">
                            ${news.featured ? '⭐ Remover Destaque' : '⭐ Marcar Destaque'}
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Modal de notícia
function setupForms() {
    document.getElementById('newsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveNews();
    });
}

function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Nova Notícia';
    document.getElementById('newsId').value = '';
    document.getElementById('newsForm').reset();
    
    // Pré-selecionar categoria do editor setorial
    if (currentUser.role === 'editor-setorial') {
        document.getElementById('newsCategory').value = currentUser.sector;
        document.getElementById('newsCategory').disabled = true;
    } else {
        document.getElementById('newsCategory').disabled = false;
    }
    
    document.getElementById('newsModal').classList.add('active');
}

async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/news/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const news = data.news;
            
            document.getElementById('modalTitle').textContent = 'Editar Notícia';
            document.getElementById('newsId').value = news.id;
            document.getElementById('newsTitle').value = news.title;
            document.getElementById('newsCategory').value = news.category;
            document.getElementById('newsAuthor').value = news.author;
            document.getElementById('newsImage').value = news.image;
            document.getElementById('newsExcerpt').value = news.excerpt;
            document.getElementById('newsContent').value = news.content;
            
            document.getElementById('newsModal').classList.add('active');
        }
    } catch (error) {
        showAlert('Erro ao carregar notícia', 'error');
    }
}

function closeModal() {
    document.getElementById('newsModal').classList.remove('active');
    document.getElementById('newsForm').reset();
}

async function saveNews() {
    const id = document.getElementById('newsId').value;
    const imageFile = document.getElementById('newsImageFile').files[0];
    let imageUrl = document.getElementById('newsImage').value;
    
    // Se houver arquivo de imagem, fazer upload primeiro
    if (imageFile) {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            
            const uploadResponse = await fetch(`${API_URL}/news/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const uploadData = await uploadResponse.json();
            
            if (uploadData.success) {
                imageUrl = `http://localhost:3000${uploadData.imageUrl}`;
            } else {
                showAlert('Erro ao fazer upload da imagem', 'error');
                return;
            }
        } catch (error) {
            showAlert('Erro ao fazer upload da imagem', 'error');
            return;
        }
    }
    
    const newsData = {
        title: document.getElementById('newsTitle').value,
        category: document.getElementById('newsCategory').value,
        author: document.getElementById('newsAuthor').value,
        image: imageUrl || 'https://picsum.photos/800/450?random=' + Date.now(),
        excerpt: document.getElementById('newsExcerpt').value,
        content: document.getElementById('newsContent').value
    };
    
    try {
        const url = id ? `${API_URL}/news/${id}` : `${API_URL}/news`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newsData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(id ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!', 'success');
            closeModal();
            loadNews();
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Erro ao salvar notícia', 'error');
    }
}

async function deleteNews(id) {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;
    
    try {
        const response = await fetch(`${API_URL}/news/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Notícia excluída com sucesso!', 'success');
            loadNews();
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Erro ao excluir notícia', 'error');
    }
}

async function toggleFeatured(id, featured) {
    try {
        const response = await fetch(`${API_URL}/news/${id}/featured`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ featured })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message, 'success');
            loadNews();
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Erro ao atualizar destaque', 'error');
    }
}

// Breaking News
async function loadBreakingNews() {
    try {
        const response = await fetch('../data/news-data.json');
        const data = await response.json();
        document.getElementById('breakingNewsText').value = data.breakingNews || '';
    } catch (error) {
        console.error('Erro ao carregar breaking news');
    }
}

async function updateBreakingNews() {
    const text = document.getElementById('breakingNewsText').value;
    
    try {
        const response = await fetch(`${API_URL}/news/breaking-news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Notícia urgente atualizada!', 'success');
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Erro ao atualizar notícia urgente', 'error');
    }
}

// Utilities
function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    container.appendChild(alert);
    
    setTimeout(() => alert.remove(), 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Preview de imagem
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('imagePreview').style.display = 'none';
    }
}
