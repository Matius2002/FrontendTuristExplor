import { Component, OnInit } from '@angular/core'; 
import { HttpClient, HttpClientModule } from "@angular/common/http"; 
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"; 
import { NgClass, NgForOf, NgIf } from "@angular/common"; 
import { ExperienciaService } from "../experiencia.service"; 
import { Router } from "@angular/router"; 
import Swal from "sweetalert2"; 
import { UsuarioService } from "../../../Admin/Usuarios/usuario.service"; 


//Objeto Usuario
interface Usuario {
  id: number; 
  nombreUsuario: string; 
  email: string; 
}

// Objeto Destinos
interface Destinos {
  id: number; 
  destinoName: string; 
}

// Objeto Experiencia
interface Experiencia {
  id: number; 
  calificacion: string; 
  comentario: string; 
  fecha: string; 
  usuario: Usuario; 
  destinos: Destinos; 
}

@Component({
  providers: [ExperienciaService, HttpClient, UsuarioService], 
  selector: 'app-nueva-experiencia', 
  standalone: true, 
  imports: [ 
    FormsModule, 
    NgIf, 
    ReactiveFormsModule, 
    NgClass, 
    NgForOf, 
    HttpClientModule 
  ],
  templateUrl: './nueva-experiencia.component.html', 
  styleUrl: './nueva-experiencia.component.css' 
})


export class NuevaExperienciaComponent implements OnInit {
  crearForm!: FormGroup; 
  experiencias!: Experiencia; 
  usuarios: Usuario[] = [];
  destinos: Destinos[] = []; 
  isSubmitting: boolean = false; 
  currentUser: Usuario | null = null; 
  fecha: any; 
  comentario: any; 
  calificacion: any; 

  //Constructor
  constructor(
    private formBuilder: FormBuilder, 
    private experienciaService: ExperienciaService, 
    private router: Router,
    private usuariosService: UsuarioService, 
  ) {}

  //Inicializa los datos y configura el componente antes de que se muestre la pantalla.
  ngOnInit(): void {
    this.currentUser = this.usuariosService.getCurrentUser(); //Obtiene el usuario actual autenticado.

    //Si el usuario esta autenticado, se procede a crear un formulario utilizando formularios reactivos.
    this.crearForm = this.formBuilder.group({
      destinos: ['', Validators.required], 
      comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(800)]],
      calificacion: ['', Validators.required] 
    });
    this.cargarDestinos(); //Me muestra los destinos
  }


  cargarDestinos(): void {
    //Devuelve un observable()
    this.experienciaService.recuperarTodosDestinos().subscribe({
      next: (destinos: Destinos[]) => { //Si la solicitud es exitosa, el observable devuelve un arreglo de objetos(lista de destinos).
        this.destinos = destinos; //Arreglo destinos se asigna a la propiedad this.destinos.
      },
      error: (error) => { //Si ocurre un error al llamado del servicio se ejecuta el error.
        console.error(error); 
      },
      complete: () => {
        console.log('Carga de destinos completada');
      }
    });
  }

  onSubmit(): void {
    //Valida si el usuario esta autenticado
    if (!this.currentUser) { 
      Swal.fire('Usuario no autenticado','Debe iniciar sesión para guardar su experiencia.', 'error'); 
      this.router.navigate(['/login']); 
      return; 
    }

    if (this.crearForm.invalid) { 
      Swal.fire('Error', 'Por favor complete el formulario correctamente.', 'error'); 
      return; 
    }

    
    const destinoSeleccionado = this.crearForm.get('destinos')?.value; 
    console.log('Destino seleccionado antes de enviar:', destinoSeleccionado);
    if (!destinoSeleccionado || !destinoSeleccionado.id) { 
      Swal.fire('Error', 'El ID del destino seleccionado no es válido o está vacío.', 'error'); 
      return; 
    }

    const experiencia: Experiencia = {
      id: 0, 
      calificacion: this.crearForm.value.calificacion, 
      comentario: this.crearForm.value.comentario, 
      fecha: new Date().toISOString(), 
      usuario: this.currentUser, 
      destinos: destinoSeleccionado, 
    };

    console.log('Datos que se enviarán: ', experiencia);

    
    this.experienciaService.guardarExperiencia(experiencia).subscribe({
      next: (response) => {
        console.log('Experiencia guardada exitosamente', response);
        
      },
      error: (error) => {
        console.error('Error al guardar la experiencia: ', error); //Error
      }
    });
  }

  limpiarFormulario() {
    this.crearForm.reset(); 
  }

  
  volver() {
    this.router.navigate(['/tu-inicio']); 
  }
}