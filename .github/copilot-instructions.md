# Copilot Instructions - Sicoob Notícias

## Visão Geral do Projeto

Portal de notícias estilo jornal clássico (inspirado na Folha de São Paulo) desenvolvido em HTML/CSS/JavaScript vanilla. Sistema de notícias dinâmico com foco em experiência de leitura profissional e navegação intuitiva.

## Arquitetura e Estrutura

### Organização de Arquivos
```
/
├── index.html          # Estrutura principal da página
├── css/
│   └── styles.css     # Estilos completos com design responsivo
├── js/
│   └── app.js         # Lógica da aplicação (vanilla JS)
├── data/
│   └── news-data.json # Fonte de dados das notícias
├── images/            # Assets de imagens
└── .github/
    └── copilot-instructions.md
```

### Fluxo de Dados
1. `app.js` carrega `news-data.json` via `fetch()` no `DOMContentLoaded`
2. Se JSON falhar, sistema gera dados de amostra com `generateSampleNews()`
3. Notícias são filtradas/pesquisadas manipulando array `filteredNews`
4. DOM é atualizado diretamente via `innerHTML` (sem frameworks)

## Padrões de Código

### JavaScript
- **Estado Global**: Variáveis globais no topo (`allNews`, `filteredNews`, `currentCategory`, `currentPage`)
- **Nomenclatura**: camelCase para funções/variáveis, kebab-case para data attributes
- **Eventos**: Event listeners centralizados em `setupEventListeners()`
- **Async**: `async/await` para operações de I/O (fetch)
- **Modals**: Criados dinamicamente via DOM manipulation + injeção de estilos inline

### CSS
- **Metodologia**: CSS Vanilla com variáveis CSS (`:root`)
- **Layout**: CSS Grid para estrutura principal, Flexbox para componentes
- **Responsividade**: Mobile-first com breakpoints: 480px, 768px, 992px, 1200px
- **Naming**: Classes semânticas descritivas (`.featured-story`, `.news-grid`)
- **Animações**: `@keyframes` para fade-in e pulse (breaking news)

### HTML
- **Semântica**: Tags HTML5 (`<article>`, `<section>`, `<aside>`, `<nav>`)
- **Data Attributes**: `data-category` para filtros de navegação
- **IDs**: Usados para elementos únicos manipulados por JS
- **Acessibilidade**: Atributos `alt` em imagens, estrutura hierárquica de headings

## Estrutura de Dados (JSON)

```json
{
  "breakingNews": "string",
  "news": [{
    "id": number,
    "title": string,
    "category": string,
    "author": string,
    "date": ISO8601,
    "image": url,
    "excerpt": string,
    "content": string,
    "views": number
  }]
}
```

## Funcionalidades Principais

### Sistema de Filtros
- **Categorias**: Filtro via `data-category` nos links do nav
- **Busca**: Input text que filtra por título/excerpt/conteúdo
- **Implementação**: Manipula `filteredNews` array e re-renderiza

### Paginação
- Notícia 1: Featured (destaque principal)
- Notícias 2-3: Secondary stories (grid 2 colunas)
- Notícias 4+: News grid (3 colunas, paginado)
- Botão "Carregar Mais" incrementa `currentPage` e adiciona cards

### Modal de Artigo
- Criado dinamicamente ao clicar em notícia
- Estilo injetado via `<style>` tag
- Fecha ao clicar no background ou botão ✕
- Incrementa contador de visualizações

## Design System

### Paleta de Cores
```css
--primary-color: #1a1a1a    /* Textos principais */
--secondary-color: #c8102e   /* Destaques/CTAs */
--accent-color: #004a99      /* Links/Accent */
--text-light: #666           /* Textos secundários */
--border-color: #ddd         /* Separadores */
```

### Tipografia
- **Serif**: Merriweather, PT Serif (títulos, manchetes)
- **Sans**: Roboto (corpo de texto, UI)
- **Google Fonts**: Carregado via CDN no `<head>`

### Espaçamentos
Sistema baseado em CSS variables (`--spacing-xs` a `--spacing-xl`)

## Convenções de Desenvolvimento

### Adicionar Nova Categoria
1. Adicionar item em `.nav-list` com `data-category`
2. Incluir categoria nas notícias em `news-data.json`
3. Estilo automático via CSS existente

### Criar Novo Componente de Card
1. Seguir estrutura: `.component-name` (container) > `.component-name-content` (children)
2. Usar classes específicas, não modificadores genéricos
3. Aplicar transitions em `:hover` (transform + box-shadow)

### Modificar Layout Responsivo
- Trabalhar dentro dos breakpoints existentes em `@media`
- Grid columns se reduzem progressivamente: 3 → 2 → 1
- Container max-width: 1400px

## Debugging e Testes

### Testar Localmente
Abrir `index.html` diretamente no navegador. Nota: CORS pode bloquear `fetch()` - use servidor local:

**PowerShell (Windows)**:
```powershell
python -m http.server 8000
# Acesse: http://localhost:8000
```

### Console Errors Comuns
- `Failed to fetch news-data.json`: Sistema usa fallback `generateSampleNews()`
- `showArticleDetail is not defined`: Função exportada via `window.showArticleDetail`

### Validar Responsividade
Testar nos breakpoints: 1400px (desktop), 992px (tablet), 768px (mobile), 480px (small mobile)

## Extensibilidade

### Adicionar Backend Real
1. Substituir `fetch('data/news-data.json')` por endpoint API
2. Manter estrutura de dados JSON
3. Implementar paginação server-side

### Integração com CMS
- Adaptar `loadNewsData()` para consumir API do CMS
- Mapear campos do CMS para estrutura esperada
- Considerar cache local para performance

### Adicionar Novas Features
- **Comentários**: Adicionar array `comments` ao objeto de notícia
- **Favoritos**: Usar `localStorage` para persistir IDs favoritados
- **Compartilhamento**: Adicionar botões sociais no modal de artigo

## Manutenção

### Atualizar Notícias
Editar `data/news-data.json` - mudanças refletem automaticamente no reload

### Performance
- Imagens usam Picsum (placeholder) - substituir por CDN otimizado
- Lazy loading implementável via `loading="lazy"` em `<img>`
- Considerar minificação de CSS/JS para produção

### SEO (Futuro)
- Adicionar meta tags OpenGraph no `<head>`
- Implementar schema.org NewsArticle markup
- Gerar sitemap.xml para notícias
