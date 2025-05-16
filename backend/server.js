const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
});

//RUTAS API

// Ruta para iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express corriendo en el puerto ${port}`);
});

// Ruta para el login
app.post('/login', (req, res) => {
    
    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos.' });
    }

    db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al consultar la base de datos.' });

        if (results.length === 0) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        const usuario = results[0];

        bcrypt.compare(contrasena, usuario.contrasena, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Error al comparar las contraseñas.' });

            if (!isMatch) {
                return res.status(400).json({ error: 'Usuario o contraseña incorrectos.' });
            }

            const token = jwt.sign(
                { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
                'tu_clave_secreta',
                { expiresIn: '1h' }
            );

            return res.json({ message: 'Login exitoso', token });
        });
    });
});

// Ruta para el registro
app.post('/register', (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);
    const { nombre_usuario, email, contrasena } = req.body;

    // Validación básica
    if (!nombre_usuario || !email || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el nombre de usuario ya existe
    db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al verificar el usuario.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Encriptar contraseña
        bcrypt.hash(contrasena, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Error al encriptar la contraseña.' });
            }

            // Insertar usuario
            db.query(
                'INSERT INTO usuarios (nombre_usuario, email, contrasena) VALUES (?, ?, ?)',
                [nombre_usuario, email, hash],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error al registrar el usuario.' });
                    }

                    return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
                }
            );
        });
    });
});

// Ruta para obtener todos los eventos
app.get('/api/eventos', (req, res) => {
    const query = 'SELECT id, nombreEvento, fechaEvento, tipoEvento FROM eventos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener eventos:', err);
            return res.status(500).json({ error: 'Error al obtener los eventos.' });
        }

        res.json(results);
    });
});

// Ruta para obtener un solo evento por su ID
app.get('/api/eventos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, nombreEvento, fechaEvento, tipoEvento FROM eventos WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el evento:', err);
      return res.status(500).json({ error: 'Error al obtener el evento.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado.' });
    }

    res.json(results[0]);
  });
});


// Ruta para crear un nuevo evento
app.post('/api/eventos', (req, res) => {
  const { nombreEvento, fechaEvento, tipoEvento } = req.body;

  // Validación simple
  if (!nombreEvento || !fechaEvento || !tipoEvento) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const query = 'INSERT INTO eventos (nombreEvento, fechaEvento, tipoEvento) VALUES (?, ?, ?)';
  db.query(query, [nombreEvento, fechaEvento, tipoEvento], (err, result) => {
    if (err) {
      console.error('Error al crear evento:', err);
      return res.status(500).json({ error: 'Error al crear evento' });
    }

    // Opcional: devolver el evento creado con su ID
    res.status(201).json({
      id: result.insertId,
      nombreEvento,
      fechaEvento,
      tipoEvento
    });
  });
 }); 
  

  // Ruta para eliminar evento
app.delete('/api/eventos/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM eventos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar evento:', err);
      return res.status(500).json({ error: 'Error al eliminar evento' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({ message: 'Evento eliminado correctamente' });
  });
});

// Ruta para modificar evento
app.put('/api/eventos/:id', (req, res) => {
  const { id } = req.params;
  const { nombreEvento, fechaEvento, tipoEvento } = req.body;

  if (!nombreEvento || !fechaEvento || !tipoEvento) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  console.log('Actualizar evento:', { id, nombreEvento, fechaEvento, tipoEvento });


  const query = 'UPDATE eventos SET nombreEvento = ?, fechaEvento = ?, tipoEvento = ? WHERE id = ?';
  db.query(query, [nombreEvento, fechaEvento, tipoEvento, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar evento:', err);
      return res.status(500).json({ error: 'Error al actualizar evento' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({ id: Number(id), nombreEvento, fechaEvento, tipoEvento });
  });
});


