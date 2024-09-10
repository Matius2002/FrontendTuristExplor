// Importaciones de módulos y componentes necesarios para la configuración de rutas
import { Routes } from '@angular/router'; // Importa Routes para definir la estructura de rutas en la aplicación
import { NuevoAlojamientoComponent } from './Turismo/Alojamiento/nuevo-alojamiento/nuevo-alojamiento.component'; // Componente para agregar un nuevo alojamiento
import { NuevoDestinoComponent } from './Turismo/Destinos/nuevo-destino/nuevo-destino.component'; // Componente para agregar un nuevo destino
import { NuevoTipoTurismoComponent } from './Turismo/TipoTurismo/nuevo-tipo-turismo/nuevo-tipo-turismo.component'; // Componente para agregar un nuevo tipo de turismo
import { NuevoTipoAlojamientoComponent } from './Turismo/TipoAlojamiento/nuevo-tipo-alojamiento/nuevo-tipo-alojamiento.component'; // Componente para agregar un nuevo tipo de alojamiento
import { NuevaNoticiaComponent } from './Turismo/Noticia/nueva-noticia/nueva-noticia.component'; // Componente para agregar una nueva noticia
import { NuevaExperienciaComponent } from './Turismo/Experiencia/nueva-experiencia/nueva-experiencia.component'; // Componente para agregar una nueva experiencia
import { NuevoEventoComponent } from './Turismo/Evento/nuevo-evento/nuevo-evento.component'; // Componente para agregar un nuevo evento
import { NuevaEpocaVisitarComponent } from './Turismo/EpocaVisitar/nueva-epoca-visitar/nueva-epoca-visitar.component'; // Componente para agregar una nueva época de visita
import { NuevaAtracionesComponent } from './Turismo/AtracionPrincipal/nueva-atraciones/nueva-atraciones.component'; // Componente para agregar nuevas atracciones
import { NuevaImagesComponent } from './Turismo/Images/nueva-images/nueva-images.component'; // Componente para agregar nuevas imágenes
import { PagesComponent } from './Pages/pages/pages.component'; // Componente principal de las páginas
//import { NavbarTopbarComponent } from './Shared/navbar-topbar/navbar-topbar.component'; // Componente para la barra de navegación superior
import { NavBarComponent } from './Shared/nav-bar/nav-bar.component'; // Componente para la barra de navegación
import { SistemaComponent } from './Sistema/sistema/sistema.component'; // Componente del sistema
import { TipoTurismoComponent } from './Turismo/TipoTurismo/tipo-turismo/tipo-turismo.component'; // Componente para mostrar tipos de turismo
import { TipoAlojamientoComponent } from './Turismo/TipoAlojamiento/tipo-alojamiento/tipo-alojamiento.component'; // Componente para mostrar tipos de alojamiento
import { ImagesComponent } from './Turismo/Images/images/images.component'; // Componente para mostrar imágenes
import { DestinosComponent } from './Turismo/Destinos/destinos/destinos.component'; // Componente para mostrar destinos
import { AtracionesPrincipalComponent } from './Turismo/AtracionPrincipal/atraciones-principal/atraciones-principal.component'; // Componente para mostrar atracciones principales
import { EpocaVisitarComponent } from './Turismo/EpocaVisitar/epoca-visitar/epoca-visitar.component'; // Componente para mostrar épocas de visita
import { NoticiaComponent } from './Turismo/Noticia/noticia/noticia.component'; // Componente para mostrar noticias
import { EventoComponent } from './Turismo/Evento/evento/evento.component'; // Componente para mostrar eventos
import { ExperienciaComponent } from './Turismo/Experiencia/experiencia/experiencia.component'; // Componente para mostrar experiencias
import { NuevoRolComponent } from './Admin/Rol/nuevo-rol/nuevo-rol.component'; // Componente para agregar un nuevo rol
import { NuevoPermisoComponent } from './Admin/Permiso/nuevo-permiso/nuevo-permiso.component'; // Componente para agregar un nuevo permiso
import { NuevoUsuarioComponent } from './Admin/Usuarios/nuevo-usuario/nuevo-usuario.component'; // Componente para agregar un nuevo usuario
import { RolesComponent } from './Admin/Rol/roles/roles.component'; // Componente para mostrar roles
import { PermisosComponent } from './Admin/Permiso/permisos/permisos.component'; // Componente para mostrar permisos
import { UsuariosComponent } from './Admin/Usuarios/usuarios/usuarios.component'; // Componente para mostrar usuarios
import { LoginComponent } from './Admin/Usuarios/login/login.component'; // Componente de inicio de sesión
import { ReportesComponent } from './Reportes/reportes/reportes.component'; // Componente para mostrar reportes
import { EventoContenidoComponent } from './Turismo/Evento/evento-contenido/evento-contenido.component'; // Componente para mostrar contenido de eventos
import { InicioComponent } from './Admin/inicio/inicio.component'; // Componente para la página de inicio
import { ConoceGirardotComponent } from './Admin/conoce-girardot/conoce-girardot.component'; // Componente para conocer Girardot
import { ExperienciaContenidoComponent } from './Turismo/Experiencia/experiencia-contenido/experiencia-contenido.component'; // Componente para mostrar contenido de experiencias
import { NoticiasContenidoComponent } from './Turismo/Noticia/noticias-contenido/noticias-contenido.component'; // Componente para mostrar contenido de noticias
import { AlojamientoContenidoComponent } from './Turismo/TipoAlojamiento/alojamiento-contenido/alojamiento-contenido.component'; // Componente para mostrar contenido de alojamientos
import { TurismoCulturalComponent } from './Turismo/TipoTurismo/turismo-cultural/turismo-cultural.component'; // Componente para mostrar turismo cultural
import { TurismoGastronomicoComponent } from './Turismo/TipoTurismo/turismo-gastronomico/turismo-gastronomico.component'; // Componente para mostrar turismo gastronómico
import { TurismoReligiosoComponent } from './Turismo/TipoTurismo/turismo-religioso/turismo-religioso.component'; // Componente para mostrar turismo religioso
import { TurismoComprasComponent } from './Turismo/TipoTurismo/turismo-compras/turismo-compras.component'; // Componente para mostrar turismo de compras
import { TurismoAventurasComponent } from './Turismo/TipoTurismo/turismo-aventuras/turismo-aventuras.component'; // Componente para mostrar turismo de aventuras
import { TurismoNocturnoComponent } from './Turismo/TipoTurismo/turismo-nocturno/turismo-nocturno.component'; // Componente para mostrar turismo nocturno
import { BreadcrumbsComponent } from './Shared/breadcrumbs/breadcrumbs.component'; // Componente para mostrar migas de pan
import { AlojamientoComponent } from './Turismo/Alojamiento/alojamiento/alojamiento.component'; // Componente para mostrar alojamientos
import { FooterComponent } from './Shared/footer/footer.component'; // Componente para el pie de página
import { TurismoSostenibleComponent } from './Turismo/TipoTurismo/turismo-sostenible/turismo-sostenible.component'; // Componente para mostrar turismo sostenible
import { MapasTuristicosComponent } from './Mapas/mapas-turisticos/mapas-turisticos.component'; // Componente para mostrar mapas turísticos
import { DetalleNoticiaComponent } from './Turismo/Noticia/detalle-noticia/detalle-noticia.component'; // Componente para mostrar detalles de una noticia
import { VisitGuard } from './guard/VisitGuard'; // Guardián de rutas personalizado para proteger el acceso
import { authGuard } from './auth.guard'; // Guardián de autenticación para proteger rutas

