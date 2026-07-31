import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup,Validator, Validators, ReactiveFormsModule } from "@angular/forms";
  import { datosUsuario } from '../../datosUsuarios';
  
  @Component({
    selector: 'app-if1',
   templateUrl: './if1.component.html',
    styleUrls: ['./if1.component.css']
  })
  export class If1Component implements OnInit {
  
    registerForm:FormGroup 
    userObject : datosUsuario = new datosUsuario()
     array = [] as any;
    mostrarTabla: Boolean = false;
    constructor(private formbuilder:FormBuilder) { 
      this.registerForm = this.formbuilder.group({
      txtNombre: ['', [Validators.required]],
      txtApellido: ['', [Validators.required]],
      txtCorreo: ['', [Validators.required]],
      txtTelefono: ['', [Validators.required]],

      
      
      })
      
  
      
    }
    
    ngOnInit(): void {
      this.registerForm = new FormGroup({
        txtNombre : new FormControl(''),
        txtApellido : new FormControl(''),
        txtCorreo : new FormControl(''),
        txtTelefono : new FormControl(''),

  
      })
      this.userObject.nombre = this.registerForm.value.txtNombre;
      this.userObject.apellido = this.registerForm.value.txtApellido;
      this.userObject.correo = this.registerForm.value.txtCorreo;
      this.userObject.telefono = this.registerForm.value.txtTelefono;

  
      
    }
    enviarInfo(value:any){
      
      
      
  
      
  
      localStorage.setItem('Nombre', JSON.stringify(this.userObject.id+1));
      localStorage.setItem('Nombre', JSON.stringify(this.userObject.nombre));
      localStorage.setItem('Apellido', JSON.stringify(this.userObject.apellido));
      localStorage.setItem('Correo', JSON.stringify(this.userObject.correo));
      localStorage.setItem('telefono', JSON.stringify(this.userObject.telefono));

  
  
      
      this.mostrarTabla = true;
     
      this.array=[this.registerForm.value.txtNombre, this.registerForm.value.txtApellido, this.registerForm.value.txtCorreo, this.registerForm.value.txtTelefono, this.registerForm.value.txtProblema]
      alert('Su información ha sido suministrada')
    }
    actualizarInfoContact(value:any){
      localStorage.setItem('Nombre',JSON.stringify(this.userObject.id+1));
      localStorage.setItem('Apellido',JSON.stringify(this.userObject.id+1));
      localStorage.setItem('Apellido',JSON.stringify(this.userObject.id+1));
      localStorage.setItem('telefono',JSON.stringify(this.userObject.id+1));
    
      this.mostrarTabla = true;
         
      this.array=[this.registerForm.value.txtNombre, this.registerForm.value.txtApellido, this.registerForm.value.txtCorreo, this.registerForm.value.txtTelefono ]
        }

    eliminar(value:any){
  
    }
    
  }