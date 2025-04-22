import { Component } from '@angular/core';
import axios from 'axios';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  nombre_usuario: string = '';
  correo_electronico: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  async register(event: Event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', {
        nombre_usuario: this.nombre_usuario,
        correo_electronico: this.correo_electronico,
        contrasena: this.contrasena
      });
  
      console.log('Registro exitoso:', response.data);
    } catch (error: any) {
      console.error('Error al intentar registrarse:', error);
      this.errorMessage = error.response?.data?.message || 'Error al intentar registrarse.';
    }
  }
  
}
