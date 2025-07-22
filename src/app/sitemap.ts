import { MetadataRoute } from 'next';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://siber-kale-hack-tarayicisi.vercel.app'; // Change to your production URL

  // In the future, you could dynamically fetch popular topics
  // from a database to include them in the sitemap.
  // const popularTopics = ['sql-injection', 'xss', 'rat'];
  // const topicPages = popularTopics.map((topic) => ({
  //   url: `${baseUrl}/article/${topic}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly',
  //   priority: 0.8,
  // }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // ...topicPages,
  ];
}
