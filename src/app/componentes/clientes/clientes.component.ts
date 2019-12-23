import { Component, OnInit } from '@angular/core';
import { ClientesServiceService } from 'src/app/servicios/clientes-service.service';
import { FormGroup, FormControl, Validators } from  '@angular/forms'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  constructor(public clientesService: ClientesServiceService ) { }
  actualizar: boolean = false
  clientes:any[]
  form: FormGroup
  imagenFIle: File  = null
  imagen:string = "./assets/no-img.jpg"
  imagenDefault:string = "./assets/no-img.jpg" 
  imagenPreview: string
  productoid:string
  imgURL: any = null
  tiposIdentificacion:any
  clientesOriginal:any[]
  ngOnInit() {
    this.tiposIdentificacion = [
      {tipo: 'cc'}
      ,{ tipo:'ni' }
    ]
    this.form = new FormGroup({
      clienteid : new FormControl(null,Validators.required),
      tipoclienteid: new FormControl(null,Validators.required),
      nombre : new FormControl(null, Validators.required),
      apellido : new FormControl(null, Validators.required),
      edad : new FormControl(null),
      cumpleanos : new FormControl(null),
      urlimagen: new FormControl()
    })
    this.form.get("tipoclienteid").setValue (this.tiposIdentificacion[0].tipo)
    this.obtenerCliente()

  }

  async obtenerCliente(){
    return new Promise ((resP,res ) => {
      this.clientesService.obtenerClientes().subscribe(
        data=>{  
          this.clientes ? this.clientes.length = 0 : 0
          this.clientes = data as  []
          this.clientesOriginal = this.clientes
          resP(true)
        })
    })
  }

  registrarCliente( ){
    let datos = this.form.getRawValue()    
    if (this.actualizar){
      this.clientesService.actuaizarClientes(datos).subscribe((jsnRespuesta:any) =>{
        if (jsnRespuesta  && jsnRespuesta.codigo === 0  ){
          alert('Cliente actualizado')
          this.obtenerCliente()
          this.imagen= this.imagenDefault
        }
        this.actualizar=false
        this.form.get("clienteid").enable()
        this.form.reset()
      })
    }else {
      this.clientesService.registrarclientes(datos).subscribe((jsnRespuesta:any) => {
        if (jsnRespuesta && jsnRespuesta.codigo === 0) {
          alert('Cliente Creado')
          this.clientes.push(datos)
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

  eliminarCliente(clienteid:string){
    this.clientesService.eliminarClientes(clienteid)
    .subscribe((respuesta:any) => {
      if (respuesta && respuesta.codigo ===0){
        alert('cliente eliminado')
        this.clientes = this.clientes.filter(cliente => cliente.clienteid !== clienteid )
      }else {
        console.log(respuesta);
      }
    })
  }

  actualizarCliente(cliente:any){
    this.actualizar=true
    this.form.get("clienteid").setValue(cliente.clienteid )
    this.form.get("clienteid").disable()
    this.form.get("nombre").setValue(cliente.nombre )
    this.form.get("apellido").setValue(cliente.apellido )
    this.form.get("edad").setValue(cliente.edad )
    
    if (cliente.urlimagen){
      this.imagen = `https://${cliente.urlimagen}`
    }else {
      this.imagen = this.imagenDefault
    }
  }


  subirImagen ( ){
    if (this.form.get("clienteid").value){
      this.clientesService.actualizarImagen(this.imagenFIle, this.form.get("clienteid").value ) .then(
        (respuesta:any) => {
          respuesta =  JSON.parse( respuesta);
          if (respuesta && respuesta.codigo === 0){
            alert('Imagen Actualizada') 
            this.obtenerCliente ().then(() => {
              this.form.get("clienteid").enable()
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
      alert("No hay cliente seleccionado")
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

  filtrarCliente(clienteid){
    console.log(this.clientes);
    
    if (clienteid){
      this.clientes  = this.clientes.filter(cliente => cliente.clienteid == clienteid)      
      if (this.clientes.length === 0){
        alert('Cliente no encontrado')
        this.clientes = this.clientesOriginal
      }
    }else {
      this.clientes = this.clientesOriginal
    }
  }

}
