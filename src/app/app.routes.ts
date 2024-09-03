/* Importaciones de módulos y componentes necesarios para la configuración de rutas */
import { Routes } from '@angular/router';
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
import { authGuard } from './auth.guard';

// Definición de las rutas principales de la aplicación
export const routes: Routes = [
  {
    path: '', // Ruta raíz
    component: PagesComponent, // Componente principal que envuelve las rutas hijas
    children: [
      { path: '', redirectTo: 'tu-inicio', pathMatch: 'full' }, // Redirige a 'tu-inicio' si la ruta está vacía
      { path: 'tu-inicio', component: InicioComponent}, // Ruta de inicio
      { path: 'Conoce-Girardot', component: ConoceGirardotComponent, canActivate: [authGuard] }, // Ruta protegida que muestra información sobre Girardot
      { path: 'sistemas', component: SistemaComponent, canActivate: [authGuard] }, // Ruta protegida para sistemas
      { path: 'evento-contenido', component: EventoContenidoComponent, canActivate: [authGuard] },
      { path: 'tipo-sostenible', component: TurismoSostenibleComponent, canActivate: [authGuard] },
      { path: 'nueva-experiencia', component: NuevaExperienciaComponent, canActivate: [authGuard] },
      { path: 'noticias/:id', component: DetalleNoticiaComponent, canActivate: [authGuard] },
      { path: 'noticia-contenido', component: NoticiasContenidoComponent, canActivate: [authGuard] },
      { path: 'tipo-cultural', component: TurismoCulturalComponent, canActivate: [authGuard] },
      { path: 'tipo-gastronomico', component: TurismoGastronomicoComponent, canActivate: [authGuard] },
      { path: 'tipo-religioso', component: TurismoReligiosoComponent, canActivate: [authGuard] },
      { path: 'tipo-aventura', component: TurismoAventurasComponent, canActivate: [authGuard] },
      { path: 'tipo-compras', component: TurismoComprasComponent, canActivate: [authGuard] },
      { path: 'tipo-nocturno', component: TurismoNocturnoComponent, canActivate: [authGuard] },
      { path: 'alojamiento-contenido', component: AlojamientoContenidoComponent, canActivate: [authGuard] },
      { path: 'destinos', component: DestinosComponent, canActivate: [authGuard] },
      { path: 'tipo-turismo', component: TipoTurismoComponent, canActivate: [authGuard] },
      { path: 'tipo-alojamiento', component: TipoAlojamientoComponent, canActivate: [authGuard] },
      { path: 'images', component: ImagesComponent, canActivate: [authGuard] },
      { path: 'atraciones-principales', component: AtracionesPrincipalComponent, canActivate: [authGuard] },
      { path: 'epoca-visitar', component: EpocaVisitarComponent, canActivate: [authGuard] },
      { path: 'noticias', component: NoticiaComponent, canActivate: [authGuard] },
      { path: 'eventos', component: EventoComponent, canActivate: [authGuard] },
      { path: 'experiencias', component: ExperienciaComponent, canActivate: [authGuard] },
      { path: 'roles', component: RolesComponent, canActivate: [authGuard] },
      { path: 'permisos', component: PermisosComponent, canActivate: [authGuard] },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent }, // Ruta de login, no protegida por el guardián de autenticación
      { path: 'reportes', component: ReportesComponent, canActivate: [authGuard] },
      { path: 'alojamientos', component: AlojamientoComponent, canActivate: [authGuard] },

      // Subramas (rutas adicionales que corresponden a subcomponentes específicos)
      { path: 'nuevo-destinos', component: NuevoDestinoComponent, canActivate: [authGuard] }, // Ruta protegida para añadir nuevos destinos
      { path: 'nuevo-tipoTurismo', component: NuevoTipoTurismoComponent, canActivate: [authGuard] }, // Ruta protegida para añadir nuevos tipos de turismo
      { path: 'nuevo-tipoAlojamiento', component: NuevoTipoAlojamientoComponent, canActivate: [authGuard] },
      { path: 'nueva-noticia', component: NuevaNoticiaComponent, canActivate: [authGuard] },
      { path: 'nuevo-evento', component: NuevoEventoComponent, canActivate: [authGuard] },
      { path: 'nueva-epoca', component: NuevaEpocaVisitarComponent, canActivate: [authGuard] },
      { path: 'nueva-atracciones', component: NuevaAtracionesComponent, canActivate: [authGuard] },
      { path: 'nueva-imagen', component: NuevaImagesComponent, canActivate: [authGuard] },
      { path: 'nuevo-rol', component: NuevoRolComponent, canActivate: [authGuard] },
      { path: 'nuevo-permiso', component: NuevoPermisoComponent, canActivate: [authGuard] },
      { path: 'nuevo-usuario', component: NuevoUsuarioComponent, canActivate: [authGuard] },
      { path: 'nuevo-alojamiento', component: NuevoAlojamientoComponent, canActivate: [authGuard] },
    ]
  },
  { path: 'pages', component: PagesComponent, canActivate: [authGuard] }, // Ruta protegida para el componente de páginas generales
  { path: 'topbar', component: NavbarTopbarComponent, canActivate: [authGuard] }, // Ruta protegida para el componente de la barra superior
  { path: 'navbar', component: NavBarComponent, canActivate: [authGuard] }, // Ruta protegida para la barra de navegación
  { path: 'breadcrumbs', component: BreadcrumbsComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar migas de pan
  { path: 'footer', component: FooterComponent, canActivate: [authGuard] }, // Ruta protegida para el pie de página
  { path: 'rutas-map', component: MapasTuristicosComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar mapas turísticos
  { path: 'tu-experiencia', component: ExperienciaContenidoComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar experiencias del usuario
];


