const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const scraper = require("./scraper");
app.use(express.static("public"));

const api = require("anime-vostfr");
const cloudscraper = require("cloudscraper");

app.get("/api/search", async (req, res) => {
	const query = req.query.q;
	let raw = await scraper.search(query);
	res.json(raw);
});

app.get("/api/popular", async (req, res) => {
	let data = await api.loadAnime();
	let popular = api.popularAnime(data);
	res.json(popular);
});

app.get("/anime", (req, res) => {
	res.redirect("/");
});

app.get("/anime/:title", async (req, res) => {
	const title = req.params.title;
	let data = await scraper.get(title);
	// synopsis = information.synop
	res.send(`
    <html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
		/>
		<link rel="stylesheet" href="../../css/global.css" />
		<link rel="stylesheet" href="../../css/header.css" />
		<link
			rel="shortcut icon"
			href="https://hub.koneko.link/cdn/icons/blue.png"
			type="image/x-icon"
		/>
		<title>neko watch | ${anime.title}</title>
	</head>
    <body>
    <div class="header">
    <a href="../../" class="logo"
        >NekoWatch<span style="color: dodgerblue">;</span></a
    >
    <div class="header-right">
        <a href="../../" class="track">
            Home
        </a>
        <a href="http://track.koneko.link" class="track">Tracker</a>
    </div>
    </div>
    <div class="content">
    <div class="anime-info">
        <div class="anime-info-left">
            <img src="${anime.url_image}" alt="${anime.title}" />
        </div>
        <div class="anime-info-right">
            <h1>${anime.title}</h1>
            <h2>Type: ${anime.type}</h2>
            <h2>Episodes: ${anime.nb_eps}</h2>
            <h3>Score: ${anime.score}</h3>
            <h3>Genres: ${anime.genres}</h3>
        </div>
    </div>
    <br>
    <div class="anime-episodes">
    </div>
    </div>
    </body>
    <script>
    var episodes = ${JSON.stringify(information.eps)};
    var anime = ${JSON.stringify(anime)};
    var information = ${JSON.stringify(information)};
    </script>
    <script src="../../js/episodeManager.js">
    </script>
    </html>
    `);
});

app.get("/watch", async (req, res) => {
	const id = req.query.id;
	const index = req.query.index;
	const data = await api.loadAnimeVF();
	let animeraw = data.filter((item) => item.id == id);
	let anime = animeraw[0];
	let information = await api.getMoreInformation(anime.url);
	let embed = await api.getEmbed(information.eps[index].url);
	res.send(`
    <html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
		/>
		<link rel="stylesheet" href="../../css/global.css" />
		<link rel="stylesheet" href="../../css/header.css" />
		<link
			rel="shortcut icon"
			href="https://hub.koneko.link/cdn/icons/blue.png"
			type="image/x-icon"
		/>
		<title>${anime.title} | Episode : ${+index + 1} | neko watch ^-^</title>
	</head>
    <body>
    <div class="header">
    <a href="../../" class="logo"
        >NekoWatch<span style="color: dodgerblue">;</span></a
    >
    <div class="header-right">
        <a href="../../" class="track">
            Home
        </a>
        <a href="http://track.koneko.link" class="track">Tracker</a>
    </div>
    </div>
    <div class="content">
    <div class="anime-info">
        <div class="anime-info-left">
            <img src="${anime.url_image}" alt="${anime.title}" />
        </div>
        <div class="anime-info-right">
            <h1>${anime.title}</h1>
            <h2>Currently watching episode: ${+index + 1}</h2>
        </div>
    </div>
    <div class="episode-container" id="ep-cont">
    </div>
    </div>
    </body>
    <script>
    var embed = ${JSON.stringify(embed)}
    var container = document.getElementById("ep-cont")
    var iframe = document.createElement("iframe")
    iframe.src = embed[0]
    iframe.style = "width: 900px;height:500px;"
    container.appendChild(iframe)
    </script>
    </html>
    `);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
