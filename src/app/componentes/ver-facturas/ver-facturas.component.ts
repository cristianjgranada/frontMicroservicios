import { Component, OnInit } from '@angular/core';
import { FacturasServiceService } from 'src/app/servicios/facturas-service.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ver-facturas',
  templateUrl: './ver-facturas.component.html',
  styleUrls: ['./ver-facturas.component.css']
})
export class VerFacturasComponent implements OnInit {

  constructor(
    private facturaService: FacturasServiceService,
    private modalService: NgbModal ) { 
      {
        this.modalOptions = {
          backdrop:'static',
          backdropClass:'customBackdrop'
        }
       }
    }
  facturas: any[]
  factuasOriginal: any[]
  contenidoFactura:any
  total:number = 0
  neto:number
  iva:number
  modalOptions:NgbModalOptions;
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  ngOnInit() {
    this.obtenerFacturas()
  }

  obtenerFacturas(){
    this.facturaService.obtenerFacturas().subscribe((jsnRespuesta:any) => {
      this.facturas = jsnRespuesta as []
      this.factuasOriginal =  this.facturas
    })
  }

  anularFactura(consecutivo){
    this.facturaService.anularFactura(consecutivo)
    .subscribe((jsnRespuesta:any) =>{
      if(jsnRespuesta.codigo ===0){
        alert("Factura anulada")
      }else {
        console.log(jsnRespuesta)
      }
       
      })
  }

  verFactura(modal, factura){
    this.obtenerTotal(factura.producto)
    this.neto = this.total / 1.19  //factura.iva
    this.iva =  this.total - this.neto 
    this.contenidoFactura = factura
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.total=0
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

  obtenerTotal(productosFactura){
    productosFactura.forEach(element => {
      this.total += element.precio
    });
  }

  filtrarFacturas(consecutivo){
    if (consecutivo){
      this.facturas = this.facturas.filter(factura => parseInt(factura.consecutivo )=== parseInt(consecutivo))      
      if (this.facturas.length === 0){
        alert('Factura no encontrada')
        this.facturas = this.factuasOriginal
      }
    }else {
      this.facturas = this.factuasOriginal
    }
  }

}
