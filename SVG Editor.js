
var currentX = 0;
var currentY = 0;


var slider = document.getElementById("slider");
var output = document.getElementById("width");
output.innerHTML = slider.value;

slider.oninput = function () {
	output.innerHTML = this.value;
	if (elementSelectat) {
		elementSelectat.style.strokeWidth = this.value;
	}
}

function setareCoordonateDreptunghi(obiect, x1, y1, x2, y2) {
	obiect.setAttributeNS(null, 'x', Math.min(x1, x2));
	obiect.setAttributeNS(null, 'y', Math.min(y1, y2));
	obiect.setAttributeNS(null, 'width', Math.max(x1, x2) - Math.min(x1, x2));
	obiect.setAttributeNS(null, 'height', Math.max(y1, y2) - Math.min(y1, y2));
}
function setareCoordonateElipsa(obiect, x1, y1, x2, y2) {
	obiect.setAttributeNS(null, 'cx', (x1 + x2) / 2);
	obiect.setAttributeNS(null, 'cy', (y1 + y2) / 2);
	obiect.setAttributeNS(null, 'rx', (Math.max(x1, x2) - Math.min(x1, x2)) / 2);
	obiect.setAttributeNS(null, 'ry', (Math.max(y1, y2) - Math.min(y1, y2)) / 2);
}
function setareCoordonateLinie(obiect, x1, y1, x2, y2) {
	obiect.setAttributeNS(null, 'x1', x1);
	obiect.setAttributeNS(null, 'y1', y1);
	obiect.setAttributeNS(null, 'x2', x2);
	obiect.setAttributeNS(null, 'y2', y2);
}
var MOUSE_LEFT = 0, MOUSE_RIGHT = 2, KEY_DEL = 46;
var x1 = 0, y1 = 0;
var elementSelectat = null;
var offset;
var figura = "dreptunghi";

var editor = document.getElementById("editor");
var selectie = document.getElementById("selectie");
var selectieElipsa = document.getElementById("selectieElipsa");
var selectieLinie = document.getElementById("selectieLinie");
var elemente = document.getElementById("elemente");

var culoare = null;
var stroke = null;
var colorInput = document.getElementById("color");
colorInput.addEventListener('input', () => {
	if (elementSelectat) {
		var color = colorInput.value;
		elementSelectat.style.fill = color;
		culoare = "fill";
		restore_array.push(culoare);
		index++;
		console.log(restore_array);
	}
})

var colorInputStroke = document.getElementById("colorLine");
colorInputStroke.addEventListener('input', () => {
	if (elementSelectat) {
		var colorLine = colorInputStroke.value;
		elementSelectat.style.stroke = colorLine;
		elementSelectat.classList.add("editat");
		stroke = "stroke";

		restore_array.push(stroke);
		index++;
		console.log(restore_array);
	}
})



/////////////////////////// undo ///////////////////////////////////////////

let restore_array = [];
let index = -1;
function undo() {
	index -= 1;



	if (restore_array.includes(culoare, index + 1)) {
		restore_array[index].style.fill = "#1f56a6";
		restore_array[index].style.strokeWidth = "";
		restore_array.pop();
		console.log(restore_array);
		console.log("culoare");
	} if (restore_array.includes(stroke, index + 1) && restore_array.includes(elementnou, index)) {
		restore_array[index].style.stroke = "#1f56a6";
		restore_array[index].style.strokeWidth = "";
		restore_array.pop();
		console.log("stroke");
	} if (restore_array.includes(stroke, index + 1) && restore_array.includes(culoare, index)) {
		restore_array[index - 1].style.strokeWidth = "";
		restore_array[index - 1].style.stroke = "#1f56a6";
		restore_array.pop();
		console.log("caca");


	}
	restore_array[index + 1].remove();
	restore_array.pop();
	console.log(restore_array);



}


////////////////////////// export png //////////////////////////////////////////////


