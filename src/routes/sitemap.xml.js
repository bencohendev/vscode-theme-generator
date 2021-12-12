export async function get() {
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	};
	return {
		headers,
		body: `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
    <loc>https://theme.bencohen.dev/</loc>
    <lastmod>2021-12-12T01:46:41+00:00</lastmod>
    <priority>1.00</priority>
    </url>
    <url>
    <loc>https://theme.bencohen.dev/about</loc>
    <lastmod>2021-12-12T01:46:41+00:00</lastmod>
    <priority>0.80</priority>
    </url>
    </urlset>`
	};
}
