import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


// Importación de todos los componentes necesarios
import { NuevoAlojamientoComponent } from './Turismo/Alojamiento/nuevo-alojamiento/nuevo-alojamiento.component';
import { NuevoDestinoComponent } from './Turismo/Destinos/nuevo-destino/nuevo-destino.component';
import { NuevoTipoTurismoComponent } from './Turismo/TipoTurismo/nuevo-tipo-turismo/nuevo-tipo-turismo.component';
import { NuevoTipoAlojamientoComponent } from './Turismo/TipoAlojamiento/nuevo-tipo-alojamiento/nuevo-tipo-alojamiento.component';
import { NuevaNoticiaComponent } from './Turismo/Noticia/nueva-noticia/nueva-noticia.component';
import { NuevaExperienciaComponent } from './Turismo/Experiencia/nueva-experiencia/nueva-experiencia.component';
import { NuevoEventoComponent } from './Turismo/Evento/nuevo-evento/nuevo-evento.component';
import { NuevaEpocaVisitarComponent } from './Turismo/EpocaVisitar/nueva-epoca-visitar/nueva-epoca-visitar.component';
import { NuevaAtracionesComponent } from './Turismo/AtracionPrincipal/nueva-atraciones/nueva-atraciones.component';
import { NuevaImagesComponent } from './Turismo/Images/nueva-images/nueva-images.component';
import { PagesComponent } from './Pages/pages/pages.component';
import { NavbarTopbarComponent } from './Shared/navbar-topbar/navbar-topbar.component';
import { NavBarComponent } from './Shared/nav-bar/nav-bar.component';
import { SistemaComponent } from './Sistema/sistema/sistema.component';
import { TipoTurismoComponent } from './Turismo/TipoTurismo/tipo-turismo/tipo-turismo.component';
import { TipoAlojamientoComponent } from './Turismo/TipoAlojamiento/tipo-alojamiento/tipo-alojamiento.component';
import { ImagesComponent } from './Turismo/Images/images/images.component';
import { DestinosComponent } from './Turismo/Destinos/destinos/destinos.component';
import { AtracionesPrincipalComponent } from './Turismo/AtracionPrincipal/atraciones-principal/atraciones-principal.component';
import { EpocaVisitarComponent } from './Turismo/EpocaVisitar/epoca-visitar/epoca-visitar.component';
import { NoticiaComponent } from './Turismo/Noticia/noticia/noticia.component';
import { EventoComponent } from './Turismo/Evento/evento/evento.component';
import { ExperienciaComponent } from './Turismo/Experiencia/experiencia/experiencia.component';
import { NuevoRolComponent } from './Admin/Rol/nuevo-rol/nuevo-rol.component';
import { NuevoPermisoComponent } from './Admin/Permiso/nuevo-permiso/nuevo-permiso.component';
import { NuevoUsuarioComponent } from './Admin/Usuarios/nuevo-usuario/nuevo-usuario.component';
import { RolesComponent } from './Admin/Rol/roles/roles.component';
import { PermisosComponent } from './Admin/Permiso/permisos/permisos.component';
import { UsuariosComponent } from './Admin/Usuarios/usuarios/usuarios.component';
import { LoginComponent } from './Admin/Usuarios/login/login.component';
import { ReportesComponent } from './Reportes/reportes/reportes.component';
import { EventoContenidoComponent } from './Turismo/Evento/evento-contenido/evento-contenido.component';
import { InicioComponent } from './Admin/inicio/inicio.component';
import { ConoceGirardotComponent } from './Admin/conoce-girardot/conoce-girardot.component';
import { ExperienciaContenidoComponent } from './Turismo/Experiencia/experiencia-contenido/experiencia-contenido.component';
import { NoticiasContenidoComponent } from './Turismo/Noticia/noticias-contenido/noticias-contenido.component';
import { AlojamientoContenidoComponent } from './Turismo/TipoAlojamiento/alojamiento-contenido/alojamiento-contenido.component';
import { TurismoCulturalComponent } from './Turismo/TipoTurismo/turismo-cultural/turismo-cultural.component';
import { TurismoGastronomicoComponent } from './Turismo/TipoTurismo/turismo-gastronomico/turismo-gastronomico.component';
import { TurismoReligiosoComponent } from './Turismo/TipoTurismo/turismo-religioso/turismo-religioso.component';
import { TurismoComprasComponent } from './Turismo/TipoTurismo/turismo-compras/turismo-compras.component';
import { TurismoAventurasComponent } from './Turismo/TipoTurismo/turismo-aventuras/turismo-aventuras.component';
import { TurismoNocturnoComponent } from './Turismo/TipoTurismo/turismo-nocturno/turismo-nocturno.component';
import { BreadcrumbsComponent } from './Shared/breadcrumbs/breadcrumbs.component';
import { AlojamientoComponent } from './Turismo/Alojamiento/alojamiento/alojamiento.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { TurismoSostenibleComponent } from './Turismo/TipoTurismo/turismo-sostenible/turismo-sostenible.component';
import {MapasTuristicosComponent} from "./Mapas/mapas-turisticos/mapas-turisticos.component";
import {DetalleNoticiaComponent} from "./Turismo/Noticia/detalle-noticia/detalle-noticia.component";
import {VisitGuard} from "./guard/VisitGuard";

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'tu-inicio', pathMatch: 'full' },
      { path: 'tu-inicio', component: InicioComponent },
      { path: 'Conoce-Girardot', component: ConoceGirardotComponent, canActivate: [VisitGuard] },
      { path: 'sistemas', component: SistemaComponent },
      { path: 'evento-contenido', component: EventoContenidoComponent },
      { path: 'tipo-sostenible', component: TurismoSostenibleComponent },
      { path: 'nueva-experiencia', component: NuevaExperienciaComponent },

      { path: 'noticias/:id', component: DetalleNoticiaComponent },

      { path: 'noticia-contenido', component: NoticiasContenidoComponent },
      { path: 'tipo-cultural', component: TurismoCulturalComponent },
      { path: 'tipo-gastronomico', component: TurismoGastronomicoComponent },
      { path: 'tipo-religioso', component: TurismoReligiosoComponent },
      { path: 'tipo-aventura', component: TurismoAventurasComponent },
      { path: 'tipo-compras', component: TurismoComprasComponent },
      { path: 'tipo-nocturno', component: TurismoNocturnoComponent },
      { path: 'alojamiento-contenido', component: AlojamientoContenidoComponent },
      { path: 'destinos', component: DestinosComponent },
      { path: 'tipo-turismo', component: TipoTurismoComponent },
      { path: 'tipo-alojamiento', component: TipoAlojamientoComponent },
      { path: 'images', component: ImagesComponent },
      { path: 'atraciones-principales', component: AtracionesPrincipalComponent },
      { path: 'epoca-visitar', component: EpocaVisitarComponent },
      { path: 'noticias', component: NoticiaComponent },
      { path: 'eventos', component: EventoComponent },
      { path: 'experiencias', component: ExperienciaComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'permisos', component: PermisosComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'login', component: LoginComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'alojamientos', component: AlojamientoComponent },

      //SUB RAMAS
      { path: 'nuevo-destinos', component: NuevoDestinoComponent },
      { path: 'nuevo-tipoTurismo', component: NuevoTipoTurismoComponent },
      { path: 'nuevo-tipoAlojamiento', component: NuevoTipoAlojamientoComponent },
      { path: 'nueva-noticia', component: NuevaNoticiaComponent },
      { path: 'nuevo-evento', component: NuevoEventoComponent },
      { path: 'nueva-epoca', component: NuevaEpocaVisitarComponent },
      { path: 'nueva-atracciones', component: NuevaAtracionesComponent },
      { path: 'nueva-imagen', component: NuevaImagesComponent },
      { path: 'nuevo-rol', component: NuevoRolComponent },
      { path: 'nuevo-permiso', component: NuevoPermisoComponent },
      { path: 'nuevo-usuario', component: NuevoUsuarioComponent },
      { path: 'nuevo-alojamiento', component: NuevoAlojamientoComponent },

    ]
  },
  { path: 'pages', component: PagesComponent },
  { path: 'topbar', component: NavbarTopbarComponent },
  { path: 'navbar', component: NavBarComponent },
  { path: 'breadcrumbs', component: BreadcrumbsComponent },
  { path: 'footer', component: FooterComponent },

  {path: 'rutas-map', component: MapasTuristicosComponent},
  {path: 'tu-experiencia', component: ExperienciaContenidoComponent },
];


