# 📋 Funcionalidades do Portal de Notícias 4071

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação e Autorização
- [x] Sistema de login com JWT
- [x] Dois níveis de acesso:
  - **Editor Chefe**: Acesso total + destaque de notícias + notícia urgente
  - **Editor Setorial**: Acesso limitado ao seu setor específico
- [x] Tokens com expiração de 24 horas
- [x] Senhas criptografadas com bcrypt

### 📰 Gerenciamento de Notícias
- [x] CRUD completo (Criar, Ler, Atualizar, Deletar)
- [x] 12 categorias (setores da cooperativa)
- [x] Sistema de destaque para notícias principais
- [x] Banner de notícia urgente (Editor Chefe)
- [x] Contador de visualizações
- [x] Upload real de imagens
- [x] Suporte a URLs de imagens externas

### 📤 Upload de Imagens
- [x] Upload de arquivos de imagem (JPEG, PNG, GIF, WebP)
- [x] Limite de tamanho: 5MB
- [x] Preview de imagem antes do envio
- [x] Armazenamento local em `/uploads`
- [x] Geração automática de nomes únicos com timestamp

### ❤️ Sistema de Curtidas
- [x] Botão de curtida em cada notícia
- [x] Contador de curtidas em tempo real
- [x] Atualização via Socket.IO para todos os usuários conectados

### 💬 Sistema de Comentários
- [x] Formulário de comentários público (sem necessidade de login)
- [x] Campos: Nome do autor + Texto do comentário
- [x] Exibição de data/hora do comentário
- [x] Atualização em tempo real via Socket.IO
- [x] Listagem de todos os comentários de uma notícia

### 🔴 Atualizações em Tempo Real (Socket.IO)
- [x] Nova notícia publicada
- [x] Notícia atualizada
- [x] Notícia excluída
- [x] Destaque alterado
- [x] Notícia urgente atualizada
- [x] Novo comentário adicionado
- [x] Notícia curtida

### 🎨 Interface do Usuário
- [x] Design responsivo (mobile, tablet, desktop)
- [x] Visual estilo jornal clássico
- [x] Filtro por categoria
- [x] Busca por texto
- [x] Paginação (carregar mais notícias)
- [x] Modal de leitura completa
- [x] Sidebar com notícias mais lidas
- [x] Newsletter (interface)

### 👨‍💼 Painel Administrativo
- [x] Dashboard com tabs
- [x] Minhas Notícias (editor setorial vê apenas suas)
- [x] Todas as Notícias (visualização completa)
- [x] Notícia Urgente (apenas Editor Chefe)
- [x] Formulário de criação/edição
- [x] Upload de imagens no formulário
- [x] Preview de imagem antes de salvar
- [x] Botões de ação (Editar, Excluir, Marcar Destaque)

## 📊 Estrutura de Dados

### Notícia
```json
{
  "id": 1,
  "title": "Título da Notícia",
  "category": "Tecnologia da Informação",
  "author": "João Silva",
  "date": "2025-01-15T10:30:00.000Z",
  "image": "/uploads/1737024000000-abc123.jpg",
  "excerpt": "Resumo da notícia...",
  "content": "Conteúdo completo da notícia...",
  "views": 150,
  "featured": false,
  "likes": 25,
  "comments": [
    {
      "id": 1737024100000,
      "author": "Maria Santos",
      "text": "Ótima notícia!",
      "createdAt": "2025-01-15T10:35:00.000Z"
    }
  ],
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

### Usuários de Teste
```
Editor Chefe:
- Email: chefe@4071.com.br
- Senha: admin123
- Setor: Todos

Editor TI:
- Email: ti@4071.com.br
- Senha: admin123
- Setor: Tecnologia da Informação

