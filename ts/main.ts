/// <reference path="levels.ts" />

document.body;
document.body.style.height = window.innerHeight + 'px';
document.body.style.width = window.innerWidth + 'px';

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
document.body.addEventListener('dragover', function(e) {
	e.stopPropagation();
	e.preventDefault();
	document.body.style.background = 'red';
	e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
document.body.addEventListener('drop', function(e) {
	e.stopPropagation();
	e.preventDefault();

	var files = e.dataTransfer.files; // Array of all files
	
	for (var i = 0; i < files.length; i++) {
		var reader = new FileReader();
	
		reader.addEventListener('load', (e2) => {
			var levels = Levels.Decode(reader.result);
			console.log(levels);
		});

		reader.readAsArrayBuffer(files[i]); // start reading the file data.
	}
});