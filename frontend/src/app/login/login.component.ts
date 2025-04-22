import { Component } from '@angular/core';
import axios from 'axios';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent {
  nombre_usuario: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  async login(event: Event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        nombre_usuario: this.nombre_usuario,
        contrasena: this.contrasena
      });
  
      console.log('Login exitoso:', response.data);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = error.response?.data?.message || 'Error al iniciar sesión.';
    }
  }
  
}
