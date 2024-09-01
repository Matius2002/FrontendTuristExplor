// Exporta un objeto de configuración llamado `entornos`
export const entornos = {
  production: false, // Indica si el entorno es de producción; `false` significa que es un entorno de desarrollo o pruebas

  // Dirección del host dinámico para las solicitudes HTTP en el entorno de desarrollo
  dynamicHost: 'localhost:8080', // Desarrollo, utilizado para ejecutar la aplicación localmente

  // dynamicHost: '10.100.207.13:8080' // Pruebas, comentado y pendiente de modificación para entornos de prueba
};
