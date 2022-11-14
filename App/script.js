let bars = [];

const def = "#fd0081", chng = "#431f91", finished = "#8ef511", selected = "yellow";

window.onload = setup();

document.querySelector(".man").addEventListener("click", manualF);
function manualF() {
	document.querySelector(".inp").value = "";

	document.getElementById("cja").classList.toggle("open");
}

async function setup() {
	let b = document.getElementById("bars");
	let d = document.getElementById("delay");
	document.getElementById("b").innerText = b.value;
	document.getElementById("d").innerText = d.value + "ms";

	if(document.querySelector(".inp").value != "")
	{
		generateBarsManuals();
	}
	else if(bars.length != parseInt(b.value)) {
		generateBars(parseInt(b.value));
	}

	
}


function reset() {
	if(document.querySelector(".inp").value == "")
	{
		location.reload();
	}
	setup();
}


function Disable_The_Input() {
	let x = document.getElementsByTagName("input");
	for (let i = 0; i < x.length; i++)
		x[i].disabled = true;
	return parseInt(document.getElementById("delay").value);
}


function Finished_Sorting() {
	let x = document.getElementsByClassName("bar");
	for (let i = 0; i < x.length; i++)
		x[i].style.backgroundColor = finished;
	x = document.getElementsByTagName("input");
	for (let i = 0; i < x.length; i++)
		x[i].disabled = false;

}


function generateBars(n = -1) {
	bars = [];
	let container = document.getElementById("container");
	n = n < 0 ? Math.random() * 20 : n;

	for (let i = 0; i < n; i++) {
		bars.push('<div class="bar" id="' + i + '" style="height:' + Math.floor(2 + Math.random() * 98) + '%"></div>');
	}

	container.innerHTML = bars.join('');
}

function generateBarsManuals() {
	bars = [];
	let container = document.getElementById("container");

	let textArr = [];
	if (document.querySelector(".inp").value != "") {
		textArr = document.querySelector(".inp").value.trim().split(/\s+/);
	}

	let n = textArr.length;

	arr = [];
	for (let i = 0; i < n; i++) {
		arr[i] = parseInt(textArr[i]);
	}

	let max_ = Math.max(...arr);
	//console.log(max_);

	for (let i = 0; i < n; i++) {
		bars.push('<div class="bar" id="' + i + '" style="height:' + Math.floor(arr[i] / max_ * 98) + '%"></div>');
	}

	container.innerHTML = bars.join('');
}


function Sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function MapRange(value, in_min, in_max, out_min, out_max) {
	return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


// Partition(): Places the (r)th bar at the correct position 
async function Partition(l, r, d) {
	let i = l - 1;
	let j = l;
	let id = bars[r].split('id="')[1].split('"')[0];
	document.getElementById(id).style.backgroundColor = selected;
	for (j = l; j < r; j++) {
		let a = parseInt(bars[j].split(/[:%]/)[1]);
		let b = parseInt(bars[r].split(/[:%]/)[1]);
		if (a < b) {
			i++;
			let curr_id = bars[i].split('id="')[1].split('"')[0];
			let nxt_ele = bars[j].split('id="')[1].split('"')[0];
			document.getElementById(curr_id).style.backgroundColor = chng;
			document.getElementById(nxt_ele).style.backgroundColor = chng;

			let temp = bars[i];
			bars[i] = bars[j];
			bars[j] = temp;

			await Sleep(d / 3.0);
			container.innerHTML = bars.join('');
			document.getElementById(curr_id).style.backgroundColor = chng;
			document.getElementById(nxt_ele).style.backgroundColor = chng;
			document.getElementById(id).style.backgroundColor = selected;
			let sound = MapRange(document.getElementById(curr_id).style.height.split('%')[0], 2, 100, 500, 1000);
			beep(100, sound, d)
			await Sleep(d / 3.0)
			document.getElementById(curr_id).style.backgroundColor = def;
			document.getElementById(nxt_ele).style.backgroundColor = def;
		}
	}

	let temp = bars[i + 1];
	bars[i + 1] = bars[r];
	bars[r] = temp;

	container.innerHTML = bars.join(' ');
	document.getElementById(id).style.backgroundColor = selected;
	await Sleep(d / 3.0);
	document.getElementById(id).style.backgroundColor = def;
	return i + 1;
}


async function quickSort(l, r, d) {
	if (l < r) {
		let p = await Partition(l, r, d);
		await quickSort(l, p - 1, d);
		await quickSort(p + 1, r, d);
	}
}


async function QuickSort() {
	let delay = Disable_The_Input();
	await quickSort(0, bars.length - 1, delay);
	Finished_Sorting();
}
