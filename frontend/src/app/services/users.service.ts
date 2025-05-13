import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  token : any;
  constructor() { }

  /**
   * En base al token que hay en el localStorage 
   * Podemos con estos metodos mirar si esta logueado, si es organizador y si es admin
   * Para poder hacer y acceder a las cosas
   * @returns 
   */

  isLogged() : boolean{
    return localStorage.getItem('token') ? true : false;
  }
}