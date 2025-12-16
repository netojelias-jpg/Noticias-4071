const express = require('express');
const router = express.Router();
const NewsModel = require('../models/News');
const { auth, isEditorChefe, isEditorSetorial, canEditNews, canPublishBreakingNews } = require('../middleware/auth');const upload = require('../middleware/upload');
// Listar todas as notícias (público)
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let news = await NewsModel.findAll();

        // Filtrar por categoria
        if (category && category !== 'todas') {
            news = news.filter(n => n.category.toLowerCase() === category.toLowerCase());
        }

        // Buscar por texto
        if (search) {
            const searchLower = search.toLowerCase();
            news = news.filter(n => 
                n.title.toLowerCase().includes(searchLower) ||
                n.excerpt.toLowerCase().includes(searchLower) ||
                n.content.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            success: true,
            news
        });
    } catch (error) {
        console.error('Erro ao listar notícias:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao buscar notícias.' 
        });
    }
});

// Buscar notícia por ID (público)
router.get('/:id', async (req, res) => {
    try {
        const news = await NewsModel.findById(req.params.id);
        
        if (!news) {
            return res.status(404).json({ 
                success: false, 
                message: 'Notícia não encontrada.' 
            });
        }

        res.json({
            success: true,
            news
        });
    } catch (error) {
        console.error('Erro ao buscar notícia:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao buscar notícia.' 
        });
    }
});

// Incrementar visualizações (público)
router.post('/:id/view', async (req, res) => {
    try {
        const news = await NewsModel.incrementViews(req.params.id);
        
        if (!news) {
            return res.status(404).json({ 
                success: false, 
                message: 'Notícia não encontrada.' 
            });
        }

        res.json({
            success: true,
            views: news.views
        });
    } catch (error) {
        console.error('Erro ao incrementar views:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar visualizações.' 
        });
    }
});

// Criar notícia (Editor Setorial e Editor Chefe)
router.post('/', auth, isEditorSetorial, async (req, res) => {
    try {
        const { title, category, excerpt, content, image, author } = req.body;

        // Validação
        if (!title || !category || !excerpt || !content) {
            return res.status(400).json({ 
                success: false, 
                message: 'Título, categoria, resumo e conteúdo são obrigatórios.' 
            });
        }

        // Editor Setorial só pode criar notícias do seu setor
        if (req.user.role === 'editor-setorial' && category !== req.user.sector) {
            return res.status(403).json({ 
                success: false, 
                message: 'Você só pode criar notícias do seu setor.' 
            });
        }

        const newsData = {
            title,
            category,
            excerpt,
            content,
            image: image || 'https://picsum.photos/800/450?random=' + Date.now(),
            author: author || req.user.name,
            date: new Date().toISOString()
        };

        const news = await NewsModel.create(newsData);

        // Notificar via Socket.io
        const io = req.app.get('io');
        io.emit('news-created', news);

        res.status(201).json({
            success: true,
            message: 'Notícia criada com sucesso!',
            news
        });
    } catch (error) {
        console.error('Erro ao criar notícia:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao criar notícia.' 
        });
    }
});

// Atualizar notícia (Editor do mesmo setor ou Editor Chefe)
router.put('/:id', auth, isEditorSetorial, canEditNews, async (req, res) => {
    try {
        const { title, category, excerpt, content, image, author } = req.body;

        const updates = {};
        if (title) updates.title = title;
        if (category) updates.category = category;
        if (excerpt) updates.excerpt = excerpt;
        if (content) updates.content = content;
        if (image) updates.image = image;
        if (author) updates.author = author;

        const news = await NewsModel.update(req.params.id, updates);

        // Notificar via Socket.io
        const io = req.app.get('io');
        io.emit('news-updated', news);

        res.json({
            success: true,
            message: 'Notícia atualizada com sucesso!',
            news
        });
    } catch (error) {
        console.error('Erro ao atualizar notícia:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar notícia.' 
        });
    }
});

