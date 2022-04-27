const cloudscraper = require("cloudscraper");
const { parse } = require("node-html-parser");

async function search(query) {
	let results = [];
	let options = {
		uri: `https://animedao.to/search/?search=${query}`,
		  headers: {
    		// User agent, Cache Control and Accept headers are required
    		// User agent is populated by a random UA.
    		'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
    		'Cache-Control': 'private',
    		'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
  		},
	};
	let raw = await cloudscraper.get(options);
	let rawdata = await parse(raw);
	let divs = rawdata.getElementsByTagName("div");
	let res = divs.filter((item) => item.rawAttrs.includes("row") == true);
	let data = res[1];

	await data.childNodes.forEach((item) => {
		if (!item.rawAttrs.includes("col-sm-6")) return;
		let url = item.childNodes[0].rawAttrs
			.replace("href=", "")
			.replace(/"/g, "");
		let title = url.replace("/anime/", "").replace("/", "");
		let imageraw = url.replace("anime", "images");
		let image =
			"https://animedao.to" +
			imageraw.replace(title, title + ".jpg").replace(/\/$/, "");
		if (image.includes("-dubbed")) {
			image = image.replace("-dubbed", "");
		}

		let obj = {
			rawTitle: title,
			title: title.replace(/-/g, " "),
			image,
			url,
		};
		results.push(obj);
	});
	return results;
}

async function getImage(title) {
	let options = {
		uri: `https://animedao.to/anime/${title}`,
		headers: {
    		// User agent, Cache Control and Accept headers are required
    		// User agent is populated by a random UA.
    		'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
    		'Cache-Control': 'private',
    		'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
  		},
	};
	let raw = await cloudscraper.get(options);
	let rawdata = await parse(raw);
	let divs = rawdata.getElementsByTagName("div");
	let res = divs.filter((item) => item.rawAttrs.includes("row") == true);
	let imgdiv = divs.filter(
		(item) => item.rawAttributes.class == "col-lg-4 animeinfo-poster"
	);
	let img = imgdiv[0].childNodes[0].childNodes[0].rawAttributes.src;
	return img;
}

async function newEpisodes() {
	let results = [];
	let options = {
		uri: `https://animedao.to/`,
		headers: {
    		// User agent, Cache Control and Accept headers are required
    		// User agent is populated by a random UA.
    		'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
    		'Cache-Control': 'private',
    		'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
  		},
	};
	let raw = await cloudscraper.get(options);
	let rawdata = await parse(raw);
	let divs = rawdata.getElementsByTagName("div");
	let res = divs.filter((item) => item.rawAttrs.includes("row") == true);
	let data = res[0].childNodes[2].childNodes[0];

	await data.childNodes.forEach((item) => {
		if (!item.rawAttrs.includes("col-sm-6")) return;
		let n = item.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		let url =
			item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].rawAttrs
				.replace("href=", "")
				.replace(/"/g, "")
				.split("title=")[1]
				.split("Episode")[0]
				.replace(/[^A-Za-z]/, "");
		let title =
			item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].rawAttrs
				.split("title=")[1]
				.split('"')[1];
		let imageraw = url.replace("anime", "images");
		let image =
			"https://animedao.to" +
			imageraw.replace(title, title + ".jpg").replace(/\/$/, "");
		if (image.includes("-dubbed")) {
			image = image.replace("-dubbed", "");
		}
		let newurl = url.replace(/ /g, "-").replace(/-$/, "");
		let obj = {
			rawTitle: title,
			title: title.replace(/-/g, " "),
			image,
			url: newurl.toLowerCase(),
		};
		results.push(obj);
	});
	return results;
}

async function get(rawtitle) {
	let options = {
		uri: `https://animedao.to/anime/${rawtitle}`,
		headers: {
    		// User agent, Cache Control and Accept headers are required
    		// User agent is populated by a random UA.
    		'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
    		'Cache-Control': 'private',
    		'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
  		},
	};
	let raw = await cloudscraper.get(options);
	let rawdata = await parse(raw);
	let divs = rawdata.getElementsByTagName("div");
	let res = divs.filter((item) => item.rawAttrs.includes("row") == true);
	let info = res[0].childNodes[1].childNodes[0].childNodes[1];
	let episodes = divs.filter((item) => item.rawAttrs.includes("eps") == true);

	let synopsis = divs
		.filter(
			(item) => (item.rawAttributes.class == "visible-md visible-lg") == true
		)[0]
		.rawText.split("Description")[1];
	let eps = episodes[0].childNodes[0].childNodes.filter(
		(item) => item.rawTagName == "a"
	);
	let specials = episodes[0].childNodes[1].childNodes.filter(
		(item) => item.rawTagName == "a"
	);
	let epsArray = [];
	let specialsArray = [];
	await eps.forEach((item) => {
		let oldurl = item.rawAttrs.replace("href=", "").replace(/"/g, "");
		let subtitle =
			item.childNodes[0].childNodes[0].childNodes[0].childNodes[3].rawText;
		let title =
			item.childNodes[0].childNodes[0].childNodes[0].childNodes[2].rawText;
		let url = oldurl
			.split("title=")[0]
			.replace("/view/", "/view/" + rawtitle + "/");
		let obj = {
			title,
			subtitle,
			url,
			id: url.replace("/view/" + rawtitle + "/", "").replace("/", ""),
		};
		epsArray.push(obj);
	});
	await specials.forEach((item) => {
		let oldurl = item.rawAttrs.replace("href=", "").replace(/"/g, "");
		let subtitle =
			item.childNodes[0].childNodes[0].childNodes[1].childNodes[3].rawText;
		let title =
			item.childNodes[0].childNodes[0].childNodes[1].childNodes[4].rawText;
		let url = oldurl
			.split("title=")[0]
			.replace("/view/", "/view/" + rawtitle + "/");
		let obj = {
			title,
			subtitle,
			url,
			id: url.replace("/view/" + rawtitle + "/", "").replace("/", ""),
		};
		specialsArray.push(obj);
	});
	let obj = {
		title: rawtitle.replace(/-/g, " "),
		synopsis,
		episodes: epsArray,
		specials: specialsArray,
	};
	return obj;
}

async function getVideo(videoid) {
	let options = {
		uri: `https://animedao.to/view/${videoid}`,
		headers: {
    		// User agent, Cache Control and Accept headers are required
    		// User agent is populated by a random UA.
    		'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
    		'Cache-Control': 'private',
    		'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
  		},
	};
	let raw = await cloudscraper.get(options);
	let rawdata = await parse(raw);
	let scripts = rawdata.getElementsByTagName("script");
	let res = scripts.filter(
		(item) =>
			item.rawText.includes("redirect/") == true && item.rawTagName == "script"
	);
	let ogvideo = res[0];
	let source =
		"https://animedao.to/redirect/" +
		ogvideo.rawText.split("redirect/")[1].split('"')[0];
	let returnn = {
		source,
		id: videoid,
	};
	return returnn;
}
// async function test() {
// 	let t = await getVideos("721024039");
// 	console.log(t);
// }
// test();
module.exports = {
	search,
	newEpisodes,
	get,
	getImage,
	getVideo,
};

//iframe information
// scrolling="no" frameborder="0" width="700" height="430" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"
