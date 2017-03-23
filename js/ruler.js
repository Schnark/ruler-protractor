//based on https://github.com/radare/fxos-app-ruler by pancake
(function () {
"use strict";

var cache = {}, untilcm = 21, //keep in sync with style.css
	inchratio = 2.54, currentCmPos = 'right', marks, label;

function makeDiv (pos, dist, line, bold) {
	return '<div style="' +
			(bold ? 'font-weight: bold;' : '') +
			'position: absolute;' +
			pos + ': 0px;' +
			'top: ' + dist + 'mozmm' +
		'">' + line + '</div>';
}

function createCm (pos, end) {
	var html = [], cm, mm, dist, line;
	for (cm = 0; cm < end; cm++) {
		dist = 10 + cm * 10;
		line = pos === 'left' ? '_____ ' + cm :  cm + ' _____';
		html.push(makeDiv(pos, dist, line, true));
		if (cm + 1 < end) {
			for (mm = 1; mm < 10; mm++) {
				dist = 10 + cm * 10 + mm;
				line = mm === 5 ? '__' : '_';
				html.push(makeDiv(pos, dist, line));
			}
		}
	}
	return html.join('');
}

function createInch (pos, end) {
	var html = [], inch, mi, dist, line;
	for (inch = 0; inch < end; inch++) {
		dist = 10 + inch * 10 * inchratio;
		line = pos === 'left' ? '_____ ' + inch : inch + ' _____';
		html.push(makeDiv(pos, dist, line, true));
		if (inch + 1 < end) {
			for (mi = 1; mi < 16; mi++) {
				dist = 10 + inch * 10 * 2.54 + 1.6 * mi;
				line = mi === 8 ? '___' : mi % 2 ? '_' : '__';
				html.push(makeDiv(pos, dist, line));
			}
		}
	}
	return html.join('');
}

function createHtml (cmPos) {
	return createCm(cmPos, untilcm) +
		createInch(cmPos === 'left' ? 'right' : 'left', untilcm / inchratio) +
		makeDiv('left', 15 + untilcm * 10, '&nbsp;');
}

function getHtml (cmPos) {
	if (!cache[cmPos]) {
		cache[cmPos] = createHtml(cmPos);
	}
	return cache[cmPos];
}

function swap () {
	currentCmPos = currentCmPos === 'right' ? 'left' : 'right';
	update();
}

function update () {
	label.innerHTML = currentCmPos === 'right' ? 'inch / cm' : 'cm / inch';
	marks.innerHTML = getHtml(currentCmPos);
}

function init () {
	marks = document.getElementById('ruler-marks');
	label = document.getElementById('ruler-label');
	label.addEventListener('click', swap);
	update();
}

init();

})();