// Deletar notícia (Editor do mesmo setor ou Editor Chefe)
router.delete('/:id', auth, isEditorSetorial, canEditNews, async (req, res) => {
    try {
        const success = await NewsModel.delete(req.params.id);

        if (!success) {
            return res.status(404).json({ 
                success: false, 
                message: 'Notícia não encontrada.' 
            });
        }

        // Notificar via Socket.io
        const io = req.app.get('io');
        io.emit('news-deleted', { id: req.params.id });

        res.json({
            success: true,
            message: 'Notícia deletada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao deletar notícia:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao deletar notícia.' 
        });
    }
});

// Marcar/desmarcar como destaque (apenas Editor Chefe)
router.patch('/:id/featured', auth, isEditorChefe, async (req, res) => {
    try {
        const { featured } = req.body;

        const news = await NewsModel.setFeatured(req.params.id, featured);

        if (!news) {
            return res.status(404).json({ 
                success: false, 
                message: 'Notícia não encontrada.' 
            });
        }

        // Notificar via Socket.io
        const io = req.app.get('io');
        io.emit('news-featured', news);

        res.json({
            success: true,
            message: featured ? 'Notícia marcada como destaque!' : 'Notícia desmarcada como destaque.',
            news
        });
    } catch (error) {
        console.error('Erro ao atualizar destaque:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar destaque.' 
        });
    }
});

// Atualizar notícia urgente (Editor Chefe ou usuários com permissão)
router.post('/breaking-news', auth, canPublishBreakingNews, async (req, res) => {
    try {
        const { text } = req.body;

        await NewsModel.setBreakingNews(text || '');

        // Notificar via Socket.io
        const io = req.app.get('io');
        io.emit('breaking-news-updated', { text });

        res.json({
            success: true,
            message: 'Notícia urgente atualizada!',
            breakingNews: text
        });
    } catch (error) {
        console.error('Erro ao atualizar breaking news:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar notícia urgente.' 
        });
    }
});

// Upload de imagem
router.post('/upload', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nenhuma imagem foi enviada' 
            });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ 
            success: true,
            message: 'Imagem enviada com sucesso', 
            imageUrl: imageUrl 
        });
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao fazer upload da imagem' 
        });
    }
});

// Curtir notícia
router.post('/:id/like', async (req, res) => {
    try {
        const news = await NewsModel.addLike(req.params.id);
        
        if (!news) {
            return res.status(404).json({ 
                success: false, 
                message: 'Notícia não encontrada.' 
            });
        }

        // Notificar via Socket.io
        const io = req.app.get('io');
        io.emit('news-liked', { newsId: news.id, likes: news.likes });

        res.json({
            success: true,
            likes: news.likes
        });
    } catch (error) {
        console.error('Erro ao curtir notícia:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao curtir notícia.' 
        });
    }
});

// Adicionar comentário
router.post('/:id/comments', async (req, res) => {
    try {
        const { author, text } = req.body;

        if (!author || !text) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nome e comentário são obrigatórios.' 
            });
        }

        const comment = await NewsModel.addComment(req.params.id, { author, text });
        
        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Notícia não encontrada.' 
            });
        }

        // Notificar via Socket.io
        const io = req.app.get('io');
        io.emit('comment-added', { newsId: parseInt(req.params.id), comment });

        res.json({
            success: true,
            comment
        });
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao adicionar comentário.' 
        });
    }
});

// Deletar comentário
router.delete('/:newsId/comments/:commentId', async (req, res) => {
    try {
        const success = await NewsModel.deleteComment(req.params.newsId, req.params.commentId);
        
        if (!success) {
            return res.status(404).json({ 
                success: false, 
                message: 'Comentário não encontrado.' 
            });
        }

        // Notificar via Socket.io
        const io = req.app.get('io');
        io.emit('comment-deleted', { 
            newsId: parseInt(req.params.newsId), 
            commentId: parseInt(req.params.commentId) 
        });

        res.json({
            success: true,
            message: 'Comentário excluído com sucesso.'
        });
    } catch (error) {
        console.error('Erro ao deletar comentário:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao deletar comentário.' 
        });
    }
});

module.exports = router;
