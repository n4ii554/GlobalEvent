import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  nombre_usuario = '';
  contrasena     = '';
  errorMessage   = '';

  constructor(private router: Router) {}

  async login(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    try {
      const { data } = await axios.post('http://localhost:3000/login', {
        nombre_usuario: this.nombre_usuario,
        contrasena: this.contrasena
      });

      if (data.token) localStorage.setItem('token', data.token);

      console.log('Login exitoso:', data);

      this.router.navigate(['/landing']);

    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage =
        error.response?.data?.error || 'Error al iniciar sesión.';
    }
  }
}
