document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evitar el envío tradicional del formulario
  
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const contrasena = document.getElementById('contrasena').value;
  
    console.log('Enviando datos al backend:', { nombre_usuario, contrasena });  // Verifica los datos antes de enviarlos
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario, contrasena })  // Convierte los datos a JSON
      });
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
  
      if (response.ok) {
        alert('Login exitoso');
        // Aquí puedes redirigir o hacer otra acción
      } else {
        alert(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en el login:', error);
    }
  });
  