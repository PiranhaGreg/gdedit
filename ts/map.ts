/// <reference path="levels.ts" />



class MapRenderer {
	private zoomFactors = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 3, 4, 5];
	private zoomFactor = 6;

	private ctx: CanvasRenderingContext2D;

	private lastPoint = new Point(0, 0);
	private offset = new Point(0, 0);

	constructor(private canvas: HTMLCanvasElement, private level: Level, private perspective = true) {
		this.ctx = canvas.getContext('2d');
		
		this.resize();
		this.BestFit();

		window.addEventListener('resize', (e: UIEvent) => this.resize(e));
		canvas.addEventListener('wheel', (e: WheelEvent) => this.zoom(e));
		canvas.addEventListener('mousedown', (e) => this.dragStart(e));
		canvas.addEventListener('mousemove', (e) => this.dragging(e));
	}

	private dragStart(e: MouseEvent) {
		this.lastPoint.X = e.x;
		this.lastPoint.Y = e.y;
	}

	private dragging(e: MouseEvent) {
		if (e.buttons !== 1) return;

		this.offset.X += e.x - this.lastPoint.X;
		this.offset.Y += e.y - this.lastPoint.Y;

		this.lastPoint.X = e.x;
		this.lastPoint.Y = e.y;

		this.redraw();
	}

	public BestFit() {
		var area = Tools.GetArea(this.level.Track);

		this.zoomFactor = this.zoomFactors.length - 1;

		while (this.zoomFactor > 0 && (
			this.ZoomFactor * area.Height > this.canvas.height ||
			this.ZoomFactor * area.Width > this.canvas.width))
			this.zoomFactor--;

		area.Height *= this.ZoomFactor;
		area.Width *= this.ZoomFactor;

		this.offset.X = (this.canvas.width - area.Width) / 2;
		this.offset.Y = (this.canvas.height - area.Height) / 2;

		// correct negative coordinates...
		if (area.TopLeft.X < 0) this.offset.X -= area.TopLeft.X * this.ZoomFactor;
		if (area.TopLeft.Y < 0) this.offset.Y -= area.TopLeft.Y * this.ZoomFactor;

		this.redraw();
	}

	private resize(e?: UIEvent) {
		this.ctx.canvas.width = this.canvas.clientWidth;
		this.ctx.canvas.height = this.canvas.clientHeight;
		this.redraw();
	}

	private zoom(e: WheelEvent) {
		var old = this.zoomFactor;

		if (e.deltaY < 0 && this.zoomFactor < this.zoomFactors.length - 1)
			this.zoomFactor++;
		else if (e.deltaY > 0 && this.zoomFactor > 0)
			this.zoomFactor--;

		if (this.zoomFactor !== old) {
			console.log(Math.round(100 * this.ZoomFactor) + '%');
			this.redraw();
		}
	}

	public get ZoomFactor(): number {
		return this.zoomFactors[this.zoomFactor];
	}

	public get Perspective() : boolean {
		return this.perspective;
	}

	public set Perspective(value: boolean) {
		var redraw = this.perspective !== value;
		this.perspective = value;
		if (redraw) this.redraw();
	}

	private drawGrid() {
		// main horizontal line
		this.drawLine(new Point(0, this.offset.Y), new Point(this.canvas.width, this.offset.Y), '#ccc');

		// main vertical line
		this.drawLine(new Point(this.offset.X, 0), new Point(this.offset.X, this.canvas.height), '#ccc');
	}

	private redraw() {
		var track = this.level.Track;
		var area = Tools.GetArea(track);
		var rev = (area.BottomRight.Y - area.TopLeft.Y) / 2;
		var back = 20;
		var front = this.Perspective ? 10 : 0;
		
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawGrid();

		// back line
		if (this.Perspective) {
			for (var i = 0; i < track.length; i++)
				this.drawMapLine(track[i].X, rev - track[i].Y - back, track[i].X, rev - track[i].Y + front, '#04aa04');

			for (var i = 0; i < track.length - 1; i++)
				this.drawMapLine(track[i].X, rev - track[i].Y - back, track[i + 1].X, rev - track[i + 1].Y - back, '#04aa04');
		}

		// front line
		for (var i = 0; i < track.length - 1; i++)
			this.drawMapLine(track[i].X, rev - track[i].Y + front, track[i + 1].X, rev - track[i + 1].Y + front, '#00ff00');
	}

	// just a shorthand
	private drawMapLine(fromX: number, fromY: number, toX: number, toY: number, color: string) {
		this.drawLine(this.recalc(new Point(fromX, fromY)), this.recalc(new Point(toX, toY)), color, this.ZoomFactor);
	}

	private recalc(point: Point): Point {
		return new Point(
			this.offset.X + this.ZoomFactor * point.X, 
			this.offset.Y + this.ZoomFactor * point.Y);
	}

	private drawLine(from: Point, to: Point, color: string, lineWidth = 1) {
		this.ctx.beginPath();
		
		this.ctx.lineWidth = lineWidth;
		this.ctx.lineCap = 'round';
		this.ctx.strokeStyle = color;

		this.ctx.moveTo(from.X + 0.5, from.Y + 0.5);
		this.ctx.lineTo(to.X + 0.5, to.Y + 0.5);
	
		this.ctx.stroke();
	} 
}