import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactosComponent } from './paginas/contactos/contactos.component';
import { HeladosComponent } from './paginas/helados/helados.component';
import { Info1Component } from './paginas/info1/info1.component';
import { Info2Component } from './paginas/info2/info2.component';
import { Info3Component } from './paginas/info3/info3.component';
import { InformacionComponent } from './paginas/informacion/informacion.component';
import { MalteadasComponent } from './paginas/malteadas/malteadas.component';
import { PrincipalComponent } from './paginas/principal/principal.component';

const routes: Routes = [
  { path: 'principal', component: PrincipalComponent, title: 'IceCul · Heladería en Barranquilla' },
  { path: 'helados', component: HeladosComponent, title: 'Helados · IceCul' },
  { path: 'malteadas', component: MalteadasComponent, title: 'Malteadas · IceCul' },
  { path: 'contactos', component: ContactosComponent, title: 'Contáctanos · IceCul' },
  { path: 'informacion', component: InformacionComponent, title: 'Información · IceCul' },
  { path: 'info1', component: Info1Component, title: 'Cuéntanos tu inconveniente · IceCul' },
  { path: 'info2', component: Info2Component, title: 'Trabaja con nosotros · IceCul' },
  { path: 'info3', component: Info3Component, title: 'Equipo IceCul' },
  { path: '', redirectTo: 'principal', pathMatch: 'full' },
  { path: '**', redirectTo: 'principal' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
