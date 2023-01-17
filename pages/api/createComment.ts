import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../sanity";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { _id, name, email, comment } = req.body;
  // console.log(req.body);
  try {
    await sanityClient.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      comment,
      email,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Couldn't send message" });
  }

  return res.status(400).json({ success: "Comment submitted" });
};

export default handler;
