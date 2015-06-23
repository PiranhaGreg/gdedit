/// <reference path="levels.ts" />
/// <reference path="map.ts" />

// create canvas element and append it to document body
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.width = '100%';
canvas.style.height = '100%';

canvas.addEventListener('dragover', draggingOnver);
canvas.addEventListener('drop', drop);

// Show the copy icon when dragging over.
function draggingOnver(e: DragEvent) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

// Get file data on drop
function drop(e: DragEvent) {
	e.stopPropagation();
	e.preventDefault();

	var files = e.dataTransfer.files; // Array of all files
	
	for (var i = 0; i < files.length; i++) {
		var reader = new FileReader();
	
		reader.addEventListener('load', loadMRG);

		reader.readAsArrayBuffer(files[i]);
	}
}

function loadMRG(e: ProgressEvent) {
	var levels = Levels.Decode((<FileReader>e.target).result);
	console.log(levels);

	var result = new CanvasLevel(canvas, levels.Easy[0]);
}