import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup,Validator, Validators, ReactiveFormsModule } from "@angular/forms";
  import { datosUsuario } from '../../datosUsuarios2';
  
  @Component({
    selector: 'app-if2',
   templateUrl: './if2.component.html',
    styleUrls: ['./if2.component.css']
  })
  export class If2Component implements OnInit {
  
    registerForm:FormGroup 
    userObject : datosUsuario = new datosUsuario()
     array = [] as any;
    mostrarTabla: Boolean = false;
    constructor(private formbuilder:FormBuilder) { 
      this.registerForm = this.formbuilder.group({
      txtNombre: ['', [Validators.required]],
      txtApellido: ['', [Validators.required]],
      txtCorreo: ['', [Validators.required]],
      txtNumero: ['', [Validators.required]],

      
      
      })
      
  
      
    }
    
    ngOnInit(): void {
      this.registerForm = new FormGroup({
        txtNombre : new FormControl(''),
        txtApellido : new FormControl(''),
        txtCorreo : new FormControl(''),
        txtNumero : new FormControl(''),
   
  
      })
      this.userObject.nombre = this.registerForm.value.txtNombre;
      this.userObject.apellido = this.registerForm.value.txtApellido;
      this.userObject.correo = this.registerForm.value.txtCorreo;
      this.userObject.numero = this.registerForm.value.txtNumero;

  
      
    }
    enviarInfo(value:any){
      
      
      
  
      
  
      localStorage.setItem('Nombre', JSON.stringify(this.userObject.id+1));
      localStorage.setItem('Nombre', JSON.stringify(this.userObject.nombre));
      localStorage.setItem('Apellido', JSON.stringify(this.userObject.apellido));
      localStorage.setItem('Correo', JSON.stringify(this.userObject.correo));
      localStorage.setItem('Numero', JSON.stringify(this.userObject.numero));

  
  
      
      this.mostrarTabla = true;
     
      this.array=[this.registerForm.value.txtNombre, this.registerForm.value.txtApellido, this.registerForm.value.txtCorreo, this.registerForm.value.txtNumero]
      alert('Su información ha sido suministrada')
    }
    actualizarInfoContact(value:any){
  
    }
    
  }