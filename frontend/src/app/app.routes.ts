import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin.guard';
import { EventosComponent } from './eventos/eventos.component';


export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent },
    { path: 'login', component: LoginComponent },  // Redirige a LoginComponent en la ruta raíz
    { path: 'register', component: RegisterComponent },  // Redirige a RegisterComponent en la ruta raíz
    { path: 'calendario', component: CalendarioComponent },
    { path: 'eventos', component: EventosComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },

    // Cualquier ruta que no este escrita arriba y haya cambiado por el usuario redirige a la Landing
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
