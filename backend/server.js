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

/*********************************************/
/*                  RUTAS API                */
/*********************************************/

// Ruta para iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express corriendo en el puerto ${port}`);
});

/*********************************************/
/*                    Login                  */
/*********************************************/

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

/*********************************************/
/*                  Registro                 */
/*********************************************/

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

/*********************************************/
/*     Administración de los eventos BBDD    */
/*********************************************/



// Ruta para obtener todos los eventos
app.get('/api/eventos', (req, res) => {
    const query = 'SELECT * FROM eventos ORDER BY RAND()';

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
  const query = 'SELECT id, nombreEvento, fechaEvento, tipoEvento, imagenUrl FROM eventos WHERE id = ?';

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
  const { nombreEvento, fechaEvento, tipoEvento, imagenUrl } = req.body;

  // Validación simple
  if (!nombreEvento || !fechaEvento || !tipoEvento || !imagenUrl) {
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

console.log('req.body:', req.body);


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

/*********************************************/
/*    Administración de los usuarios BBDD    */
/*********************************************/

//Ruta para obtener todos los usuarios

app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT id, nombre_usuario, email, contrasena, fecha_creacion FROM usuarios';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error al obtener los usuarios.' });
        }

        res.json(results);
    });
});

//Ruta para crear un nuevo usuario

app.post('/api/usuarios', (req, res) => {
    const { nombre_usuario, email, contrasena } = req.body;

    if (!nombre_usuario || !email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Encriptar contraseña
    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) {
            console.error('Error al cifrar la contraseña:', err);
            return res.status(500).json({ error: 'Error al cifrar la contraseña.' });
        }

        const query = 'INSERT INTO usuarios (nombre_usuario, email, contrasena, fecha_creacion) VALUES (?, ?, ?, NOW())';
        db.query(query, [nombre_usuario, email, hash], (err, result) => {
            if (err) {
                console.error('Error al crear usuario:', err);
                return res.status(500).json({ error: 'Error al crear el usuario.' });
            }

            res.status(201).json({ id: result.insertId, nombre_usuario, email });
        });
    });
});


//Ruta para modificar un usuario

app.put('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const { nombre_usuario, email, contrasena } = req.body;

    if (!nombre_usuario || !email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) {
            console.error('Error al cifrar la contraseña:', err);
            return res.status(500).json({ error: 'Error al cifrar la contraseña.' });
        }

        const query = 'UPDATE usuarios SET nombre_usuario = ?, email = ?, contrasena = ? WHERE id = ?';
        db.query(query, [nombre_usuario, email, hash, id], (err) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return res.status(500).json({ error: 'Error al actualizar el usuario.' });
            }

            res.json({ message: 'Usuario actualizado correctamente.' });
        });
    });
});

//Ruta para eliminar un usuario

app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).json({ error: 'Error al eliminar el usuario.' });
        }

        res.json({ message: 'Usuario eliminado correctamente.', id });
    });
});

/*********************************************/
/*   Administración de las encuestas BBDD    */
/*********************************************/

//ENCUESTAS

//Ruta para obtener todas las encuestas
app.get('/api/encuestas', (req, res) => {
  const { evento_id } = req.query;
  let query = 'SELECT * FROM encuestas';
  let params = [];

  if (evento_id) {
    query += ' WHERE evento_id = ?';
    params.push(evento_id);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error obteniendo encuestas' });
    res.json(results);
  });
});

//Ruta para crear encuesta
app.post('/api/encuestas', async (req, res) => {
  const { evento_id, titulo, descripcion } = req.body;

  if (!evento_id || !titulo) {
    return res.status(400).json({ error: 'Evento e título son obligatorios' });
  }

  try {
    const [result] = await db
      .promise()
      .query('INSERT INTO encuestas (evento_id, titulo, descripcion) VALUES (?, ?, ?)', [
        evento_id,
        titulo,
        descripcion || ''
      ]);

    res.status(201).json({
      id: result.insertId,
      evento_id,
      titulo,
      descripcion
    });
  } catch (err) {
    console.error('❌ Error en la base de datos:', err);
    res.status(500).json({ error: 'Error creando encuesta' });
  }
});


