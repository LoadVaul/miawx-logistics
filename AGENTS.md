# AGENTS.md

## Alcance

MIAWX Logistics es una calculadora pública de recompensas para contratos Courier de EVE Online. Cotiza el transporte y muestra los datos para que el jugador cree el contrato dentro del juego a nombre de `MIAWX LOGISTICS DIV`.

Estas instrucciones aplican a todo el repositorio. Usá el contenido de `main` para reconstruir el contexto de trabajo y registrá en el repositorio las decisiones duraderas que cambien la estructura, las reglas de negocio o el despliegue.

## Estructura

- `index.html` contiene la interfaz, los estilos, las traducciones `en` y `es`, la selección de origen y destino, las validaciones y el cálculo de la recompensa.
- `routes.js` contiene el catálogo `locations` y `routes`, y construye `routesByOrigin`, el índice de rutas por origen y destino. `index.html` carga `./routes.js` antes de inicializar la calculadora.
- El sitio se sirve desde la raíz de `main` mediante GitHub Pages. Actualmente usa HTML, CSS y JavaScript del navegador y se publica sin un paso de compilación propio.

## Rutas y tarifas

Para añadir una ruta con la fórmula existente, editá `routes.js`.

1. Reutilizá los identificadores de estación de `locations`. Para una estación nueva, agregá un identificador estable y el nombre que el jugador debe usar en EVE Online.
2. Agregá una entrada a `routes` con `from`, `to`, `bidirectional`, `iskPerM3` y `collateralRate`. Las tarifas se expresan en ISK por m³ y el porcentaje como fracción decimal (`0.01` equivale a 1 %).
3. Usá `bidirectional: true` cuando la tarifa sea igual en ambos sentidos. Para tarifas distintas, usá dos entradas con `bidirectional: false`, una por sentido. Cada par ordenado debe aparecer una sola vez, contando el sentido inverso generado por las entradas bidireccionales.
4. Conservá las tarifas de las rutas ajenas al pedido. Mantené Jita → Legion Penthouse como selección inicial salvo que se solicite cambiarla. El orden de las entradas determina los primeros valores de los selectores.

La calculadora muestra destinos disponibles para el origen seleccionado y usa la ruta exacta para calcular `volumen × iskPerM3 + colateral × collateralRate`. Una combinación sin servicio debe quedar sin cotización. La cifra mostrada y el valor que se copia se redondean al ISK entero. Los límites vigentes por contrato son 340.000 m³ y 10.000 millones de ISK de colateral. La tarifa mínima de transporte es cero.

## Convenciones de desarrollo

- Concentrá las estaciones y tarifas en el catálogo. Generá las opciones, la cotización y las instrucciones del contrato a partir de la selección activa.
- Actualizá los textos visibles en inglés y español en el mismo cambio. Conservá los nombres de las estaciones tal como figuran en el catálogo y los datos de contrato que se pueden copiar.
- Usá rutas relativas para archivos del sitio. La URL pública vive bajo `/miawx-logistics/`. El código y los recursos publicados son públicos, por lo que las credenciales y los datos privados deben quedar fuera del repositorio.
- Si crece la lógica de precios, extraé primero el cálculo y la validación a funciones independientes del DOM. Mantené las responsabilidades de catálogo, cálculo, traducción e interfaz identificables a medida que se incorporen archivos.

## Verificación y publicación

Para una prueba local, abrí `index.html` en un navegador desde una copia del repositorio con `routes.js` junto al archivo. Revisá la consola si la calculadora no se inicializa.

Usá 10.000 m³ y 1.000 millones de ISK de colateral como caso de regresión para los dos sentidos de cada ruta:

| Ruta | Tarifa | Recompensa esperada |
| --- | --- | ---: |
| Jita ↔ EIMJ-M - LEGION PENTHOUSE | 1.100 ISK/m³ + 1 % del colateral | 21.000.000 ISK |
| Jita ↔ XZ-SKZ - Ram Ranch | 1.000 ISK/m³ + 1 % del colateral | 20.000.000 ISK |

Si modificás la calculadora, verificá también que el selector filtre destinos, que las instrucciones correspondan al origen y al destino en ambos idiomas, y que la recompensa copiada coincida con la que se muestra. Si tocás la validación, probá cero, los límites exactos y los valores negativos, vacíos o por encima del límite.

Para verificar un cambio publicado, revisá el resultado de [GitHub Actions](https://github.com/LoadVaul/miawx-logistics/actions) para el commit correspondiente y abrí la [calculadora pública](https://loadvaul.github.io/miawx-logistics/). Repetí allí la prueba que cubre el cambio.
