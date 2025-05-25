import { Component } from '@angular/core';
import axios from 'axios';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  nombre_usuario: string = '';
  email: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  constructor(private router: Router) { }

  async register(event: Event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', {
        nombre_usuario: this.nombre_usuario,
        email: this.email,
        contrasena: this.contrasena
      });

      console.log('Registro exitoso:', response.data);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error al intentar registrarse:', error);
      this.errorMessage = error.response?.data?.message || 'Error al intentar registrarse.';
    }
  }

}
