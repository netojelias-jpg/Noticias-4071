# 📰 Notícias da 4071

Portal de notícias interno da Cooperativa 4071 com visual profissional inspirado em jornais clássicos brasileiros.

![Status](https://img.shields.io/badge/status-ativo-success)
![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

## 🎯 Sobre o Projeto

Sistema de notícias dinâmico desenvolvido para centralizar informações e atualizações de todos os setores da Cooperativa 4071. O portal oferece uma experiência de leitura profissional com navegação intuitiva e design responsivo.

## ✨ Funcionalidades

### Frontend Público
- 📱 **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- 🔍 **Busca Avançada** - Pesquise notícias por título, resumo ou conteúdo
- 🏷️ **Filtros por Categoria** - Navegue por setores específicos
- 📄 **Paginação Inteligente** - Carregamento progressivo de notícias
- 🎯 **Notícias em Destaque** - Sistema de manchetes principais
- 📊 **Mais Lidas** - Ranking de notícias por visualizações
- ⚡ **Banner Urgente** - Destaque para informações importantes
- 📧 **Newsletter** - Sistema de inscrição integrado
- 🎨 **Modal de Leitura** - Visualização completa de artigos
- ❤️ **Curtidas** - Sistema de likes para notícias
- 💬 **Comentários** - Sistema público de comentários
- 🔄 **Tempo Real** - Atualizações via Socket.IO

### Backend e Admin
- 🔐 **Autenticação JWT** - Sistema seguro de login
- 👥 **Dois Níveis de Acesso** - Editor Chefe e Editor Setorial
- ✏️ **CRUD Completo** - Criar, editar e excluir notícias
- 📤 **Upload de Imagens** - Sistema de upload real (até 5MB)
- 🖼️ **Preview de Imagens** - Visualização antes de salvar
- 🚀 **Socket.IO** - Notificações em tempo real
- 📊 **Painel Administrativo** - Interface completa de gerenciamento

## 📂 Estrutura do Projeto

```
Noticias-4071/
├── backend/
│   ├── middleware/
│   │   ├── auth.js         # Autenticação JWT
│   │   └── upload.js       # Upload de imagens
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
├── README.md               # Documentação
├── BACKEND.md              # Documentação do backend
└── FEATURES.md             # Lista completa de funcionalidades
```

## 🎨 Categorias

O portal está organizado por setores da cooperativa:

- 💻 **Tecnologia da Informação**
- 🏛️ **Governança**
- 🛡️ **Riscos e Controles**
- 📋 **Administrativo**
- 💰 **Financeiro**
- 💳 **Crédito e Cadastro**
- 🔄 **Recuperação de Crédito**
- 📢 **Marketing**
- 👥 **Gente**
- 📈 **Negócios**
- 💡 **Inovação**
- ⚙️ **Processos**

## 🚀 Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/netojelias-jpg/Noticias-4071.git

# Entre na pasta do projeto
cd Noticias-4071

# Instale as dependências
npm install
```

### Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

### Executar o Projeto

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em:
- **Página Pública:** http://localhost:3000
- **Painel Admin:** http://localhost:3000/admin

### Usuários de Teste

**Editor Chefe:**
- Email: chefe@4071.com.br
- Senha: admin123

**Editor TI:**
- Email: ti@4071.com.br
- Senha: admin123

**Editor Marketing:**
- Email: marketing@4071.com.br
- Senha: admin123

## 🎯 Uso do Sistema

### Para Leitores (Página Pública)
1. Acesse http://localhost:3000
2. Navegue pelas categorias ou use a busca
3. Clique em uma notícia para ler
4. Curta e comente as notícias

### Para Editores (Painel Admin)
1. Acesse http://localhost:3000/admin
2. Faça login com suas credenciais
3. Crie, edite e gerencie notícias do seu setor
4. Faça upload de imagens ou use URLs

### Para Editor Chefe
- Todas as funcionalidades de editor
- Marcar/desmarcar notícias como destaque
- Editar/excluir qualquer notícia
- Definir notícia urgente no banner

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.IO** - Comunicação em tempo real
- **JWT** - Autenticação segura
- **bcrypt** - Criptografia de senhas
- **Multer** - Upload de arquivos

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Grid, Flexbox, Variables
- **JavaScript (Vanilla ES6+)** - Lógica e interatividade
- **Socket.IO Client** - Atualizações em tempo real
- **Google Fonts** - Tipografia profissional (Merriweather, Roboto)

### Armazenamento
- **JSON** - Sistema de arquivos
- **File System** - Uploads de imagens
- **JSON** - Armazenamento de dados

## 📝 Adicionando Notícias

Edite o arquivo `data/news-data.json` seguindo a estrutura:

```json
{
  "id": 1,
  "title": "Título da Notícia",
  "category": "Categoria",
  "author": "Nome do Autor",
  "date": "2025-12-14T10:30:00",
  "image": "URL_da_imagem",
  "excerpt": "Resumo breve da notícia...",
  "content": "Conteúdo completo da notícia...",
  "views": 0
}
```

As mudanças serão refletidas automaticamente ao recarregar a página.

## 🎨 Personalização

### Cores

Edite as variáveis CSS em `css/styles.css`:

```css
:root {
  --primary-color: #1a1a1a;
  --secondary-color: #c8102e;
  --accent-color: #004a99;
  /* ... */
}
```

### Layout

O layout é baseado em CSS Grid e pode ser ajustado nos breakpoints:
- Desktop: 1400px
- Tablet: 992px
- Mobile: 768px
- Small Mobile: 480px

## 📊 Funcionalidades Técnicas

### Filtros e Busca
- Filtro por categoria via atributos `data-category`
- Busca em tempo real através de título, resumo e conteúdo
- Reset automático de paginação ao filtrar

### Paginação
- Primeira notícia: Destaque principal
- Notícias 2-3: Destaques secundários
- Demais: Grid com paginação de 9 itens por página

### Sistema de Visualizações
- Contador incrementado ao abrir notícia
- Ordenação de "Mais Lidas" por número de views

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: Nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

**Cooperativa 4071**
- GitHub: [@netojelias-jpg](https://github.com/netojelias-jpg)

## 📞 Suporte

Para suporte, entre em contato com a área de Tecnologia da Informação da Cooperativa 4071.

---

⭐ Desenvolvido com dedicação para a Cooperativa 4071
