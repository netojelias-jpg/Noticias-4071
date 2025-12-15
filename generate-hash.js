// Script para gerar hash de senha
const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log('\n=== Hash gerado para senha: admin123 ===');
    console.log(hash);
    console.log('\nCopie este hash e atualize em backend/models/User.js');
}

generateHash();
