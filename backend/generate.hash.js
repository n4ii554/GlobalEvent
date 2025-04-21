const bcrypt = require('bcryptjs');

// La contraseña en texto plano que quieres cifrar
const password = 'asdf1234';

// Generar el hash
bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Hash generado:', hash);
});
