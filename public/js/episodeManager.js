episodes.forEach((episode) => {
	let div = document.createElement("div");
	let indexinarray = episode.episode.replace("Ep. ", "");
	let index = indexinarray - 1;
	let obj = {
		id: anime.id,
		index: index,
	};
	div.setAttribute("onclick", "openEpisode(" + JSON.stringify(obj) + ")");
	let title = episode.title.replace("VOSTFR", "");
	div.innerHTML = `<a href="../watch?id=${anime.id}&index=${index}">${title} - ${episode.episode}</a>`;
	document.querySelector(".anime-episodes").appendChild(div);
});

function openEpisode(obj) {
	let { id, index } = obj;
	let url = `../watch?id=${id}&index=${index}`;
	location = url;
}
