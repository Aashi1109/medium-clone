import Head from "next/head";
import Image from "next/image";
// import { Inter } from "@next/font/google";
import Header from "../components/Header";

import { images } from "../constants";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
import Link from "next/link";

// const inter = Inter({ subsets: ["latin"] });

interface Props {
  posts: [Post];
}
export default function Home({ posts }: Props) {
  console.log(posts);
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Clone</title>
        <meta name="description" content="A simple clone of medium website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-4">
        <div className="px-10 space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="decoration-4 underline decoration-black">
              Medium
            </span>{" "}
            is place to read, write and connect to
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect to
            millions of readers.
          </h2>
        </div>
        <img
          src={images.medium_2.src}
          alt="medium m"
          className="hidden md:inline-flex h-40 lg:h-68 px-10"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group border rounded-lg cursor-pointer overflow-hidden">
              <img
                className="h-60 w-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
                src={urlFor(post.mainImage).url()!}
                alt={post.slug.current}
              />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()}
                  alt="post author"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const postQuery = `*[ _type == "post"]{
    _id,
    title,
    description,
    author -> {
      name,
      image
    },
    mainImage,
    slug
  }`;
  let posts = await sanityClient
    .fetch(postQuery)
    // .then((data) => JSON.stringify(data))
    .catch((err) => console.log(err));

  !posts && (posts = []);

  return {
    props: {
      posts,
    },
  };
};
