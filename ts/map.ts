/// <reference path="levels.ts" />

class CanvasLevel {
	canvas: HTMLCanvasElement;
	level: Level;
	ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement, level: Level) {
		this.canvas = canvas;
		this.level = level;
		this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
		this.resize();
		this.redraw();
	}

	resize(e?: UIEvent) {
		this.ctx.canvas.width = window.innerWidth;
		this.ctx.canvas.height = window.innerHeight;
		this.redraw();
	}

	redraw() {
		var track = this.level.Track;
		var offset = -track[0].X;

		var min = track[0].Y;
		var max = track[0].Y;

		for (var i = 1; i < track.length; i++) {
			if (track[i].Y < min)
				min = track[i].Y;

			if (track[i].Y > max)
				max = track[i].Y;
		}

		var rev = max - min;

		// main horizontal line
		this.drawLine(new Point(0, rev + min), new Point(this.ctx.canvas.width, rev + min), '#ccc');

		// main vertical line
		this.drawLine(new Point(offset, 0), new Point(offset, this.ctx.canvas.height), '#ccc');


		// track
		for (var i = 0; i < track.length; i++) {
			var from = new Point(track[i].X + offset, rev - track[i].Y + min);
			var to = new Point(track[i].X + offset, rev - track[i].Y + min + 31);
			
			this.drawLine(from, to, '#04aa04');
		}

		for (var i = 0; i < track.length - 1; i++) {
			// back line
			var from = new Point(track[i].X + offset, rev - track[i].Y + min);
			var to = new Point(track[i + 1].X + offset, rev - track[i + 1].Y + min);
			
			this.drawLine(from, to, '#04aa04');

			// front line
			var from = new Point(track[i].X + offset, rev - track[i].Y + min + 31);
			var to = new Point(track[i + 1].X + offset, rev - track[i + 1].Y + min + 31);
			
			this.drawLine(from, to, '#00ff00');
		}
	}

	drawLine(from: Point, to: Point, color: string, lineWidth = 1) {
		this.ctx.beginPath();
		
		this.ctx.lineWidth = lineWidth;
		this.ctx.lineCap = 'round';
		this.ctx.strokeStyle = color;

		this.ctx.moveTo(from.X + 0.5, from.Y + 0.5);
		this.ctx.lineTo(to.X + 0.5, to.Y + 0.5);
	
		this.ctx.stroke();
	} 
}