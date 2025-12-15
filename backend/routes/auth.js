const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validação
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email e senha são obrigatórios.' 
            });
        }

        // Buscar usuário
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciais inválidas.' 
            });
        }

        // Verificar senha
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciais inválidas.' 
            });
        }

        // Gerar token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                sector: user.sector 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                sector: user.sector
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao realizar login.' 
        });
    }
});

// Registro (apenas para testes - em produção deve ser restrito)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, sector } = req.body;

        // Validação
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                success: false, 
                message: 'Todos os campos são obrigatórios.' 
            });
        }

        // Verificar se usuário já existe
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email já cadastrado.' 
            });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role,
            sector: role === 'editor-setorial' ? sector : null
        });

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                sector: user.sector
            }
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao criar usuário.' 
        });
    }
});

module.exports = router;
