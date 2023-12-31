"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { tools } from "@/constants";

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-8 mt-4 space-y-4">
        <h2 className="text-2xl mt-6 md:text-4xl font-bold text-center">
          Explore and Experience the power of AI
        </h2>

      </div>
      <h2 className="bg-gray" style={{marginBottom:"2px",backgroundColor:"#efefef",borderBottom:"1px solid #ccc",paddingLeft:"20px"}}>Prompts</h2>

      <div className="m-20 mt-5 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">

        {tools.map((tool) => (
          <Card onClick={() => router.push(tool.href)} key={tool.href} className="p-8 pl-2 pb-2 border-black   items-center justify-between hover:shadow-md transition cursor-pointer hover:bg-sky-50" style={{minHeight:"200px",minWidth:"185px"}}>
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}

              </div>
            </div>
            <div className="font-light text-xs"  style={{textAlign:"center",paddingTop:"20px"}}>
                  {tool.description}
                </div>
          </Card>
        ))}
      </div>
      <h2 className="bg-gray" style={{marginBottom:"2px",backgroundColor:"#efefef",borderBottom:"1px solid #ccc",paddingLeft:"20px"}}>
        Transformation Tools
        </h2>
      coming soon ...
    </div>
  );
}
