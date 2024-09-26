// Exporta un objeto de configuración llamado `entornos`
export const entornos = {
  production: false, // Indica si el entorno es de producción; `false` significa que es un entorno de desarrollo o pruebas

  // Dirección del host dinámico para las solicitudes HTTP en el entorno de desarrollo
  //dynamicHost: 'localhost:8080', // Desarrollo, utilizado para ejecutar la aplicación localmente

   dynamicHost: 'http://ec2-3-141-3-181.us-east-2.compute.amazonaws.com:8080/' // Pruebas, comentado y pendiente de modificación para entornos de prueba
};
