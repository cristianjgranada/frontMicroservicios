import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FacturasServiceService {
  ip:string = environment.IP // "192.168.99.100" //"localhost"
  //puerto:number =  environment.PORT //  9007 //4007
  url: string = `http://${this.ip}/facturas/` 
  constructor(private http: HttpClient) { }

  registrarFactura(jsnFactura:any){
    return this.http.post(this.url, jsnFactura )
  }

  obtenerFacturas(){
    return this.http.get(this.url )
  }

  anularFactura(consecutivo){
    return this.http.put( `http://${this.ip}/anularfactura` , {consecutivo} )
  }
}
