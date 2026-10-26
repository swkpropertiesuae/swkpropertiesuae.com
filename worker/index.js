// Legacy URL redirects ported from vercel.json. Everything else falls through to static assets.
const RETIRED_LISTINGS = new Set([
  'river-cove-residences', 'raw-district-2', 'golf-fields', 'villa-sanctuary', 'hills-grove-townhouse',
  'islands-2', 'rise-by-athlon', 'arabian-ranches-courtyard-villa', 'marina-sky-penthouse',
  'creek-harbour-waterside-townhouse', 'business-bay-executive-tower', 'hills-estate-golf-mansion',
  'jvc-boulevard-residences', 'palm-garden-homes',
]);

// The two large hero films exceed the 25 MiB static-asset limit, so they live in R2 (binding MEDIA) and are
// served here with byte-range support (required for scroll-scrubbed video seeking).
const MEDIA_PATH = /^\/assets\/video\/(hero-swk-[a-z0-9-]+\.mp4)$/;

async function serveMedia(request, env, key) {
  const head = request.method === 'HEAD';
  const object = await (head ? env.MEDIA.head(key) : env.MEDIA.get(key, { range: request.headers }));
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers({
    'content-type': 'video/mp4',
    'accept-ranges': 'bytes',
    'cache-control': 'public, max-age=604800',
    etag: object.httpEtag,
  });
  let status = 200;
  let length = object.size;
  if (object.range && request.headers.has('range')) {
    const { offset = 0, length: len = object.size - offset } = object.range;
    headers.set('content-range', `bytes ${offset}-${offset + len - 1}/${object.size}`);
    length = len;
    status = 206;
  }
  headers.set('content-length', String(length));
  return new Response(head ? null : object.body, { status, headers });
}

const redirect = (url, path) => Response.redirect(new URL(path, url).toString(), 301);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const trimmed = pathname.replace(/\/$/, '');

    const media = pathname.match(MEDIA_PATH);
    if (media && env.MEDIA && (request.method === 'GET' || request.method === 'HEAD')) return serveMedia(request, env, media[1]);

    if (pathname === '/property-details.html') return redirect(url, '/properties/');
    if (pathname === '/index.html') return redirect(url, '/');

    const page = pathname.match(/^\/(properties|about|services|mortgage|blog|contact)\.html$/);
    if (page) return redirect(url, `/${page[1]}/`);

    if (pathname === '/blog-post.html') {
      const slug = url.searchParams.get('slug');
      if (slug !== null) return redirect(url, `/blog/${slug}/`);
    }

    const listing = trimmed.match(/^\/properties\/([^/]+)$/);
    if (listing && RETIRED_LISTINGS.has(listing[1])) return redirect(url, '/properties/');

    if (/^\/blog\/research(\/|$)/.test(pathname)) return redirect(url, '/blog/');
    if (/^\/blog\/[^/]+-residential-sales$/.test(trimmed)) return redirect(url, '/blog/');

    return env.ASSETS.fetch(request);
  },
};
