import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {RolesService} from "../roles.service";
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";

interface  Rol {
  id: number;
  rolName: string;
  rolDescripc: string;
  rolFechaCreac: Date;
  rolFechaModic: Date;
}
@Component({
  providers: [RolesService],
  selector: 'app-editar-roles',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
    NgForOf,
  ],
  templateUrl: './editar-roles.component.html',
  styleUrl: './editar-roles.component.css'
})
export class EditarRolesComponent implements OnInit{
  crearForm!: FormGroup;
  roles!: Rol;
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditarRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rolesService: RolesService,
  ) {
    this.roles = data.roles;
  }
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      rolName: [this.data.rol.rolName, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      rolDescripc: [this.data.rol.rolDescripc, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      rolFechaCreac: [this.data.rol.rolFechaCreac, [Validators.required]],
      rolFechaModic: [this.data.rol.rolFechaModic, [Validators.required]],
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().slice(0, 16);
  }

  private findSelectedItems(array: any[], ids: number[]): any[] {
    return array.filter(item => ids.includes(item.id));
  }

  onSubmit(): void {
    if (this.crearForm.valid) {
      const rolActualizada = this.crearForm.value;

      this.rolesService.actualizarRol(this.roles.id, rolActualizada).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'El Rol se ha actualizado correctamente.', 'success');
        },
        error => {
          console.error('Error al actualizar el Rol:', error);
          Swal.fire('¡Error!', 'Hubo un error al actualizar el Rol.', 'error');
        }
      );
    } else {
      this.crearForm.markAllAsTouched();
    }
  }


  onCancelar(): void {
    this.dialogRef.close();
  }

  onClearForm(): void {
    this.crearForm.reset();
  }
}
