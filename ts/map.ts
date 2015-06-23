/// <reference path="levels.ts" />

class CanvasLevel {
	zoomFactors = [0.25, 0.33, 0.50, 0.67, 0.75, 0.90, 1, 1.10, 1.25, 1.50, 1.75, 2, 3, 4, 5];
	zoomFactor = 6;

	canvas: HTMLCanvasElement;
	level: Level;
	ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement, level: Level) {
		this.canvas = canvas;
		this.level = level;
		this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
		this.Resize(window.innerWidth, window.innerHeight);

		// fix
		window.addEventListener('resize', (e) => this.Resize(window.innerWidth, window.innerHeight));

		canvas.addEventListener('wheel', (e: WheelEvent) => this.zoom(e));
	}

	public Resize(width: number, height: number) {
		this.ctx.canvas.width = width;
		this.ctx.canvas.height = height;
		this.redraw();
	}

	zoom(e: WheelEvent) {
		if (e.deltaY < 0 && this.zoomFactor < this.zoomFactors.length - 1)
			this.zoomFactor++;
		else if (e.deltaY > 0 && this.zoomFactor > 0)
			this.zoomFactor--;

		console.log(Math.round(100 * this.zoomFactors[this.zoomFactor]) + '%');
		this.redraw();
	}

	getZF() : number {
		return this.zoomFactors[this.zoomFactor];
	}

	redraw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
			var from = new Point(this.getZF() * (track[i].X + offset), this.getZF() * (rev - track[i].Y + min));
			var to = new Point(this.getZF() * (track[i].X + offset), this.getZF() * (rev - track[i].Y + min + 31));
			
			this.drawLine(from, to, '#04aa04', this.getZF());
		}

		for (var i = 0; i < track.length - 1; i++) {
			// back line
			var from = new Point(this.getZF() * (track[i].X + offset), this.getZF() * (rev - track[i].Y + min));
			var to = new Point(this.getZF() * (track[i + 1].X + offset), this.getZF() * (rev - track[i + 1].Y + min));
			
			this.drawLine(from, to, '#04aa04', this.getZF());

			// front line
			var from = new Point(this.getZF() * (track[i].X + offset), this.getZF() * (rev - track[i].Y + min + 31));
			var to = new Point(this.getZF() * (track[i + 1].X + offset), this.getZF() * (rev - track[i + 1].Y + min + 31));
			
			this.drawLine(from, to, '#00ff00', this.getZF());
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