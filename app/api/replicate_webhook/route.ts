import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server"

const urlre=new RegExp(/^(.*:)\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$/)

export async function POST(req: NextApiRequest, res:NextApiResponse ) {
  const body = req.body;
  //check if there is an id
  let parts=req.url?.match(urlre)||[]
  let params=(parts[4]||"").replace(/^\?/,"").split("=")||[]
  let id=""
  if (params.length){
    id=params[1]||""
  }
  const chunks = [];
  for await (let chunk of body) {
    chunks.push(chunk);
  }

  console.log(Buffer.concat(chunks));
  console.log(`webhook  ${id||"t"} ${body}`)
  //res.json({ message: `You submitted the following data: ${body}` })

  return new NextResponse("hello", { status: 200 })
};

