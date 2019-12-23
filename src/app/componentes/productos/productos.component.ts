import { Component, OnInit } from '@angular/core';
import { ProductosServiceService } from 'src/app/servicios/productos-service.service';
import { FormGroup, FormControl, Validators } from  '@angular/forms'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  constructor(public productoservice: ProductosServiceService  ) { }
  actualizar: boolean = false
  productos:any[]
  form: FormGroup
  imagenFIle: File  = null
  imagen:string = "./assets/no-img.jpg"
  imagenDefault:string = "./assets/no-img.jpg" 
  imagenPreview: string
  productoid:string
  imgURL: any = null
  productossOriginal:any[]
  ngOnInit() {
    this.form = new FormGroup({
      productoid : new FormControl(null,Validators.required),
      nombre : new FormControl(null, Validators.required),
      precio : new FormControl(null, Validators.required),
      cantidad : new FormControl(null),
      urlimagen: new FormControl()
    })
    this.obtenerProducto()
  }

  async obtenerProducto(){
    return new Promise ((resP,res ) => {
      this.productoservice.obtenerProductos().subscribe(
        data=>{  
          this.productos ? this.productos.length = 0 : 0
          
          this.productos = data as  []
          this.productossOriginal = this.productos
          console.log(data);
          resP(true)
        })
    })

  }

  registrarProducto( ){
    let datos = this.form.getRawValue()
    if (this.actualizar){
      this.productoservice.actuaizarProducto(datos).subscribe((jsnRespuesta:any) =>{
        console.log(jsnRespuesta);
        if (jsnRespuesta  && jsnRespuesta.codigo === 0  ){
          alert('Producto actualizado')
          this.obtenerProducto()
          this.imagen= this.imagenDefault
        }
        this.actualizar=false
        this.form.get("productoid").enable()
        this.form.reset()
        
      })
    }else {
      this.productoservice.registrarProducto(datos).subscribe((jsnRespuesta:any) => {
        if (jsnRespuesta && jsnRespuesta.codigo === 0) {
          alert('Producto Creado')
          this.productos.push(datos)
          this.form.reset()
        } else {
          console.log(jsnRespuesta);
        }
      })
    }

  }

  verImagen(url:string){
    if(url){
      this.imagen = `https://${url}`
    }else {
      console.log('sin imagen');
      this.imagen = this.imagenDefault
    }

    
  }

  eliminarProducto(productoid:string){
    this.productoservice.eliminarProducto(productoid)
    .subscribe((respuesta:any) => {
      if (respuesta && respuesta.codigo ===0){
        alert('Producto eliminado')
        this.productos = this.productos.filter(producto => producto.productoid !== productoid )
      }else {
        console.log(respuesta);
      }
    })
  }

  actualizarProducto(producto:any){
    this.actualizar=true
    this.form.get("productoid").setValue(producto.productoid )
    this.form.get("productoid").disable()
    this.form.get("nombre").setValue(producto.nombre )
    this.form.get("precio").setValue(producto.precio )
    this.form.get("cantidad").setValue(producto.cantidad )
    
    if (producto.urlimagen){
      this.imagen = `https://${producto.urlimagen}`
    }else {
      this.imagen = this.imagenDefault
    }
  }

    subirImagen ( ){
    if (this.form.get("productoid").value){
      this.productoservice.actualizarImagen(this.imagenFIle, this.form.get("productoid").value ) .then(
        (respuesta:any) => {
          respuesta =  JSON.parse( respuesta);
          if (respuesta && respuesta.codigo === 0){
            alert('Imagen Actualizada') 
            this.obtenerProducto().then(() => {
              this.form.get("productoid").enable()
              this.form.reset()
              this.imagen= this.imagenDefault
              this.imgURL = this.imagenDefault  
            })
 
          }else {
            console.log(respuesta); 
          }
        }   
      )
    }else {
      alert("No hay producto seleccionado")
      this.imagen= this.imagenDefault
      this.imagenFIle = null
      this.imgURL = this.imagenDefault      
    }

  }

  preview(files) {
    if (files.length === 0){
      this.imgURL = null
      return;
    } 
    var mimeType = files[0].type;
    this.imagenFIle = files[0]
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();    
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  cancelarPreview(){
    this.imgURL = null
  }

  filtrarProducto(productoid){
    
    
    if (productoid){
      this.productos  = this.productos.filter(producto => parseInt(producto.productoid) == parseInt(productoid))      
      if (this.productos.length === 0){
        alert('Producto no encontrado')
        this.productos = this.productossOriginal
      }
    }else {
      this.productos = this.productossOriginal
    }
  }

}