//Ruta para eliminar una encuesta
app.delete('/api/encuestas/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const [result] = await db
      .promise()
      .query('DELETE FROM encuestas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }

    res.json({ message: 'Encuesta eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar encuesta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



//Ruta para modificar una encuesta
app.put('/api/encuestas/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { titulo, descripcion, evento_id } = req.body;

  if (!evento_id || !titulo) {
      return res.status(400).json({ error: 'Evento e título son obligatorios' });
    }

    try {
      const [result] = await db
        .promise()
        .query(
          'UPDATE encuestas SET titulo = ?, descripcion = ?, evento_id = ? WHERE id = ?',
          [titulo, descripcion, evento_id, id]
        );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Encuesta no encontrada' });
      }

      res.json({ message: 'Encuesta actualizada correctamente' });
    } catch (error) {
      console.error('❌ Error al actualizar encuesta:', error);
      res.status(500).json({ error: 'Error al actualizar la encuesta' });
    }
});





//PREGUNTAS

//Ruta para obtener preguntas de una encuesta
app.get('/api/encuestas/:encuestaId/preguntas', (req, res) => {
  const encuestaId = req.params.encuestaId;
  const query = 'SELECT * FROM preguntas WHERE encuesta_id = ?';
  db.query(query, [encuestaId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error obteniendo preguntas' });
    res.json(results);
  });
});

// Ruta para crear una pregunta en una encuesta
app.post('/api/encuestas/:encuestaId/preguntas', (req, res) => {
  const encuestaId = req.params.encuestaId;
  const { texto_pregunta } = req.body;
  if (!texto_pregunta) {
    return res.status(400).json({ error: 'Texto de pregunta es obligatorio' });
  }

  const query = 'INSERT INTO preguntas (encuesta_id, texto_pregunta) VALUES (?, ?)';
  db.query(query, [encuestaId, texto_pregunta], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error creando pregunta' });
    res.status(201).json({ id: result.insertId, encuesta_id: encuestaId, texto_pregunta});
  });
});

// Ruta para actualizar una pregunta por ID
app.put('/api/preguntas/:id', (req, res) => {
  const preguntaId = req.params.id;
  const { texto_pregunta } = req.body;

  if (!texto_pregunta) {
    return res.status(400).json({ error: 'Texto de pregunta es obligatorio' });
  }

  const query = 'UPDATE preguntas SET texto_pregunta = ? WHERE id = ?';
  db.query(query, [texto_pregunta, preguntaId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error actualizando pregunta' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    res.json({ mensaje: 'Pregunta actualizada correctamente' });
  });
});


//OPCIONES

// Ruta para obtener opciones de una pregunta
app.get('/api/preguntas/:preguntaId/opciones', (req, res) => {
  const preguntaId = req.params.preguntaId;
  const query = 'SELECT * FROM opciones WHERE pregunta_id = ?';
  db.query(query, [preguntaId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error obteniendo opciones' });
    res.json(results);
  });
});

// Ruta para crear una opción para una pregunta
app.post('/api/preguntas/:preguntaId/opciones', (req, res) => {
  const { texto_opcion } = req.body;
  const preguntaId = req.params.preguntaId;

  if (!texto_opcion) {
    return res.status(400).json({ error: 'Texto de la opción es obligatorio' });
  }

  const query = 'INSERT INTO opciones (pregunta_id, texto_opcion) VALUES (?, ?)';
  db.query(query, [preguntaId, texto_opcion], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error creando opción' });

    res.status(201).json({
      id: result.insertId,
      pregunta_id: preguntaId,
      texto_opcion
    });
  });
});

