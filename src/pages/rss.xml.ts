import config from "@/config/config.json";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site?: URL }) {
  const now = new Date();
  const posts = await getCollection("blog", ({ data, id }) => {
    return (
      !id.startsWith("-") && !data.draft && (!data.date || data.date <= now)
    );
  });

  posts.sort(
    (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0),
  );

  return rss({
    title: config.site.title,
    description: config.metadata.meta_description,
    site: context.site ?? new URL(config.site.base_url),
    trailingSlash: false,
    customData: "<language>ko-KR</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
      categories: [...post.data.categories, ...post.data.tags],
    })),
  });
}
