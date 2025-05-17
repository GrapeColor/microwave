if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
	document.body.setAttribute('data-bs-theme', 'dark');
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

const sourceWottage = document.getElementById('source-wottage');
const targetWottage = document.getElementById('target-wottage');
const sourceTime = document.getElementById('source-time');
const targetTimeText = document.getElementById('target-time');

sourceWottage.value = localStorage.getItem('sourceWottage') ?? '500';
targetWottage.value = localStorage.getItem('targetWottage') ?? '600';
sourceTime.value = localStorage.getItem('sourceTime') ?? '00:00';

const saveStorage = () => {
	localStorage.setItem('sourceWottage', sourceWottage.value);
	localStorage.setItem('targetWottage', targetWottage.value);
	localStorage.setItem('sourceTime', sourceTime.value);
}

const drawTargetTime = () => {
	if (sourceTime.value === '') {
		sourceTime.value = '00:00';
	}

	saveStorage();

	const sourceTimeUnits = sourceTime.value.split(':');
	const sourceTimestamp = new Date(0).setUTCHours(sourceTimeUnits[0], sourceTimeUnits[1]).valueOf() / 60000;
	const weight = parseInt(sourceWottage.value) / parseInt(targetWottage.value);

	const targetTime = Math.round(sourceTimestamp * weight);
	const targetTimeMinute = (Math.trunc(targetTime / 60)).toString();
	const targetTimeSecond = (targetTime % 60).toString();

	targetTimeText.textContent = targetTime < 0 || isNaN(targetTimeMinute) || isNaN(targetTimeSecond)
		? '--:--'
		: `${targetTimeMinute.padStart(2, '0')}:${targetTimeSecond.padStart(2, '0')}`;
}

const sourceWottageClearButton = document.getElementById('source-wottage-clear-button');
const targerWottageClearButton = document.getElementById('target-wottage-clear-button');
const sourceWottageClearButtonTooltip = bootstrap.Tooltip.getOrCreateInstance(sourceWottageClearButton);
const targetWottageClearButtonTooltip = bootstrap.Tooltip.getOrCreateInstance(targerWottageClearButton);

const clearWottage = (element) => {
	element.value = '';
	element.focus({ focusVisible: true });
	drawTargetTime();
}

/////<<<<< ServiceWorker >>>>>/////
const registerServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/js/sw.js', { scope: '/' });
	}
}

/////<<<<< Events >>>>>/////
window.addEventListener('load', () => registerServiceWorker());
window.addEventListener('beforeunload', () => saveStorage());

sourceWottageClearButton.addEventListener('click', () => clearWottage(sourceWottage));
targerWottageClearButton.addEventListener('click', () => clearWottage(targetWottage));

sourceWottage.addEventListener('input', () => drawTargetTime());
targetWottage.addEventListener('input', () => drawTargetTime());
sourceTime.addEventListener('input', () => drawTargetTime());

sourceWottage.addEventListener('focus', () => sourceWottageClearButtonTooltip.show());
targetWottage.addEventListener('focus', () => targetWottageClearButtonTooltip.show());
sourceWottage.addEventListener('blur', () => sourceWottageClearButtonTooltip.hide());
targetWottage.addEventListener('blur', () => targetWottageClearButtonTooltip.hide());

drawTargetTime();