// Ruta para actualizar opción
app.put('/api/opciones/:id', (req, res) => {
  const opcionId = req.params.id;
  const { texto_opcion } = req.body;

  if (!texto_opcion) {
    return res.status(400).json({ error: 'Texto de opción es obligatorio' });
  }

  const query = 'UPDATE opciones SET texto_opcion = ? WHERE id = ?';
  db.query(query, [texto_opcion, opcionId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error actualizando opción' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Opción no encontrada' });
    res.json({ mensaje: 'Opción actualizada correctamente', id: opcionId });
  });
});


//RESPUESTAS

// Ruta para enviar respuestas de un usuario (puede incluir varias opciones por pregunta)
app.post('/api/respuestas', (req, res) => {
  const { usuario_id, respuestas } = req.body; 
  // respuestas = [{ pregunta_id, opcion_id }, ...]

  if (!usuario_id || !Array.isArray(respuestas) || respuestas.length === 0) {
    return res.status(400).json({ error: 'Usuario y respuestas son obligatorios' });
  }

  // Insertar todas las respuestas (podemos hacer una query múltiple)
  const values = respuestas.map(r => [usuario_id, r.pregunta_id, r.opcion_id]);
  const query = 'INSERT INTO respuestas (usuario_id, pregunta_id, opcion_id) VALUES ?';

  db.query(query, [values], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error guardando respuestas' });
    res.status(201).json({ message: 'Respuestas guardadas correctamente' });
  });
});

// Servidor escuchando
app.listen(3000, () => console.log('API de encuestas escuchando en puerto 3000'));



/*********************************************/
/* Administración de las publicaciones BBDD  */
/*********************************************/





/*********************************************/
/*   Administración de los ecoviajes BBDD    */
/*********************************************/

//Ruta para obtener los ecoviajes
app.get('/api/ecoviajes', (req, res) => {
  db.query('SELECT * FROM ecoviajes', (err, results) => {
    if (err) {
      console.error('Error al obtener ecoviajes:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

//Ruta para crear un nuevo ecoviaje
app.post('/api/ecoviajes', (req, res) => {
  const nuevoEcoviaje = req.body;

  const sql = `INSERT INTO ecoviajes (usuario_id, evento_id, fechaViaje, plazasDisponibles, ubicacionInicial) VALUES (?, ?, ?, ?, ?)`;
  const values = [
    nuevoEcoviaje.usuario_id,
    nuevoEcoviaje.evento_id,
    nuevoEcoviaje.fechaViaje,
    nuevoEcoviaje.plazasDisponibles,
    nuevoEcoviaje.ubicacionInicial
  ];

  db.query(sql, values, (err, resultado) => {
    if (err) {
      console.error('Error al crear ecoviaje:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(201).json({ id: resultado.insertId, ...nuevoEcoviaje });
  });
});



//Ruta para actualizar un ecoviaje
app.put('/api/ecoviajes/:id', (req, res) => {
  const id = req.params.id;
  const { usuario_id, evento_id, fechaViaje, plazasDisponibles, ubicacionInicial } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID es requerido' });
  }

  const sql = `
    UPDATE ecoviajes
    SET usuario_id = ?, evento_id = ?, fechaViaje = ?, plazasDisponibles = ?, ubicacionInicial = ?
    WHERE id = ?
  `;
  const values = [usuario_id, evento_id, fechaViaje, plazasDisponibles, ubicacionInicial, id];

  db.query(sql, values, (err, resultado) => {
    if (err) {
      console.error('Error al actualizar ecoviaje:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Ecoviaje no encontrado' });
    }
    res.json({ id: Number(id), usuario_id, evento_id, fechaViaje, plazasDisponibles, ubicacionInicial });
  });
});


//Ruta para eliminar un ecoviaje
app.delete('/api/ecoviajes/:id', (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'ID es requerido' });
  }

  db.query('DELETE FROM ecoviajes WHERE id = ?', [id], (err, resultado) => {
    if (err) {
      console.error('Error al eliminar ecoviaje:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Ecoviaje no encontrado' });
    }
    res.json({ message: 'Ecoviaje eliminado correctamente' });
  });
});


/*********************************************/
/*   Administración del merchandising BBDD   */
/*********************************************/

