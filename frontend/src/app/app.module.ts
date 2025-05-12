import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app.routes';  // Importa las rutas
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule } from '@angular/common/http'; 
import { EventosService } from './eventos.service';
import { LandingComponent } from './landing/landing.component';
import { FooterComponent } from './footer/footer.component';
import { BarraNavegacionComponent } from './barra-navegacion/barra-navegacion.component';
import { AdminComponent } from './admin/admin.component'; 


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        LandingComponent,
        FooterComponent,
        BarraNavegacionComponent,
        AdminComponent, 
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        FullCalendarModule,
        HttpClientModule, 
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [EventosService],
    bootstrap: [AppComponent]
})
export class AppModule { }