// Definición de las rutas principales de la aplicación
export const routes: Routes = [
  {
    path: '', // Ruta raíz
    redirectTo: 'login', // Redirige al login
    pathMatch: 'full' // Asegura que la ruta raíz redirige completamente
  },
  {
    path: 'login', // Ruta para el login
    component: LoginComponent
  },
  {
    path: '', // Ruta raíz
    component: PagesComponent, // Componente principal que envuelve las rutas hijas
    children: [
      //{ path: '', redirectTo: 'tu-inicio', pathMatch: 'full' },
      { path: 'tu-inicio', component: InicioComponent, canActivate: [authGuard] }, // Ruta de inicio protegida por el guardián de autenticación
      { path: 'Conoce-Girardot', component: ConoceGirardotComponent, canActivate: [authGuard] }, // Ruta protegida que muestra información sobre Girardot
      { path: 'sistemas', component: SistemaComponent, canActivate: [authGuard] }, // Ruta protegida para sistemas
      { path: 'evento-contenido', component: EventoContenidoComponent, canActivate: [authGuard] }, // Ruta protegida para contenido de eventos
      { path: 'tipo-sostenible', component: TurismoSostenibleComponent, canActivate: [authGuard] }, // Ruta protegida para turismo sostenible
      { path: 'nueva-experiencia', component: NuevaExperienciaComponent, canActivate: [authGuard] }, // Ruta protegida para agregar una nueva experiencia
      { path: 'noticias/:id', component: DetalleNoticiaComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar detalles de una noticia con ID
      { path: 'noticia-contenido', component: NoticiasContenidoComponent, canActivate: [authGuard] }, // Ruta protegida para contenido de noticias
      { path: 'tipo-cultural', component: TurismoCulturalComponent, canActivate: [authGuard] }, // Ruta protegida para turismo cultural
      { path: 'tipo-gastronomico', component: TurismoGastronomicoComponent, canActivate: [authGuard] }, // Ruta protegida para turismo gastronómico
      { path: 'tipo-religioso', component: TurismoReligiosoComponent, canActivate: [authGuard] }, // Ruta protegida para turismo religioso
      { path: 'tipo-aventura', component: TurismoAventurasComponent, canActivate: [authGuard] }, // Ruta protegida para turismo de aventuras
      { path: 'tipo-compras', component: TurismoComprasComponent, canActivate: [authGuard] }, // Ruta protegida para turismo de compras
      { path: 'tipo-nocturno', component: TurismoNocturnoComponent, canActivate: [authGuard] }, // Ruta protegida para turismo nocturno
      { path: 'alojamiento-contenido', component: AlojamientoContenidoComponent, canActivate: [authGuard] }, // Ruta protegida para contenido de alojamiento
      { path: 'destinos', component: DestinosComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar destinos
      { path: 'tipo-turismo', component: TipoTurismoComponent, canActivate: [authGuard] }, // Ruta protegida para tipos de turismo
      { path: 'tipo-alojamiento', component: TipoAlojamientoComponent, canActivate: [authGuard] }, // Ruta protegida para tipos de alojamiento
      { path: 'images', component: ImagesComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar imágenes
      { path: 'atraciones-principales', component: AtracionesPrincipalComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar atracciones principales
      { path: 'epoca-visitar', component: EpocaVisitarComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar épocas de visita
      { path: 'noticias', component: NoticiaComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar noticias
      { path: 'eventos', component: EventoComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar eventos
      { path: 'experiencias', component: ExperienciaComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar experiencias
      { path: 'roles', component: RolesComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar roles
      { path: 'permisos', component: PermisosComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar permisos
      { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar usuarios
      { path: 'reportes', component: ReportesComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar reportes
      { path: 'alojamientos', component: AlojamientoComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar alojamientos

      // Subramas (rutas adicionales que corresponden a subcomponentes específicos)
      { path: 'nuevo-destinos', component: NuevoDestinoComponent, canActivate: [authGuard] }, // Ruta protegida para añadir nuevos destinos
      { path: 'nuevo-tipoTurismo', component: NuevoTipoTurismoComponent, canActivate: [authGuard] }, // Ruta protegida para añadir nuevos tipos de turismo
      { path: 'nuevo-tipoAlojamiento', component: NuevoTipoAlojamientoComponent, canActivate: [authGuard] }, // Ruta protegida para añadir nuevos tipos de alojamiento
      { path: 'nueva-noticia', component: NuevaNoticiaComponent, canActivate: [authGuard] }, // Ruta protegida para añadir una nueva noticia
      { path: 'nuevo-evento', component: NuevoEventoComponent, canActivate: [authGuard] }, // Ruta protegida para añadir un nuevo evento
      { path: 'nueva-epoca', component: NuevaEpocaVisitarComponent, canActivate: [authGuard] }, // Ruta protegida para añadir una nueva época de visita
      { path: 'nueva-atracciones', component: NuevaAtracionesComponent, canActivate: [authGuard] }, // Ruta protegida para añadir nuevas atracciones
      { path: 'nueva-imagen', component: NuevaImagesComponent, canActivate: [authGuard] }, // Ruta protegida para añadir una nueva imagen
      { path: 'nuevo-rol', component: NuevoRolComponent, canActivate: [authGuard] }, // Ruta protegida para añadir un nuevo rol
      { path: 'nuevo-permiso', component: NuevoPermisoComponent, canActivate: [authGuard] }, // Ruta protegida para añadir un nuevo permiso
      { path: 'nuevo-usuario', component: NuevoUsuarioComponent }, // Ruta protegida para añadir un nuevo usuario
      { path: 'nuevo-alojamiento', component: NuevoAlojamientoComponent, canActivate: [authGuard] }, // Ruta protegida para añadir un nuevo alojamiento
    ]
  },
  { path: 'login', component: LoginComponent }, // Ruta de login, no protegida por el guardián de autenticación
  { path: 'pages', component: PagesComponent, canActivate: [authGuard] }, // Ruta protegida para el componente de páginas generales
  //{ path: 'topbar', component: NavbarTopbarComponent, canActivate: [authGuard] }, // Ruta protegida para el componente de la barra superior
  { path: 'navbar', component: NavBarComponent, canActivate: [authGuard] }, // Ruta protegida para la barra de navegación
  { path: 'breadcrumbs', component: BreadcrumbsComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar migas de pan
  { path: 'footer', component: FooterComponent, canActivate: [authGuard] }, // Ruta protegida para el pie de página
  { path: 'rutas-map', component: MapasTuristicosComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar mapas turísticos
  { path: 'tu-experiencia', component: ExperienciaContenidoComponent, canActivate: [authGuard] }, // Ruta protegida para mostrar experiencias del usuario
];