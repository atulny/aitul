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
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 text-base" style={{minHeight:"30px"}}>
         
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
           <div  style={{textAlign:"center", width:"400px", maxWidth:"98%",height:"300px",margin:"auto"}}>
        <Image  width={400} height={500} alt="hero"  src="/ai-tools-hero2.png"  />
          </div>
        </div>
      </div>
   
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button  className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
            Get Started: Generate Content
          </Button>
        </Link>
      </div>
      {/* <div className="text-zinc-400 text-xs md:text-sm font-normal">
        No credit card required.
      </div> */}
      <div style={{position: "fixed",
          left: 0,
          zIndex:2,
          bottom: "25px",
          width: "100%",
          textAlign:"center",
          font:"medium-caption;8px",
          color:"yellow",marginTop:"20px" }}>
       <a href="http://atulsharma.tech" target="_blank">About me</a>
      </div>
      <div style={{position: "fixed",
          left: 0,
          zIndex:2,
          bottom: 0,
          width: "100%",
          textAlign:"center",
          font:"small-caption;8px",
          color:"#666",marginTop:"20px" }}>
        Inspired and adapted from https://github.com/AntonioErdeljac/next13-ai-saas
      </div>
    </div>
  );
};