function downloadPNG() {

	var svgString = new XMLSerializer().serializeToString(editor);
	var blob = new Blob([svgString], { type: 'image/svg+xml' });
	console.log("new Blob", blob);
	var blobURL = URL.createObjectURL(blob);
	var image = new Image();
	image.onload = () => {

		var canvas = document.createElement('canvas');

		canvas.width = window.innerWidth;

		canvas.height = window.innerHeight;

		let context = canvas.getContext('2d');

		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		let png = canvas.toDataURL('image/png');
		var download = function (href, name) {
			var link = document.createElement('a');
			link.download = name;
			link.href = href;
			link.click();

			URL.revokeObjectURL(blobURL);
			link.remove();
		}
		download(png, "image.png");

	};
	image.src = blobURL;

}


function downloadSVG() {

	var svgString = new XMLSerializer().serializeToString(editor);
	let blob = new Blob([svgString], { type: 'image/svg+xml' });

	var svgURL = URL.createObjectURL(blob);

	var downloadLink = document.createElement("a");
	downloadLink.href = svgURL;
	downloadLink.download = "";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);


}


/////////////////////////////////////// drag & drop /////////////////////////////////////////

var mousepos = { x: 0, y: 0 };
var miscare = 1;

elemente.onmousedown = function (evt) {
	figura = null;


	elementSelectat = evt.target;

	var pozitie = editor.getBoundingClientRect();
	mousepos.x = evt.clientX - pozitie.x;
	mousepos.y = evt.clientY - pozitie.y;
	miscare = 1;


	if (elementSelectat.classList.contains("dreptunghi")) {
		mousepos.x -= parseFloat(elementSelectat.getAttribute("x"));
		mousepos.y -= parseFloat(elementSelectat.getAttribute("y"));
	}
	if (elementSelectat.classList.contains("elipsa")) {

		mousepos.x -= parseFloat(elementSelectat.getAttribute("cx"));
		mousepos.y -= parseFloat(elementSelectat.getAttribute("cy"));
	}
	if (elementSelectat.classList.contains("linie")) {

		mousepos.x -= parseFloat(elementSelectat.getAttribute("x1"));
		mousepos.y -= parseFloat(elementSelectat.getAttribute("y1"));
	}

}

elemente.onmousemove = function (evt) {
	if (miscare == 1) {
		if (elementSelectat) {

			evt.preventDefault();


			pozitie = editor.getBoundingClientRect();
			var coord = { x: 0, y: 0 };
			coord.x = evt.clientX - pozitie.x;
			coord.y = evt.clientY - pozitie.y;


			if (elementSelectat.classList.contains("dreptunghi")) {
				elementSelectat.setAttribute("x", coord.x - mousepos.x);
				elementSelectat.setAttribute("y", coord.y - mousepos.y);

			}

			if (elementSelectat.classList.contains("elipsa")) {
				elementSelectat.setAttribute("cx", coord.x - mousepos.x);
				elementSelectat.setAttribute("cy", coord.y - mousepos.y);

			}
			if (elementSelectat.classList.contains("linie")) {
				elementSelectat.setAttribute("x1", coord.x - mousepos.x);
				elementSelectat.setAttribute("y1", coord.y - mousepos.y);
			}


		}
	}
}
elemente.onmouseup = function (e) {
	if (miscare == 1) miscare = 0;
}



editor.onmousedown = function (e) {

	if (e.button == MOUSE_LEFT) {


		x1 = e.pageX - this.getBoundingClientRect().left;
		y1 = e.pageY - this.getBoundingClientRect().top;

		if (figura == "dreptunghi") {
			setareCoordonateDreptunghi(selectie, x1, y1, x1, y1);
			selectie.style.display = "block";
		}
		if (figura == "elipsa") {
			setareCoordonateElipsa(selectieElipsa, x1, y1, x1, y1);
			selectieElipsa.style.display = "block";
		}
		if (figura == "linie") {
			setareCoordonateLinie(selectieLinie, x1, y1, x1, y1);
			selectieLinie.style.display = "block";
		}

	}
}


