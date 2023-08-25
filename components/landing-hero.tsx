"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image"

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>AI Toolset</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 text-base">
         
          <TypewriterComponent
            options={{
              strings: [
                "Chatbot.",
                "Photo Generation.",
                "Video Generation.",
                "Music Generation.",
                "Blog Writing.",
                "Mail Writing."
              ],
              autoStart: true,
              loop: true,
              skipAddStyles:true
            }}
          />
           <div  style={{textAlign:"center", width:"500px", height:"300px",margin:"auto"}}>
        <Image  width={500} height={500} alt="hero"  src="/ai-tools-hero.png"  />
          </div>
        </div>
      </div>
      <div className="text-sm mt-20 md:text-xl font-light text-zinc-400" style={{marginTop:"1em"}}>
        Generate content using AI.
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button  className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
            Start Generating
          </Button>
        </Link>
      </div>
      {/* <div className="text-zinc-400 text-xs md:text-sm font-normal">
        No credit card required.
      </div> */}
      <div style={{position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          textAlign:"center",
          font:"small-caption;8px",
          color:"grey",marginTop:"40px" }}>
        Inspired and adapted from https://github.com/AntonioErdeljac/next13-ai-saas
      </div>
    </div>
  );
};
