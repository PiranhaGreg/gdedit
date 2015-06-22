/// <reference path="levels.ts" />

var levels: Levels = null;

// create canvas element and append it to document body
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.width = '100%';
canvas.style.height = '100%';

// get canvas 2D context and set correct size
var ctx = canvas.getContext('2d');
resize();

window.addEventListener('resize', resize);

// resize canvas
function resize(e?: UIEvent) {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	draw();
}

function draw() {
	if (levels === null)
		return;

	var intro = levels.Hard[6].Track;
	var offset = -intro[0].X;
	
	var min = intro[0].Y;
	var max = intro[0].Y;

	for (var i = 1; i < intro.length; i++) {
		if (intro[i].Y < min)
			min = intro[i].Y;

		if (intro[i].Y > max)
			max = intro[i].Y;
	}

	var rev = max - min;

	for (var i = 0; i < intro.length - 1; i++) {
		ctx.beginPath(); // begin
	
		ctx.lineWidth = 1;
		ctx.lineCap = 'round';
		ctx.strokeStyle = '#04aa04';

		ctx.moveTo(intro[i].X + offset, rev - intro[i].Y + min); // from
		ctx.lineTo(intro[i + 1].X + offset, rev - intro[i + 1].Y + min); // to
	
		ctx.stroke(); // draw it!
	}
}

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
canvas.addEventListener('dragover', function(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
canvas.addEventListener('drop', function(e) {
	e.stopPropagation();
	e.preventDefault();

	var files = e.dataTransfer.files; // Array of all files
	
	for (var i = 0; i < files.length; i++) {
		var reader = new FileReader();
	
		reader.addEventListener('load', (e2) => {
			levels = Levels.Decode(reader.result);
			draw();
			console.log(levels);
		});

		reader.readAsArrayBuffer(files[i]); // start reading the file data.
	}
});