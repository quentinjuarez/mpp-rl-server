import { Router, Request, Response } from "express";
import axios from "axios";

import isAuth from "../../middlewares/isAuth";

const router = Router();

router.get("/", isAuth, async (req: Request, res: Response) => {
  const url = req.query.url;

  try {
    if (!url) {
      return res.status(400).json({ error: "Missing URL query parameter" });
    }

    let params = {};

    try {
      params = JSON.parse((req.query.params as string) || "{}");
    } catch (err) {
      return res.status(400).json({ error: "Invalid params query parameter" });
    }

    console.log(params);

    const response = await axios.get(
      url as string,
      Object.keys(params).length > 0 ? { params } : {},
    );

    const fullPathDebug = `${response.request.protocol}//${response.request.host}${response.request.path}`;
    console.log({ fullPathDebug });

    return res.send(response.data);
  } catch (err) {
    return res.status(500).send("Error fetching URL");
  }
});

export default router;
