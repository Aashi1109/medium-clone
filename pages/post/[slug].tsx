import React, { useState } from "react";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import Header from "../../components/Header";
import PortableText from "react-portable-text";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  post: Post;
}

interface IFormText {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

const SlugPost = ({ post }: Props) => {
  const [commentIsSubmitted, setCommentIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormText>();

  const commentSubmitHandler: SubmitHandler<IFormText> = async (data) => {
    console.log(data);

    await fetch("/api/createComment/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        console.log(resp);
        setCommentIsSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setCommentIsSubmitted(false);
      });
  };

  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="post"
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt="author"
          />
          <p className="font-extralight text-sm">
            Blog Post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=""
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="mx-w-lg my-5 mx-auto border border-yellow-500" />
      {commentIsSubmitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold ">
            Thankyou for submitting the comment.
          </h3>
          <p>After approval it will show below</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(commentSubmitHandler)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article</h3>
          <h4 className="text-3xl font-bold">Leave a comment below</h4>
          <hr className="py-3 mt-5" />

          <input
            type="hidden"
            {...register("_id")}
            name="_id"
            value={post._id}
          />
          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              type="text"
              placeholder="John Appleseed"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              type="email"
              placeholder="your@email.com"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              rows={8}
              name="comment"
              placeholder="Enter your text"
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">Name field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">Email field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">Comment field is required</span>
            )}
          </div>

          <input
            type="submit"
            className="shadow rounded bg-yellow-500 hover:bg-yellow-400 focus:outline-none text-white font-bold py-2 px-4 cursor-pointer"
          />
        </form>
      )}

      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default SlugPost;

export const getStaticPaths = async () => {
  const postQuery = `*[_type == "post"]{
        _id,
        slug
    }`;

  const posts = await sanityClient.fetch(postQuery);

  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));

  console.log(paths);
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postQuery = `*[_type == 'post' && slug.current == $slug][0]{
        _id,
        _createdAt,
        description,
        mainImage,
        author -> {
            name,
            image
        },
        title,
        'comments': *[_type == 'comment' && post._ref == ^._id && approved == true],
        slug,
        body
    }`;

  const post = await sanityClient.fetch(postQuery, {
    slug: params.slug,
  });

  if (!post)
    return {
      notFound: true,
    };

  return { props: { post } };
};
