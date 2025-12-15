const fs = require('fs');
const path = require('path');

const newsFilePath = path.join(__dirname, '../../data/news-data.json');

class NewsModel {
    static async loadNews() {
        try {
            const data = fs.readFileSync(newsFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return { breakingNews: '', news: [] };
        }
    }

    static async saveNews(newsData) {
        try {
            fs.writeFileSync(newsFilePath, JSON.stringify(newsData, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Erro ao salvar notícias:', error);
            return false;
        }
    }

    static async findAll() {
        const data = await this.loadNews();
        return data.news;
    }

    static async findById(id) {
        const data = await this.loadNews();
        return data.news.find(n => n.id === parseInt(id));
    }

    static async findByCategory(category) {
        const data = await this.loadNews();
        return data.news.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }

    static async findFeatured() {
        const data = await this.loadNews();
        return data.news.filter(n => n.featured === true);
    }

    static async create(newsItem) {
        const data = await this.loadNews();
        
        // Gerar novo ID
        const maxId = data.news.length > 0 
            ? Math.max(...data.news.map(n => n.id)) 
            : 0;
        
        const newNews = {
            id: maxId + 1,
            ...newsItem,
            views: 0,
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        data.news.unshift(newNews); // Adiciona no início
        await this.saveNews(data);
        
        return newNews;
    }

    static async update(id, updates) {
        const data = await this.loadNews();
        const index = data.news.findIndex(n => n.id === parseInt(id));
        
        if (index === -1) return null;
        
        data.news[index] = {
            ...data.news[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        await this.saveNews(data);
        return data.news[index];
    }

    static async delete(id) {
        const data = await this.loadNews();
        const index = data.news.findIndex(n => n.id === parseInt(id));
        
        if (index === -1) return false;
        
        data.news.splice(index, 1);
        await this.saveNews(data);
        
        return true;
    }

    static async setFeatured(id, featured) {
        return await this.update(id, { featured });
    }

    static async setBreakingNews(text) {
        const data = await this.loadNews();
        data.breakingNews = text;
        await this.saveNews(data);
        return true;
    }

    static async incrementViews(id) {
        const data = await this.loadNews();
        const index = data.news.findIndex(n => n.id === parseInt(id));
        
        if (index === -1) return false;
        
        data.news[index].views = (data.news[index].views || 0) + 1;
        await this.saveNews(data);
        
        return data.news[index];
    }
}

module.exports = NewsModel;
