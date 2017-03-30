(function () {
"use strict";

var storedDir, currentDir, storedOrientation, currentOrientation;

function storeDirOrientation () {
	storedDir = currentDir;
	storedOrientation = currentOrientation;
}

function calcDir (data) {
	var a = data.alpha / 180 * Math.PI,
		b = data.beta / 180 * Math.PI,
		sa = Math.sin(a),
		ca = Math.cos(a),
		sb = Math.sin(b),
		cb = Math.cos(b);
	return [cb * ca, cb * sa, sb];
}

function calcAngle () {
	var s = storedDir[0] * currentDir[0] +
		storedDir[1] * currentDir[1] +
		storedDir[2] * currentDir[2];
	//fix rounding errors
	if (s < -1) {
		s = -1;
	} else if (s > 1) {
		s = 1;
	}
	return Math.acos(s) * 180 / Math.PI;
}

function getOrientation (data) {
	return [
		data.alpha % 360,
		data.beta,
		data.gamma
	];
}

function getRelOrientation () {
	return [
		(currentOrientation[0] - storedOrientation[0] + 360) % 360,
		currentOrientation[1] - storedOrientation[1],
		currentOrientation[2] - storedOrientation[2]
	];
}

function formatAngle (a) {
	return Math.round(a) + '°';
}

function formatOrientation (orientation) {
	return orientation.map(formatAngle).join('/');
}

function getTranslation (translations) {
	var lang = navigator.language;
	if (!translations[lang]) {
		lang = 'en';
	}
	return translations[lang];
}

function getStoreLabel () {
	return getTranslation({
		en: 'Reset protractor',
		de: 'Winkelmesser zurücksetzen'
	});
}

function getOrientationLabel () {
	return getTranslation({
		en: 'Orientation:',
		de: 'Lage:'
	});
}

function getRelativeLabel () {
	return getTranslation({
		en: 'relative',
		de: 'relativ'
	});
}

function init () {
	var display, store, orientation, orientationRel;

	display = document.getElementById('protractor-display');
	store = document.getElementById('protractor-store');
	orientation = document.getElementById('protractor-orientation');
	orientationRel = document.getElementById('protractor-orientation-relative');

	currentDir = [1, 0, 0];
	currentOrientation = [0, 0, 0];
	storeDirOrientation();

	store.textContent = getStoreLabel();
	store.addEventListener('click', storeDirOrientation);

	document.getElementById('protractor-orientation-label').textContent = getOrientationLabel();
	document.getElementById('protractor-orientation-relative-label').textContent = getRelativeLabel();

	window.addEventListener('deviceorientation', function (e) {
		currentDir = calcDir(e);
		currentOrientation = getOrientation(e);
		display.textContent = formatAngle(calcAngle());
		orientation.textContent = formatOrientation(currentOrientation);
		orientationRel.textContent = formatOrientation(getRelOrientation());
	});
}

init();
})();