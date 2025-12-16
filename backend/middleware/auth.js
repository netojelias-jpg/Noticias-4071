const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Acesso negado. Token não fornecido.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Token inválido ou expirado.' 
        });
    }
};

const isEditorChefe = (req, res, next) => {
    if (req.user.role !== 'editor-chefe') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. Apenas Editor Chefe pode realizar esta ação.' 
        });
    }
    next();
};

const isEditorSetorial = (req, res, next) => {
    if (req.user.role !== 'editor-setorial' && req.user.role !== 'editor-chefe') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. Apenas editores podem realizar esta ação.' 
        });
    }
    next();
};

const canEditNews = async (req, res, next) => {
    try {
        const NewsModel = require('../models/News');
        const newsId = req.params.id;
        const news = await NewsModel.findById(newsId);
        
        if (!news) {
            return res.status(404).json({ 
                success: false, 
                message: 'Notícia não encontrada.' 
            });
        }

        // Editor Chefe pode editar tudo
        if (req.user.role === 'editor-chefe') {
            return next();
        }

        // Editor Setorial só pode editar notícias do seu setor
        if (req.user.role === 'editor-setorial' && news.category === req.user.sector) {
            return next();
        }

        return res.status(403).json({ 
            success: false, 
            message: 'Você não tem permissão para editar esta notícia.' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao verificar permissões.' 
        });
    }
};

module.exports = {
    auth,
    isEditorChefe,
    isEditorSetorial,
    canEditNews,
    canPublishBreakingNews
};
