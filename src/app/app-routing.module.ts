import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturasComponent } from './componentes/facturas/facturas.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { VerFacturasComponent } from './componentes/ver-facturas/ver-facturas.component';


const routes: Routes = [
  { path: '', component: FacturasComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'verFacturas', component: VerFacturasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


  

 }
