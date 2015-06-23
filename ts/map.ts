/// <reference path="levels.ts" />

class CanvasLevel {
	zoomFactors = [0.25, 0.33, 0.50, 0.67, 0.75, 0.90, 1, 1.10, 1.25, 1.50, 1.75, 2, 3, 4, 5];
	zoomFactor = 6;

	dim3 = true;

	canvas: HTMLCanvasElement;
	level: Level;
	ctx: CanvasRenderingContext2D;

	lastPoint = new Point(0, 0);
	offset = new Point(0, 0);

	constructor(canvas: HTMLCanvasElement, level: Level) {
		this.canvas = canvas;
		this.level = level;
		this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

		this.Resize(window.innerWidth, window.innerHeight); // TODO
		this.BestFit();

		window.addEventListener('resize', (e) => this.Resize(window.innerWidth, window.innerHeight)); // TODO

		canvas.addEventListener('wheel', (e: WheelEvent) => this.zoom(e));
		
		canvas.addEventListener('mousedown', (e) => {
			this.lastPoint.X = e.x;
			this.lastPoint.Y = e.y;
		});

		canvas.addEventListener('mousemove', (e) => {
			if (e.buttons !== 1) return;

			this.offset.X += e.x - this.lastPoint.X;
			this.offset.Y += e.y - this.lastPoint.Y;

			this.lastPoint.X = e.x;
			this.lastPoint.Y = e.y;

			this.redraw();
		});

		canvas.addEventListener('mouseenter', (e) => {

		});
	}

	public BestFit() {
		var track = this.level.Track;

		var min = new Point(track[0].X, track[0].Y);
		var max = new Point(track[0].X, track[0].Y);

		for (var i = 1; i < track.length; i++) {
			if (track[i].Y < min.Y) min.Y = track[i].Y;
			if (track[i].X < min.X) min.X = track[i].X;
			if (track[i].Y > max.Y) max.Y = track[i].Y;
			if (track[i].X > max.X) max.X = track[i].X;
		}

		var height = max.Y - min.Y;
		var width = max.X - min.X;

		// best fit
		this.zoomFactor = this.zoomFactors.length - 1;

		while (this.zoomFactor > 0 && (
			this.getZF() * height > this.canvas.height ||
			this.getZF() * width > this.canvas.width))
			this.zoomFactor--;

		height *= this.getZF();
		width *= this.getZF();

		this.offset.X = (this.canvas.width - width) / 2;
		this.offset.Y = (this.canvas.height - height) / 2;

		// correct negative coordinates...
		if (min.X < 0) this.offset.X -= min.X * this.getZF();
		if (min.Y < 0) this.offset.Y -= min.Y * this.getZF();

		this.redraw();
	}

	public Resize(width: number, height: number) {
		this.ctx.canvas.width = width;
		this.ctx.canvas.height = height;
		this.redraw();
	}

	zoom(e: WheelEvent) {
		var tmp = this.zoomFactor;

		if (e.deltaY < 0 && this.zoomFactor < this.zoomFactors.length - 1)
			this.zoomFactor++;
		else if (e.deltaY > 0 && this.zoomFactor > 0)
			this.zoomFactor--;

		if (this.zoomFactor !== tmp) {
			console.log(Math.round(100 * this.zoomFactors[this.zoomFactor]) + '%');
			this.redraw();
		}
	}

	getZF() : number {
		return this.zoomFactors[this.zoomFactor];
	}

	drawGrid() {
		// main horizontal line
		this.drawLine(
			new Point(0, this.offset.Y), 
			new Point(this.canvas.width, this.offset.Y), 
			'#ccc');

		// main vertical line
		this.drawLine(
			new Point(this.offset.X, 0), 
			new Point(this.offset.X, this.canvas.height), 
			'#ccc');
	}

	redraw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		var track = this.level.Track;

		var min = track[0].Y;
		var max = track[0].Y;

		for (var i = 1; i < track.length; i++) {
			if (track[i].Y < min) min = track[i].Y;
			if (track[i].Y > max) max = track[i].Y;
		}

		var rev = (max - min) / 2;

		var back = 20;
		var front = 10;

		if (!this.dim3)
			front = 0;
		
		this.drawGrid();

		// back line
		if (this.dim3) {
			for (var i = 0; i < track.length; i++) {
				var from = this.recalc(new Point(track[i].X, rev - track[i].Y - back));
				var to = this.recalc(new Point(track[i].X, rev - track[i].Y + front));
				
				this.drawLine(from, to, '#04aa04', this.getZF());
			}

			for (var i = 0; i < track.length - 1; i++) {
				var from = this.recalc(new Point(track[i].X, rev - track[i].Y - back));
				var to = this.recalc(new Point(track[i + 1].X, rev - track[i + 1].Y - back));
				
				this.drawLine(from, to, '#04aa04', this.getZF());
			}
		}

		// front line
		for (var i = 0; i < track.length - 1; i++) {
			var from = this.recalc(new Point(track[i].X, rev - track[i].Y + front));
			var to = this.recalc(new Point(track[i + 1].X, rev - track[i + 1].Y + front));
			
			this.drawLine(from, to, '#00ff00', this.getZF());
		}
	}

	recalc(point: Point) : Point {
		return new Point(
			this.offset.X + this.getZF() * point.X, 
			this.offset.Y + this.getZF() * point.Y);
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