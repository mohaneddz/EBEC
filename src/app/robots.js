export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/', '/user', '/auth', '/login'],
    },
    sitemap: 'https://ebec.ensia.dz/sitemap.xml',
  };
} 