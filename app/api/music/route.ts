import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import prismadb from "@/lib/prismadb";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});
const urlre=new RegExp(/^(.*:)\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$/)
function sleep (delay: number): any {
  return new Promise((resolve) => setTimeout(resolve, delay)) 
}
export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }
    let parts = req.url.match(urlre)||[]
    let sourceurl= `${parts[1]}//${parts[2]}${parts[3]||""}`
    if (sourceurl.includes("localhost")){
      sourceurl="http://73.80.105.96:3000"
    }
    console.log(sourceurl)
    const wh = await prismadb.webhookCache.create({
      data: { 
        typ:"music"
      }
    })
    let response = null
    try{
     response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt
        },
        webhook: `${sourceurl}/api/replicate_webhook?id=${wh?.id||"undefined"}`,
            webhook_events_filter: ["completed"], // optional
      }
    );
    } catch(e){
      console.log("music error",e)
      let i: number = 0;
      while (i< 10){
        await sleep(i<2?500:i<5?5000:i<8?10000:20000)
        console.log(`checking music cache:${i}`)

        i ++
        const wh_data = await prismadb.webhookCache.findFirst({
          where: { 
            id:wh?.id||"undefined"
          }
        });
        //console.log(`checking cache:${wh_data}`)
        if (wh_data?.cache){
          let response_data = JSON.parse(wh_data?.cache.toString() )|| {}
          response = response_data?.output
          console.log(`got music cache:${response_data?.output}`)

          break;
        }  
      }
    }
    finally{
      console.log(`music call completed ${response}`)        
      //remove
      await prismadb.webhookCache.delete({
        where: { 
          id:wh.id||"undefined"
        }
      });
      //console.log(`delete cache`)

      
    }
    if (!response){
      throw "unable to resolve music. Please try again"
    }
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log('[MUSIC_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
