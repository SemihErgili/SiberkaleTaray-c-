import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://siber-kale-hack-tarayicisi.vercel.app'; // Change to your production URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Example of disallowing a directory
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
