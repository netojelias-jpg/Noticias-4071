// Simulação de banco de dados em memória
// Em produção, usar MongoDB, PostgreSQL ou outro BD real

let users = [
    {
        id: 1,
        name: 'Editor Chefe',
        email: 'chefe@4071.com.br',
        password: '$2a$10$SwI8bdpdSqui3djNzOyFyOQL/BIKWqNzm6bryhHa.guKK4lflNL5e', // senha: admin123
        role: 'editor-chefe',
        sector: null
    },
    {
        id: 2,
        name: 'Editor TI',
        email: 'ti@4071.com.br',
        password: '$2a$10$SwI8bdpdSqui3djNzOyFyOQL/BIKWqNzm6bryhHa.guKK4lflNL5e', // senha: admin123
        role: 'editor-setorial',
        sector: 'Tecnologia da Informação'
    },
    {
        id: 3,
        name: 'Editor Marketing',
        email: 'marketing@4071.com.br',
        password: '$2a$10$SwI8bdpdSqui3djNzOyFyOQL/BIKWqNzm6bryhHa.guKK4lflNL5e', // senha: admin123
        role: 'editor-setorial',
        sector: 'Marketing'
    }
];

let nextUserId = 4;

class UserModel {
    static async findAll() {
        return users;
    }

    static async findById(id) {
        return users.find(u => u.id === parseInt(id));
    }

    static async findByEmail(email) {
        return users.find(u => u.email === email);
    }

    static async create(userData) {
        const user = {
            id: nextUserId++,
            ...userData,
            createdAt: new Date()
        };
        users.push(user);
        return user;
    }

    static async update(id, userData) {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index === -1) return null;
        
        users[index] = { ...users[index], ...userData, updatedAt: new Date() };
        return users[index];
    }

    static async delete(id) {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index === -1) return false;
        
        users.splice(index, 1);
        return true;
    }

    static async findBySector(sector) {
        return users.filter(u => u.sector === sector && u.role === 'editor-setorial');
    }
}

module.exports = UserModel;
