// Inicializar el lienzo (canvas)
const canvas = new fabric.Canvas('planoCanvas');
let dibujandoLinea = false;
let lineaActual;

// 1. Agregar Bomba Centrífuga (Círculo con la palabra 'Bomba')
function agregarBomba() {
    desactivarDibujoLibre();
    const grupo = new fabric.Group([
        new fabric.Circle({ radius: 30, fill: 'transparent', stroke: 'black', strokeWidth: 2, originX: 'center', originY: 'center' }),
        new fabric.Text('Bomba', { fontSize: 12, originX: 'center', originY: 'center' })
    ], {
        left: 100, top: 100, selectable: true
    });
    canvas.add(grupo);
}

// 2. Agregar Válvula (Símbolo de corbatín / dos triángulos)
function agregarValvula() {
    desactivarDibujoLibre();
    const triangulo1 = new fabric.Triangle({ width: 30, height: 30, fill: 'transparent', stroke: 'black', strokeWidth: 2, angle: 90, left: 30, top: 0 });
    const triangulo2 = new fabric.Triangle({ width: 30, height: 30, fill: 'transparent', stroke: 'black', strokeWidth: 2, angle: -90, left: 30, top: 30 });
    
    const grupo = new fabric.Group([triangulo1, triangulo2], {
        left: 100, top: 200, selectable: true
    });
    canvas.add(grupo);
}

// 3. Agregar Estanque (Rectángulo con bordes redondeados)
function agregarEstanque() {
    desactivarDibujoLibre();
    const estanque = new fabric.Rect({
        left: 200, top: 100, fill: 'transparent', stroke: 'black', strokeWidth: 2, width: 80, height: 120, rx: 10, ry: 10
    });
    canvas.add(estanque);
}

// 4. Dibujo Libre (Para dibujar accesorios propios a mano alzada)
function toggleDibujoLibre() {
    const btn = document.getElementById('btn-libre');
    canvas.isDrawingMode = !canvas.isDrawingMode;
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 2;

    if (canvas.isDrawingMode) {
        btn.style.backgroundColor = "#f39c12"; // Cambia color para indicar que está activo
        btn.innerText = "🛑 Detener Dibujo Libre";
    } else {
        btn.style.backgroundColor = "#3498db";
        btn.innerText = "✏️ Dibujo Libre (Custom)";
    }
}

function desactivarDibujoLibre() {
    canvas.isDrawingMode = false;
    document.getElementById('btn-libre').style.backgroundColor = "#3498db";
    document.getElementById('btn-libre').innerText = "✏️ Dibujo Libre (Custom)";
}

// 5. Tuberías / Cañerías (Líneas rectas conectables)
function activarDibujoLinea() {
    desactivarDibujoLibre();
    alert("Haz clic en el canvas, mantén presionado y arrastra para dibujar una cañería.");
    
    canvas.on('mouse:down', function(o){
        dibujandoLinea = true;
        let pointer = canvas.getPointer(o.e);
        let puntos = [pointer.x, pointer.y, pointer.x, pointer.y];
        lineaActual = new fabric.Line(puntos, {
            strokeWidth: 2,
            fill: 'black',
            stroke: 'black',
            originX: 'center',
            originY: 'center'
        });
        canvas.add(lineaActual);
    });

    canvas.on('mouse:move', function(o){
        if (!dibujandoLinea) return;
        let pointer = canvas.getPointer(o.e);
        lineaActual.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
    });

    canvas.on('mouse:up', function(o){
        dibujandoLinea = false;
        // Desvincular eventos para que se puedan mover los objetos libremente de nuevo
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
    });
}

// 6. Limpiar Plano
function limpiarLienzo() {
    if(confirm("¿Estás seguro de borrar todo el plano?")) {
        canvas.clear();
        canvas.backgroundColor = 'white';
    }
}

// 7. Exportar a Imagen
function descargarPlano() {
    const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1
    });
    const link = document.createElement('a');
    link.download = 'plano-mecanico.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