editor.onmouseup = function (e) {
	if (e.button == MOUSE_LEFT) {
		x2 = e.pageX - this.getBoundingClientRect().left;
		y2 = e.pageY - this.getBoundingClientRect().top;

		selectie.style.display = "none";
		selectieElipsa.style.display = "none";
		selectieLinie.style.display = "none";

		if (figura == "dreptunghi") {
			elementnou = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			setareCoordonateDreptunghi(elementnou, x1, y1, x2, y2);

			elementnou.classList.add("dreptunghi");
			elementnou.style.fill = colorInput.value;
			elementnou.style.stroke = colorInputStroke.value;
			elementnou.style.strokeWidth = slider.value;

			restore_array.push(elementnou);
			index += 1;
			console.log(restore_array);


		}
		if (figura == "elipsa") {
			elementnou = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
			setareCoordonateElipsa(elementnou, x1, y1, x2, y2);
			elementnou.classList.add("elipsa");
			elementnou.style.fill = colorInput.value;
			elementnou.style.stroke = colorInputStroke.value;
			elementnou.style.strokeWidth = slider.value;
			if (elementnou) {
				restore_array.push(elementnou);
				index += 1;
				console.log(restore_array);
			}
		}
		if (figura == "linie") {
			elementnou = document.createElementNS("http://www.w3.org/2000/svg", "line");
			setareCoordonateLinie(elementnou, x1, y1, x2, y2);
			elementnou.classList.add("linie");
			elementnou.style.stroke = colorInputStroke.value;
			elementnou.style.strokeWidth = slider.value;
			if (elementnou) {
				restore_array.push(elementnou);
				index += 1;
				console.log(restore_array);
			}
		}




		elementnou.onmousedown = function (e) {

			if (e.button == MOUSE_LEFT) {
				var elemente = document.querySelectorAll("#elemente *");
				elemente.forEach(el => el.classList.remove("selectat"));
				e.target.classList.add("selectat");
				elementSelectat = e.target;

			}
		}

		elemente.appendChild(elementnou);
	}
}


editor.onmousemove = function (e) {
	x2 = e.pageX - this.getBoundingClientRect().left;
	y2 = e.pageY - this.getBoundingClientRect().top;
	if (figura == "dreptunghi") {
		setareCoordonateDreptunghi(selectie, x1, y1, x2, y2);
	}
	if (figura == "elipsa") {
		setareCoordonateElipsa(selectieElipsa, x1, y1, x2, y2);
	}
	if (figura == "linie") {
		setareCoordonateLinie(selectieLinie, x1, y1, x2, y2);
	}
}

editor.oncontextmenu = function (e) { return false; }

document.onkeydown = function (e) {
	if (elementSelectat && e.keyCode == KEY_DEL) elementSelectat.remove();
}

////////////////////////////////////// web storage /////////////////////////

window.addEventListener('beforeunload', function () {
	localStorage.setItem("save", editor.innerHTML);
});

window.addEventListener('load', () => {

	elemente.innerHTML = localStorage.getItem("save");

});
function deleteShape() {
	if (elementSelectat)
		elementSelectat.remove();

}

function dreptunghi() {
	figura = "dreptunghi";
	if (elementSelectat) {
		elementSelectat.classList.remove("selectat");
		elementSelectat = null;
	}
}

function elipsa() {
	figura = "elipsa";
	if (elementSelectat) {
		elementSelectat.classList.remove("selectat");
		elementSelectat = null;
	}


}
function linie() {
	figura = "linie";
	if (elementSelectat) {
		elementSelectat.classList.remove("selectat");
		elementSelectat = null;
	}
}
function Clear() {

	elemente.innerHTML = "";

}