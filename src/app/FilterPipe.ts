import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'filterBy'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    // Implementa tu lógica de filtrado.
    return value.filter(item =>
      (item.destinoName && item.destinoName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.nombre && item.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.titulo && item.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.comentario && item.comentario.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.rolName && item.rolName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.nombreUsuario && item.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.ubicacion && item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
}
