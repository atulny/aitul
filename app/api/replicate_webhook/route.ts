import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import prismadb from "@/lib/prismadb";

const urlre=new RegExp(/^(.*:)\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$/)

export async function POST(req: NextRequest, res:NextResponse ) {
  const body = await req.arrayBuffer();
  const b = Buffer.from(body)
  //check if there is an id
  let parts=req.url?.match(urlre)||[]
  let params=(parts[4]||"").replace(/^\?/,"").split("=")||[]
  let id=""
  if (params.length){
    id=params[1]||""
  }
  const chunks = [];
  //for await (let chunk of body) {
 //   chunks.push(chunk);
 // }

 // console.log(Buffer.concat(chunks));
 try{
  const wh = await prismadb.webhookCache.update({
    where: { 
      id:id
    },
    data: {
      cache:b
    }
  })
 } catch(e){
  //pass
 }
  console.log(`webhook  ${id||"t"} ${body}`)
  //res.json({ message: `You submitted the following data: ${body}` })

  return new NextResponse("hello", { status: 200 })
};

