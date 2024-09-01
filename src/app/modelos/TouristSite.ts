// Exporta la interfaz `TouristSite` que define la estructura de un sitio turístico
export interface TouristSite {
  id?: number; // Identificador único del sitio turístico (opcional)
  title: string; // Título o nombre del sitio turístico
  content: string; // Descripción o contenido sobre el sitio turístico
  tourismType: string; // Tipo de turismo asociado al sitio (por ejemplo, cultural, aventura)
  latitude: number; // Coordenada de latitud del sitio, utilizada para posicionarlo en un mapa
  longitude: number; // Coordenada de longitud del sitio, utilizada para posicionarlo en un mapa
}
