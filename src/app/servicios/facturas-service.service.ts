import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FacturasServiceService {
  ip:string = "localhost"
  puerto:number = 4007
  url: string = `http://${this.ip}:${this.puerto}/facturas/` 
  constructor(private http: HttpClient) { }

  registrarFactura(jsnFactura:any){
    return this.http.post(this.url, jsnFactura )
  }

  obtenerFacturas(){
    return this.http.get(this.url )
  }

  anularFactura(consecutivo){
    return this.http.put( `http://${this.ip}:${this.puerto}/anularfactura` , {consecutivo} )
  }
}
