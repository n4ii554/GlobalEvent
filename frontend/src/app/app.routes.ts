import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin.guard';
import { EventosComponent } from './eventos/eventos.component';
import { AuthGuard } from './auth.guard';
import { GenerarEventosComponent } from './generar-eventos/generar-eventos.component';


export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },  
    { path: 'register', component: RegisterComponent },
    { path: 'eventos', component: EventosComponent },
    { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard]  },
    { path: 'crear', component: GenerarEventosComponent, canActivate: [AuthGuard]  },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },

    // Cualquier ruta que no este escrita arriba y haya sido cambiada por el usuario redirige a la Landing
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
