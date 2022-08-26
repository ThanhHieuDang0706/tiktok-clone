import { client } from "./../../utils/client";

import { uuid } from "uuidv4";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { userId, postId, like } = req.body;

    // handle like
    const data = like
      ? await client
          .patch(postId)
          // for the first time since there is no likes array initialized yet
          .setIfMissing({ likes: [] })
          .insert("after", "likes[-1]", [
            // kinda like python, insert at the end of array
            {
              _key: uuid(),
              _ref: userId,
            },
          ])
          .commit()
      : // handle dislike
        await client
          .patch(postId)
          .unset([`likes[_ref=="${userId}"]`])
          .commit();

    // success
    res.status(200).json(data);
  }
}
