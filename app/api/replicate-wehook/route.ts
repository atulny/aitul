import { NextApiRequest, NextApiResponse } from "next";
import Router, { withRouter } from 'next/router'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("🪝 incoming webhook!", req.body.id);
    //const response = req.body;
    //await saveToMyDatabase(response);
    Router.forward
    res.end();
  }

