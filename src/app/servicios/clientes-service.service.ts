import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ClientesServiceService {
  ip:string = "localhost"
  puerto:number = 4007
  url: string = `http://${this.ip}:${this.puerto}/clientes/` 
  constructor(private http: HttpClient) { }

  obtenerClientes(){
    return this.http.get( this.url )
  }

  obtenerCliente(clienteid){
    return this.http.get(this.url  + clienteid )
  }

  registrarclientes(body:any){
    return this.http.post(this.url, body)
  }

  eliminarClientes(clienteid:string){
    return this.http.delete(this.url + "?clienteid=" + clienteid )
  }

  actuaizarClientes(producto:any){   
    return this.http.put(this.url, producto)
  }
  
  actualizarImagen(imagen:File, id:string){
    return new Promise((resP,rej) => {
      const formData = new FormData();
      let xhr = new XMLHttpRequest()
      formData.append('imagen',  imagen, imagen.name);
      formData.append('tipo', "Clientes" )
      formData.append('id', id) 
  
      xhr.onreadystatechange = () => {
        if (xhr.readyState ===4){
          if ( xhr.status === 200){
            resP( xhr.response )
          }else {
            console.log('Fallo la subida');
            rej( xhr.response )
          }
        }
      }
      xhr.open('PUT', this.url + "actualizarimagen", true);
      xhr.send(formData);
    })
  }
}

