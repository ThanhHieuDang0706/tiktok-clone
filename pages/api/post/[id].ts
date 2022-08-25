import type { NextApiRequest, NextApiResponse } from "next";
import { uuid } from "uuidv4";
import { client } from "../../../utils/client";
import { postDetailQuery } from "../../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    const query = postDetailQuery(id);

    const data = await client.fetch(query);

    res.status(200).json(data[0]);
  }

  if (req.method === "PUT") {
    const { comment, userId } = req.body;

    const { id }: any = req.query;

    const data = await client
      .patch(id)
      // for the first time since there is no likes array initialized yet
      .setIfMissing({ comments: [] })
      .insert("after", "comments[-1]", [
        // kinda like python, insert at the end of array
        {
          comment,
          _key: uuid(),
          postedBy: {
            _type: "postedBy",
            _ref: userId,
          },
        },
      ])
      .commit();

    res.status(200).json(data);
  }
}
