import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { FacturasComponent } from './componentes/facturas/facturas.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FacturaComponent } from './componentes/factura/factura.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VerFacturasComponent } from './componentes/ver-facturas/ver-facturas.component';


@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent,
    ProductosComponent,
    FacturasComponent,
    SidebarComponent,
    NavbarComponent,
    FacturaComponent,
    VerFacturasComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
