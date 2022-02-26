var container = document.getElementById("ep-cont");
container.innerHTML = `<iframe src='${link}' scrolling='no' frameborder='0' width='750px;' height='422px;' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true'></iframe>`;
let controls = document.querySelector(".episode-controls");
if (episode.prev != null) {
	let a = document.getElementById("a");
	a.textContent = "Previous";
	a.href = "../../.." + episode.prev.url;
	controls.appendChild(a);
}
let b = document.createElement("a");
b.textContent = "All Episodes";
b.href = "..";
controls.appendChild(b);
if (episode.next != null) {
	let c = document.createElement("a");
	c.textContent = "Next";
	c.href = "../../.." + episode.next.url;
	controls.appendChild(c);
}
