// Legacy URL redirects ported from vercel.json. Everything else falls through to static assets.
const RETIRED_LISTINGS = new Set([
  'river-cove-residences', 'raw-district-2', 'golf-fields', 'villa-sanctuary', 'hills-grove-townhouse',
  'islands-2', 'rise-by-athlon', 'arabian-ranches-courtyard-villa', 'marina-sky-penthouse',
  'creek-harbour-waterside-townhouse', 'business-bay-executive-tower', 'hills-estate-golf-mansion',
  'jvc-boulevard-residences', 'palm-garden-homes',
]);

const redirect = (url, path) => Response.redirect(new URL(path, url).toString(), 301);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const trimmed = pathname.replace(/\/$/, '');

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
