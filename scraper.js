const cloudscraper = require("cloudscraper");
const { parse } = require("node-html-parser");

async function search(query) {
	let results = [];
	let options = {
		uri: `https://animedao.to/search/?search=${query}`,
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

module.exports = {
	search,
};
