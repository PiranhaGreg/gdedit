// create canvas element and append it to document body
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed'; // (≖_≖ )

// get canvas 2D context and set correct size
var ctx = canvas.getContext('2d');
resize();

// last known position
var pos = { x: 0, y: 0 };

window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

// set new position from mouse event
function setPosition(e: MouseEvent) {
	pos.x = e.clientX;
	pos.y = e.clientY;
}

// resize canvas
function resize(e?: UIEvent) {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
}

function draw(e: MouseEvent) {
	// mouse left button must be pressed
	if (e.buttons !== 1) return;

	ctx.beginPath(); // begin
	
	ctx.lineWidth = 5;
	ctx.lineCap = 'round';
	ctx.strokeStyle = '#c0392b';
	
	ctx.moveTo(pos.x, pos.y); // from
	setPosition(e);
	ctx.lineTo(pos.x, pos.y); // to
	
	ctx.stroke(); // draw it!
}