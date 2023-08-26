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
    console.log(sourceurl) ;
    let wh= null;
    try{
      wh = await prismadb.webhookCache.create({
        data: { 
          typ:"video"
        }
      })
    } catch(e){
      //pass
    }
    let response = null;
    try{
      
      response = await replicate.run(
          "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
          {
            input: {
              prompt,
            },
            webhook: `${sourceurl}/api/replicate_webhook?id=${wh?.id||"undefined"}`,
            webhook_events_filter: ["completed"], // optional
          }
        );
        //console.log(`finished run ${rr}`)
          
      } catch(e){
        console.log("video error",e)
        let i: number = 0;
        while (i< 10){
          await sleep(i<2?500:i<5?5000:i<8?10000:20000)
          console.log(`checking video cache:${i}`)
  
          i ++
          let wh_data = null;
          try{
            wh_data = await prismadb.webhookCache.findFirst({
              where: { 
                id:wh?.id||"undefined"
              }
            });
          } catch(e){
            //pass
          }
          //console.log(`checking cache:${wh_data}`)
          if (wh_data?.cache){
            let response_data = JSON.parse(wh_data?.cache.toString() )|| {}
            response = response_data?.output
            console.log(`got video cache:${response_data?.output}`)
  
            break;
          }  
        }
      }
      finally{
        console.log(`video call finally ${response}`)        
        //remove
        try{
          await prismadb.webhookCache.delete({
            where: { 
              id:wh?.id||"undefined"
            }
          });
        } catch(e){
          //pass
        }
        //console.log(`delete cache`)
      }
      if (!response){
        throw "unable to resolve video. Please try again"
      }
    
    
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response||{});
  } catch (error) {
    console.log('[VIDEO_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
