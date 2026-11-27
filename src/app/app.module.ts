import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarruselComponent } from './componentes/carrusel/carrusel.component';
import { FormularioRegistroComponent } from './componentes/formulario-registro/formulario-registro.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { PieComponent } from './componentes/pie/pie.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { ScontComponent } from './componentes/scont/scont.component';
import { SeccionComponent } from './componentes/seccion/seccion.component';
import { SinfoComponent } from './componentes/sinfo/sinfo.component';
import { ContactosComponent } from './paginas/contactos/contactos.component';
import { HeladosComponent } from './paginas/helados/helados.component';
import { Info1Component } from './paginas/info1/info1.component';
import { Info2Component } from './paginas/info2/info2.component';
import { Info3Component } from './paginas/info3/info3.component';
import { InformacionComponent } from './paginas/informacion/informacion.component';
import { MalteadasComponent } from './paginas/malteadas/malteadas.component';
import { PrincipalComponent } from './paginas/principal/principal.component';

registerLocaleData(localeEsCo);

@NgModule({
  declarations: [
    AppComponent,
    CarruselComponent,
    FormularioRegistroComponent,
    MenuComponent,
    PieComponent,
    ProductosComponent,
    ScontComponent,
    SeccionComponent,
    SinfoComponent,
    ContactosComponent,
    HeladosComponent,
    Info1Component,
    Info2Component,
    Info3Component,
    InformacionComponent,
    MalteadasComponent,
    PrincipalComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
