class Point {
	constructor(public X: number, public Y: number) {}
}

class Area {
	constructor(public TopLeft: Point, public Width: number, public Height: number) {
		if (Width <= 0 || Height <= 0)
			throw 'negative size';
	}

	public get TopRight(): Point {
		return new Point(this.TopLeft.X + this.Width, this.TopLeft.Y);
	}

	public get BottomLeft(): Point {
		return new Point(this.TopLeft.X, this.TopLeft.Y + this.Height);
	}

	public get BottomRight(): Point {
		return new Point(this.TopLeft.X + this.Width, this.TopLeft.Y + this.Height);
	}
}

class Tools {
	public static GetArea(track: Point[]) : Area {
		if (track.length < 2)
			throw 'few points';

		var min = new Point(track[0].X, track[0].Y);
		var max = new Point(track[0].X, track[0].Y);

		for (var i = 1; i < track.length; i++) {
			if (track[i].Y < min.Y) min.Y = track[i].Y;
			if (track[i].X < min.X) min.X = track[i].X;
			if (track[i].Y > max.Y) max.Y = track[i].Y;
			if (track[i].X > max.X) max.X = track[i].X;
		}

		return new Area(min, max.X - min.X, max.Y - min.Y);
	}
}

class Level {
	public Start: Point;
	public End: Point;
	public Track = new Array<Point>();

	constructor(public Name: string) {}

	public AddPoint(point: Point) {
		this.Track.push(point);
	}

	public static Decode(data: ArrayBuffer, offset: number): { level: Level, offset: number } {
		var dataOffset = new DataView(data).getInt32(offset, false);
		offset += 4;

		// get null terminated string
		var name = '';
		var cstr = new Uint8Array(data, offset);
		
		for (var i = 0; cstr[i] !== 0; i++, offset++)
			name += String.fromCharCode(cstr[i]);

		offset++;

		var level = new Level(name);
		Level.decodeCoordinates(data, dataOffset, level);
		return { level, offset };
	}

	private static decodeCoordinates(data: ArrayBuffer, offset: number, level: Level) : void {
		var view = new DataView(data, offset);
		level.Start = new Point((view.getInt32(1, false) >> 16) << 3, (view.getInt32(5, false) >> 16) << 3);
		level.End = new Point((view.getInt32(9, false) >> 16) << 3, (view.getInt32(13, false) >> 16) << 3);

		var special = true;
		var count = view.getInt16(17, false) - 1;
		offset = 19;
		
		var offsetX = 0;
		var offsetY = 0;

		for (var i = 0; i <= count; i++) {
			var point: Point;

			// reset offset with new value
			if (special) {
				point = new Point(view.getInt32(offset, false), view.getInt32(offset + 4, false));	
				offset += 8;

				offsetX = point.X;
				offsetY = point.Y;

				level.AddPoint(point);
				special = false;
				continue;
			}

			point = new Point(view.getInt8(offset), view.getInt8(offset + 1));
			offset += 2;

			// x is -1
			if (point.X === -1) {
				special = true;
				offset--;
				i--;
				continue;
			}

			point.X += offsetX;
			point.Y += offsetY;
			offsetX = point.X;
			offsetY = point.Y;
			level.AddPoint(point);
		}
	}
}

class Levels {
	public Easy = new Array<Level>();
	public Medium = new Array<Level>();
	public Hard = new Array<Level>();

	public static Decode(data: ArrayBuffer) {
		var result = new Levels();

		var tmp = Levels.decodeLevels(data, 0);
		result.Easy = tmp.levels;

		tmp = Levels.decodeLevels(data, tmp.offset);
		result.Medium = tmp.levels;

		tmp = Levels.decodeLevels(data, tmp.offset);
		result.Hard = tmp.levels;

		return result;
	}

	private static decodeLevels(data: ArrayBuffer, offset: number): { levels: Level[], offset: number } {
		var count = new DataView(data).getInt32(offset, false);
		var levels = new Array<Level>(count);

		offset += 4;

		for (var i = 0; i < count; i++) {
			var tmp = Level.Decode(data, offset);
			levels[i] = tmp.level;
			offset = tmp.offset;
		}

		return { levels, offset };
	}
}