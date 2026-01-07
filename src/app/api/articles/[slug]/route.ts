import { sanityClient } from "@/lib/sanityClient";
import { NextResponse } from "next/server";

interface Context{
  params: {
    slug: string;
  }
}

type Article = {
  _id: string;
  title: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  excerpt?: string;
  slug?: string;
  authorDetails?: {
    name?: string;
    role?: string;
    bio?: string;
    imageUrl?: string;
  };
  content?: {
    _key: string;
    _type: string;
    children?: { _key: string; text?: string }[];
    style?: string;
  }[];
};

const articleQuery = `*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  author,
  date,
  "imageUrl": image.asset->url,
  tags,
  excerpt,

  authors[]{
    name,
    role,
    bio,
    "imageUrl": image.asset->url
  },

  content
}`;

const relatedQuery = `*[_type == "article" && slug.current != $slug] | order(date desc)[0...3]{
  _id,
  title,
  author,
  date,
  "imageUrl": image.asset->url,
  tags,
  excerpt,
  "slug": slug.current
}`;

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
 try {
    const {slug} = await params;
    const article = (await sanityClient.fetch(articleQuery, { slug })) as Article | null;
    const related = (await sanityClient.fetch(relatedQuery, { slug })) as any[];
    
        return NextResponse.json({article, related});
 } catch (err) {
    console.error("Error fetching featured podcasts from Sanity", err);
        return NextResponse.json({ message: `Failed to load podcasts` });
 }
}