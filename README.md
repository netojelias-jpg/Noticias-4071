# 📰 Notícias da 4071

Portal de notícias interno da Cooperativa 4071 com visual profissional inspirado em jornais clássicos brasileiros.

![Status](https://img.shields.io/badge/status-ativo-success)
![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

## 🎯 Sobre o Projeto

Sistema de notícias dinâmico desenvolvido para centralizar informações e atualizações de todos os setores da Cooperativa 4071. O portal oferece uma experiência de leitura profissional com navegação intuitiva e design responsivo.

## ✨ Funcionalidades

- 📱 **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- 🔍 **Busca Avançada** - Pesquise notícias por título, resumo ou conteúdo
- 🏷️ **Filtros por Categoria** - Navegue por setores específicos
- 📄 **Paginação Inteligente** - Carregamento progressivo de notícias
- 🎯 **Notícias em Destaque** - Sistema de manchetes principais
- 📊 **Mais Lidas** - Ranking de notícias por visualizações
- ⚡ **Banner Urgente** - Destaque para informações importantes
- 📧 **Newsletter** - Sistema de inscrição integrado
- 🎨 **Modal de Leitura** - Visualização completa de artigos

## 📂 Estrutura do Projeto

```
Noticias-4071/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos completos
├── js/
│   └── app.js            # Lógica da aplicação
├── data/
│   └── news-data.json    # Base de dados de notícias
├── images/               # Imagens do projeto
├── .github/
│   └── copilot-instructions.md
└── README.md
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

### Opção 1: Servidor Local (Recomendado)

Para evitar problemas de CORS ao carregar o arquivo JSON:

```powershell
# Navegue até a pasta do projeto
cd "d:\Meus programas\Sicoob\Página de Notícias"

# Inicie um servidor HTTP local
python -m http.server 8000

# Acesse no navegador
# http://localhost:8000
```

### Opção 2: Abrir Diretamente

Abra o arquivo `index.html` diretamente no navegador. 

**Nota:** Se o arquivo `news-data.json` não carregar devido a restrições de CORS, o sistema automaticamente gerará notícias de exemplo.

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com Grid e Flexbox
- **JavaScript (Vanilla)** - Lógica e interatividade
- **Google Fonts** - Tipografia profissional (Merriweather, Roboto)
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
