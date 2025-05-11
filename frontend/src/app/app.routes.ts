import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
    { path: '', component: LandingComponent }, 
    { path: 'login', component: LoginComponent },  // Redirige a LoginComponent en la ruta raíz
    { path: 'register', component: RegisterComponent },  // Redirige a RegisterComponent en la ruta raíz
    { path: 'calendario', component: CalendarioComponent},

    // Cualquier ruta que no este escrita arriba y haya cambiado por el usuario redirige a la Landing
    {path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
