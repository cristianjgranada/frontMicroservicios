import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ProductosServiceService {
  ip:string = "localhost"
  puerto:number = 4007
  url: string = `http://${this.ip}:${this.puerto}/productos/` 
  constructor(private http: HttpClient ) { 

  }

  obtenerProductos(){
    return this.http.get( this.url )
  }

  obtenerProducto(productoid){
    return this.http.get( this.url + productoid )
  }

  registrarProducto(body:any){
    return this.http.post(this.url, body)
  }

  eliminarProducto(productoid:string){
    return this.http.delete(this.url + "?productoid=" + productoid )
  }

  actuaizarProducto(producto:any){   
    return this.http.put(this.url, producto)
  }

  actualizarImagen(imagen:File, id:string){
    return new Promise((resP,rej) => {
      const formData = new FormData();
      let xhr = new XMLHttpRequest()
      formData.append('imagen',  imagen, imagen.name);
      formData.append('tipo', "Productos" )
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
