const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const { auth, isEditorChefe } = require('../middleware/auth');

// Listar todos os usuários (apenas Editor Chefe)
router.get('/', auth, isEditorChefe, async (req, res) => {
    try {
        const users = await UserModel.findAll();
        
        // Não enviar senhas
        const safeUsers = users.map(({ password, ...user }) => user);

        res.json({
            success: true,
            users: safeUsers
        });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao buscar usuários.' 
        });
    }
});

// Buscar usuário atual
router.get('/me', auth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuário não encontrado.' 
            });
        }

        const { password, ...safeUser } = user;

        res.json({
            success: true,
            user: safeUser
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao buscar usuário.' 
        });
    }
});

// Deletar usuário (apenas Editor Chefe)
router.delete('/:id', auth, isEditorChefe, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Não permitir que o usuário delete a si mesmo
        if (userId === req.user.id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Você não pode excluir seu próprio usuário.' 
            });
        }
        
        const deleted = await UserModel.delete(userId);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuário não encontrado.' 
            });
        }

        res.json({
            success: true,
            message: 'Usuário excluído com sucesso.'
        });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao excluir usuário.' 
        });
    }
});

module.exports = router;
