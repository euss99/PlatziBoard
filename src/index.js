import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

/*=== Variables === */
const canvas = document.getElementById("reactive-canvas");

const cursorPosition = {x:0, y:0};

/* === Observables === */
// Cuando se empieza a presionar el click sobre el canvas.
const onMouseDown$ = fromEvent(canvas, "mousedown").pipe(
    map(event => {
        cursorPosition.x = event.clientX - canvas.offsetLeft; // Posición en X.
        cursorPosition.y = event.clientY - canvas.offsetTop; // Posición en Y.
        console.log(cursorPosition);
    })
);

// Cuando se empieza a arastrar el mouse.
const onMouseMove$ = fromEvent(canvas, "mousemove");

// Cuando se deja de sostener el click sobre el mouse.
const onMouseUp$ = fromEvent(canvas, "mouseup"); 

/* === Suscripciones === */
onMouseDown$.subscribe();

/* === Características del canvas para hacer una línea === */
const canvasContext = canvas.getContext("2d"); // Objeto que permite gráficar sobre todo el canvas.
canvasContext.lineWidth = 4; // Ancho de línea.
canvasContext.strokeStyle = "white"; // Color de línea.

canvasContext.beginPath(); // Empezar un trazo.
canvasContext.moveTo(0,0); // Coordenadas donde se empiezan a trazar sobre la pizarra.
canvasContext.lineTo(100,100); // Cordenada donde termirá el trazo.
canvasContext.stroke(); // Declarar que es una línea.
canvasContext.closePath(); // Terminar un trazo.