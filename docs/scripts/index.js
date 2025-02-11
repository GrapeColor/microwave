if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
	document.body.setAttribute('data-bs-theme', 'dark');
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

const cookie = document.cookie || null;
const cookieMap = new Map(cookie?.split('; ').map((pair) => pair.split('=')));

const sourceWottage = document.getElementById('source-wottage');
const targetWottage = document.getElementById('target-wottage');
const sourceTime = document.getElementById('source-time');
const targetTimeText = document.getElementById('target-time');

sourceWottage.value = cookieMap.get('sourceWottage') ?? '500';
targetWottage.value = cookieMap.get('targetWottage') ?? '600';
sourceTime.value = cookieMap.get('sourceTime') ?? '00:00';

const drawTargetTime = () => {
	if (sourceTime.value === '') {
		sourceTime.value = '00:00';
	}

	const sourceTimeUnits = sourceTime.value.split(':');
	const sourceTimestamp = new Date(0).setUTCHours(sourceTimeUnits[0], sourceTimeUnits[1]).valueOf() / 60000;
	const weight = parseInt(sourceWottage.value) / parseInt(targetWottage.value);

	const targetTime = Math.round(sourceTimestamp * weight);
	const targetTimeMinute = (Math.trunc(targetTime / 60)).toString();
	const targetTimeSecond = (targetTime % 60).toString();

	targetTimeText.textContent = targetTime < 0 || isNaN(targetTimeMinute) || isNaN(targetTimeSecond)
		? '--:--'
		: `${targetTimeMinute.padStart(2, '0')}:${targetTimeSecond.padStart(2, '0')}`;

	cookieMap.set('sourceWottage', sourceWottage.value);
	cookieMap.set('targetWottage', targetWottage.value);
	cookieMap.set('sourceTime', sourceTime.value);
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

/////<<<<< Events >>>>>/////
window.addEventListener('beforeunload', () => {
	for (const [k, v] of cookieMap.entries()) {
		document.cookie = `${k}=${v}; max-age=31536000`
	}
});

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