Editor Marketing:
- Email: marketing@4071.com.br
- Senha: admin123
- Setor: Marketing
```

## 🚀 Como Usar

### Página Pública (http://localhost:3000)
1. Navegue pelas categorias no menu superior
2. Use a busca para encontrar notícias específicas
3. Clique em uma notícia para ler o conteúdo completo
4. Curta notícias que você gostar
5. Deixe comentários nas notícias

### Painel Admin (http://localhost:3000/admin)
1. Faça login com credenciais de editor
2. Vá para "Minhas Notícias" para gerenciar seu conteúdo
3. Clique em "Nova Notícia" para criar
4. Escolha entre upload de imagem ou URL
5. Preencha os campos obrigatórios
6. Salve a notícia

#### Editor Chefe Adicional
- Pode editar/excluir qualquer notícia
- Pode marcar/desmarcar notícias como destaque
- Pode definir notícia urgente no banner superior

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js 18+
- Express.js 4.18.2
- Socket.IO 4.6.1
- JWT (jsonwebtoken 9.0.2)
- bcrypt (bcryptjs 2.4.3)
- Multer 1.4.5-lts.1

### Frontend
- HTML5 semântico
- CSS3 (Grid, Flexbox, Variables)
- Vanilla JavaScript (ES6+)
- Socket.IO Client
- Google Fonts (Merriweather, Roboto)

### Armazenamento
- Sistema de arquivos (JSON)
- Uploads locais em `/uploads`

## 📁 Estrutura de Arquivos

```
/
├── backend/
│   ├── middleware/
│   │   ├── auth.js         # Autenticação JWT
│   │   └── upload.js       # Configuração Multer
│   ├── models/
│   │   ├── News.js         # Modelo de notícias
│   │   └── User.js         # Modelo de usuários
│   └── routes/
│       ├── auth.js         # Rotas de autenticação
│       ├── news.js         # Rotas de notícias
│       └── users.js        # Rotas de usuários
├── admin/
│   ├── index.html          # Painel administrativo
│   └── admin.js            # Lógica do admin
├── css/
│   └── styles.css          # Estilos principais
├── js/
│   └── app.js              # Lógica do frontend
├── data/
│   └── news-data.json      # Base de dados
├── uploads/                # Imagens enviadas
├── index.html              # Página principal
├── server.js               # Servidor Express
├── package.json            # Dependências
├── .env                    # Variáveis de ambiente
├── .gitignore              # Arquivos ignorados
├── README.md               # Documentação principal
├── BACKEND.md              # Documentação do backend
└── FEATURES.md             # Este arquivo
```

## 🔄 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário

### Notícias
- `GET /api/news` - Listar todas as notícias
- `GET /api/news/:id` - Buscar notícia por ID
- `POST /api/news` - Criar notícia (autenticado)
- `PUT /api/news/:id` - Atualizar notícia (autenticado)
- `DELETE /api/news/:id` - Deletar notícia (autenticado)
- `PATCH /api/news/:id/featured` - Marcar destaque (Editor Chefe)
- `POST /api/news/breaking-news` - Atualizar notícia urgente (Editor Chefe)
- `POST /api/news/upload` - Upload de imagem (autenticado)
- `POST /api/news/:id/view` - Incrementar visualizações
- `POST /api/news/:id/like` - Curtir notícia
- `POST /api/news/:id/comments` - Adicionar comentário
- `DELETE /api/news/:newsId/comments/:commentId` - Deletar comentário

### Usuários
- `GET /api/users` - Listar usuários (autenticado)
- `POST /api/users` - Criar usuário (Editor Chefe)

## 🎯 Próximas Melhorias Sugeridas

### Banco de Dados
- [ ] Migrar de JSON para MongoDB ou PostgreSQL
- [ ] Implementar relacionamentos entre entidades
- [ ] Sistema de backup automático

### Autenticação
- [ ] Recuperação de senha
- [ ] Registro de novos usuários (com aprovação)
- [ ] Autenticação de dois fatores (2FA)

### Comentários e Curtidas
- [ ] Sistema de likes por usuário (evitar curtidas duplicadas)
- [ ] Edição e exclusão de comentários
- [ ] Moderação de comentários
- [ ] Sistema de denúncia
- [ ] Respostas a comentários (threads)

### Notícias
- [ ] Categorias dinâmicas (cadastro via admin)
- [ ] Tags/etiquetas
- [ ] Notícias relacionadas
- [ ] Histórico de versões
- [ ] Agendamento de publicação
- [ ] Rascunhos

### Upload de Arquivos
- [ ] Upload de múltiplas imagens
- [ ] Galeria de imagens
- [ ] Editor de imagens (crop, resize)
- [ ] Suporte a vídeos
- [ ] CDN para armazenamento

### Analytics
- [ ] Dashboard de estatísticas
- [ ] Gráficos de visualizações
- [ ] Notícias mais populares
- [ ] Tempo médio de leitura
- [ ] Taxa de engajamento

### SEO
- [ ] Meta tags OpenGraph
- [ ] Schema.org markup
- [ ] Sitemap.xml
- [ ] URLs amigáveis
- [ ] AMP (Accelerated Mobile Pages)

### Performance
- [ ] Cache de notícias
- [ ] Lazy loading de imagens
- [ ] Minificação de CSS/JS
- [ ] Service Worker (PWA)
- [ ] Compressão de respostas

### Acessibilidade
- [ ] Leitores de tela
- [ ] Navegação por teclado
- [ ] Contraste de cores
- [ ] Tamanho de fonte ajustável

### Newsletter
- [ ] Sistema de assinatura funcional
- [ ] Envio de emails
- [ ] Templates de email
- [ ] Segmentação de público

## 📝 Licença

Este projeto é propriedade da Cooperativa 4071.

---

**Desenvolvido com ❤️ para a Cooperativa 4071**
