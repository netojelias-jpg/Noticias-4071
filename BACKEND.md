# Backend - Sistema de Gerenciamento de Notícias

## 🚀 Como Executar

### 1. Instalar Dependências

```powershell
npm install
```

### 2. Iniciar o Servidor

**Modo desenvolvimento (com auto-reload):**
```powershell
npm run dev
```

**Modo produção:**
```powershell
npm start
```

O servidor iniciará em: `http://localhost:3000`

## 📌 Endpoints da API

### Autenticação

- **POST** `/api/auth/login` - Login
- **POST** `/api/auth/register` - Registrar novo usuário (apenas para testes)

### Notícias

- **GET** `/api/news` - Listar todas as notícias
- **GET** `/api/news/:id` - Buscar notícia por ID
- **POST** `/api/news` - Criar notícia (requer autenticação)
- **PUT** `/api/news/:id` - Atualizar notícia (requer autenticação)
- **DELETE** `/api/news/:id` - Deletar notícia (requer autenticação)
- **PATCH** `/api/news/:id/featured` - Marcar/desmarcar destaque (apenas Editor Chefe)
- **POST** `/api/news/breaking-news` - Atualizar notícia urgente (apenas Editor Chefe)
- **POST** `/api/news/:id/view` - Incrementar visualizações

### Usuários

- **GET** `/api/users` - Listar usuários (apenas Editor Chefe)
- **GET** `/api/users/me` - Dados do usuário logado

## 👥 Usuários de Teste

| Email | Senha | Perfil | Setor |
|-------|-------|--------|-------|
| chefe@4071.com.br | admin123 | Editor Chefe | Todos |
| ti@4071.com.br | admin123 | Editor Setorial | Tecnologia da Informação |
| marketing@4071.com.br | admin123 | Editor Setorial | Marketing |

## 🔐 Permissões

### Editor Chefe
- ✅ Criar, editar e excluir notícias de TODOS os setores
- ✅ Marcar/desmarcar notícias como destaque
- ✅ Atualizar notícia urgente (Breaking News)
- ✅ Gerenciar usuários

### Editor Setorial
- ✅ Criar, editar e excluir notícias do SEU setor
- ❌ Não pode marcar como destaque
- ❌ Não pode atualizar breaking news
- ❌ Não pode editar notícias de outros setores

## 🔄 Atualizações em Tempo Real

O sistema utiliza **Socket.IO** para atualizar a página principal automaticamente quando:
- ✨ Nova notícia é criada
- ✏️ Notícia é atualizada
- 🗑️ Notícia é deletada
- ⭐ Notícia é marcada/desmarcada como destaque
- 🚨 Notícia urgente é atualizada

## 📦 Estrutura do Backend

```
backend/
├── models/         # Modelos de dados (User, News)
├── routes/         # Rotas da API (auth, news, users)
├── controllers/    # Lógica de negócios
├── middleware/     # Middlewares (autenticação, etc)
└── database/       # Configuração do banco de dados
```

## 🔧 Configuração

Edite o arquivo `.env` para personalizar:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

## 📝 Notas Importantes

1. **Banco de Dados**: Atualmente usa armazenamento em memória e arquivo JSON. Para produção, integre com MongoDB, PostgreSQL ou outro banco real.

2. **Autenticação**: Tokens JWT expiram em 24 horas.

3. **Imagens**: URLs são armazenadas como texto. Para produção, implemente upload real de arquivos.

4. **CORS**: Configurado para aceitar todas as origens em desenvolvimento. Restrinja em produção.

## 🎯 Próximos Passos para Produção

- [ ] Integrar banco de dados real (MongoDB/PostgreSQL)
- [ ] Implementar upload de imagens
- [ ] Adicionar paginação na API
- [ ] Implementar rate limiting
- [ ] Configurar HTTPS
- [ ] Adicionar logs de auditoria
- [ ] Implementar cache (Redis)
- [ ] Testes automatizados
