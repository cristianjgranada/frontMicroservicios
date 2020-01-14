import { Component, OnInit } from '@angular/core';
import { ClientesServiceService } from 'src/app/servicios/clientes-service.service';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { ProductosServiceService } from 'src/app/servicios/productos-service.service';
import * as moment from 'moment'
import { FacturasServiceService } from 'src/app/servicios/facturas-service.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  constructor(
    private clientesService: ClientesServiceService ,
    private productosService: ProductosServiceService,
    private facturasService: FacturasServiceService,
    private modalService: NgbModal
    ) {
      this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop'
      }
     }
  productos: any[] = []
  formBuscarCliente: FormGroup
  formBuscarProductos: FormGroup
  tiposIdentificacion:any
  nombreCliente:string
  apellidoCliente:string
  clienteid:string
  tipoclienteid:string
  total:number = 0
  neto:number= 0
  iva:number =0
  modalOptions:NgbModalOptions;
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  contenidoFactura:any
  ngOnInit() {
    this.tiposIdentificacion = [
      {tipo: 'cc'}
      ,{ tipo:'ni' }
    ]
    this.formBuscarCliente = new FormGroup({
      clienteid: new FormControl(null,Validators.required),
      tipoclienteid: new FormControl(null,Validators.required),
      nombre: new FormControl(null),
      apellido: new FormControl(null)
    })
    this.formBuscarProductos = new FormGroup({
      productoid: new FormControl(null,Validators.required),
      cantidad: new FormControl(null, Validators.required)
    })
    this.formBuscarCliente.get("tipoclienteid").setValue (this.tiposIdentificacion[0].tipo)
    this.formBuscarCliente.get("nombre").disable()
    this.formBuscarCliente.get("apellido").disable()
    this.formBuscarProductos.get("cantidad").setValue(1)
  }

  buscarCliente(){
    if (this.formBuscarCliente.valid){
      let datos = this.formBuscarCliente.getRawValue()
      this.clientesService.obtenerCliente(datos.clienteid).subscribe(
        (jsnRespuesta:any) => {
          console.log(jsnRespuesta);
          if (jsnRespuesta && jsnRespuesta.codigo === -95){
            return alert('Cliente no encontrado')
          }
          this.formBuscarCliente.get("nombre").setValue(jsnRespuesta.nombre)
          this.formBuscarCliente.get("apellido").setValue(jsnRespuesta.apellido)
        }
      )
    }
  }

  buscarProducto(){
    let datos = this.formBuscarProductos.getRawValue()
    this.productosService.obtenerProducto(datos.productoid)
    .subscribe((jsnRespuesta:any) =>{
      if (jsnRespuesta && jsnRespuesta.codigo===-95){
        alert("Producto no encontrado")
        this.formBuscarProductos.get("productoid").setValue(0)
        this.formBuscarProductos.get("cantidad").setValue(1)
        return
      }
      let cantidad = this.formBuscarProductos.get("cantidad").value
      let producto = {nombre: jsnRespuesta.nombre, cantidad, precio : jsnRespuesta.precio }
      let encontrado =false
      this.productos.forEach(element => {
        if (element.nombre === producto.nombre ){
          encontrado=true
          element.cantidad += producto.cantidad
        }
      });
      if (!encontrado){
        this.productos.push(producto)
      }
      this.formBuscarProductos.get("productoid").setValue('')
      this.formBuscarProductos.get("cantidad").setValue(1)
      this.totalizar()
    })
  }
  totalizar(){
    this.total= 0
    this.productos.forEach(element => {
      this.total += element.precio
    })
  }

  pagar(content){
    this.neto = this.total / 1.19  // (1 + (19/100))
    this.iva =  this.total - this.neto 
    let productosFacturados = JSON.parse( JSON.stringify( this.productos))
      this.contenidoFactura = {
        "encabezado" :  { "empresa" : "STOREAPP", "NIT": "0000000-0", "telefono": "180023456" },
        "resolucionDIAN" : { "fecha": "2019-12-18", "numero" : 12345, "prefijo": "pr" , "rango": "0 al 1000"  },
        "facturafecha" : moment().format('YYYY-MM-DD hh:mm:ss')  ,
        "clienteid": this.formBuscarCliente.get("clienteid").value,
        "clientenombre" : this.formBuscarCliente.get("nombre").value ,
        "clienteapellido" : this.formBuscarCliente.get("apellido").value,
        "producto" :productosFacturados , //{"productoid" : 2, "nombre": "skyrim", "valor" : 50000 , "cantidad" : 1  },
        "iva": 19,
        "estado": true
      }     
      this.facturasService.registrarFactura(this.contenidoFactura).subscribe((jsnRespuesta:any) => {
        if (jsnRespuesta && jsnRespuesta.codigo === 0){
          this.contenidoFactura  = jsnRespuesta.data
          this.productos.length = 0
          
          this.formBuscarCliente.reset()
          this.formBuscarProductos.reset()
          this.openModal(content)

        }else {
          console.log(jsnRespuesta);
        }
      })
  }

  openModal(content){
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.total = 0
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.total=0
    this.productos.length= 0
    this.neto=0
    this.iva=0
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  eliminarProducto(productoNombre){
    this.productos = this.productos.filter(producto => producto.nombre !== productoNombre  )
  }

}
