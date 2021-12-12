const fs = require('fs');

const BASE_URL = "https://theme.bencohen.dev";
const pages = [""];

fs.readdirSync("./").forEach(file => {
  file = file.split('.')[0];
  if (file.charAt(0) !== '_' && file !== "sitemap" && file !== "index") {
    pages.push(file);
  }
});

export async function get() {
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	};
	return {
		headers,
		body: `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${pages
      .map(
        page => `
      <url><loc>${BASE_URL}/${page}</loc><priority>0.85</priority></url>
    `
      )
      .join("\n")}
    </urlset>`
	};
}
