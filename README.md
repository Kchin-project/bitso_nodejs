# Bitso_nodejs
## NodeJS Librería para la API de BITSO
*Esta librería fue creada para uso interno de K-chin, usala bajo tu propio riesgo.*

- bitso_nodejs solamente contempla el uso de la API privada de [Bitso](https://bitso.com), para obtener la información de la API visita: [Bisto Docs](https://bitso.com/api_info)

### Uso
Instalación : 
```
npm install bitso_nodejs
```
Ejemplo general:
```javascript
var bitso_nodejs = require('bitso_nodejs');

//call a method
bitso_nodejs.requestPrivate(endpoint, params, method, credentials)
            .then(function(result){
              //Do something with the result
              console.log(result);
            });
```
Ejemplo Crear una dirección de depósito para tu cuenta:
```javascript
bitso_nodejs.requestPrivate('/funding_destination',
                            {fund_currency:'btc'}, 'get',
                            {key:'xxxxxxx', secret:'xxxxxxxxxxxxxxxx'})
            .then(function(result){
              //Do something with the result              
              console.log(result);
            });
```

Consulta la [documentación oficial](https://bitso.com) para más información.
