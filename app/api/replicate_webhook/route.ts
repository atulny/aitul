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

  console.log(`webhook  ${id||"t"}`)
  res.status(200).json({ message: `You submitted the following data: ${body}` })

  //return new NextResponse("hello", { status: 200 })
};

 
export async function GET(req: NextApiRequest, res:NextApiResponse) {
  console.log(`webhook  ${req.query?.id||"t"}`)
  res.status(200).json({ message: `You submitted the following data` })

  //return new NextResponse("hello", { status: 200 })
};
