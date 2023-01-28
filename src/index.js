import { fromEvent, merge } from "rxjs";
import { map, mergeAll, takeUntil } from "rxjs/operators";

/*=== Variables === */
const canvas = document.getElementById("reactive-canvas");
const restartButton = document.getElementById("restart-button");
const cursorPosition = {x:0, y:0};

/* === Observables === */
const onMouseDown$ = fromEvent(canvas, "mousedown"); // Cuando se empieza a presionar el click sobre el canvas.
const onMouseUp$ = fromEvent(canvas, "mouseup"); // Cuando se deja de sostener el click sobre el mouse.
const onMouseMove$ = fromEvent(canvas, "mousemove").pipe(
    takeUntil(onMouseUp$) // Al momento de soltar el click del mouse dejar de pintar.
); // Cuando se empieza a arastrar el mouse.
/* A través de mergeAll() empezamos a enviar los enventos de onMouseMove$ mapeados, para luego enviarlos en un observable
de salida al observador paintStroke */
const startPaint$ = onMouseDown$.pipe(
    map(() => onMouseMove$),
    mergeAll()
);

const onLoadWindow$ = fromEvent(window, "load");
const onRestartClick$ = fromEvent(restartButton, "click");

// Función para escuchar dos eventos en solamente una operación a nivel de código.
const restartWhiteBoard$ = merge(onLoadWindow$, onRestartClick$);

/* === Características del canvas para hacer una línea === */
const canvasContext = canvas.getContext("2d"); // Objeto que permite gráficar sobre todo el canvas.
canvasContext.lineWidth = 4; // Ancho de línea.
canvasContext.lineCap = "round"; // Cuando empice la línea sea redondo.
canvasContext.lineJoin = "round"; // Donde termine la línea sea redondo.
canvasContext.strokeStyle = "white"; // Color de línea.

const updateCursorPosition = (event) => {
    cursorPosition.x = event.clientX - canvas.offsetLeft; // Posición en X.
    cursorPosition.y = event.clientY - canvas.offsetTop; // Posición en Y.
};

/* El método painStroke nos permitirá dibujar una línea obteniendo las posiciones del cursos (cursosPosition) a la vez, 
mientras el usuario mueve el cursos actualizamos esa posición. */
const paintStroke = (event) => {
    canvasContext.beginPath(); // Empezar un trazo.
    canvasContext.moveTo(cursorPosition.x, cursorPosition.y); // Coordenadas donde se empiezan a trazar sobre la pizarra.
    updateCursorPosition(event);
    canvasContext.lineTo(cursorPosition.x, cursorPosition.y); // Cordenada donde termirá el trazo.
    canvasContext.stroke(); // Declarar que es una línea.
    canvasContext.closePath(); // Terminar un trazo.
};

/* === Suscripciones === */
onMouseDown$.subscribe();
let onMouseDownSubscription = onMouseDown$.subscribe(updateCursorPosition);
let startPaintSubscription = startPaint$.subscribe(paintStroke);

// Subscripción para borrar el dibujo
restartWhiteBoard$.subscribe(() => {
    onMouseDownSubscription.unsubscribe();
    startPaintSubscription.unsubscribe();
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    onMouseDownSubscription = onMouseDown$.subscribe(updateCursorPosition);
    startPaintSubscription = startPaint$.subscribe(paintStroke);
});