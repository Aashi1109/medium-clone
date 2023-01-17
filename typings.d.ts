export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: { current: string };
  body: [object];
  comments: [Comment];
}

export interface Comment {
  _id: string;
  _createdAt: string;
  approved: string;
  name: string;
  comment: string;
  email: string;
  _rev: string;
  post: {
    _ref: string;
    _type: string;
  };
  _type: string;
  _updatedAt: string;
}
