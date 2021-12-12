const fs = require('fs');

const BASE_URL = "https://theme.bencohen.dev";
const pages = ["about"];



export async function get() {
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	};
	return {
		headers,
		body: `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url><loc>${BASE_URL}</loc><priority>0.85</priority></url>
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
