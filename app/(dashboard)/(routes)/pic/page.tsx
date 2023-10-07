"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProModal } from "@/hooks/use-pro-modal";
import React from "react";
import Webcam from "react-webcam";
import { amountOptions, formSchema, resolutionOptions } from "./constants";

const PicPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string >("");
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState("");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setCaptureEnable(false);
    if (imageSrc) {
      console.log(imageSrc)
      setCreateObjectURL("")
      setUrl(imageSrc);
    }
  }, [webcamRef]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512"
    }
  });
  /*
  const base64String = 'data:image/png;base64,iVBORw0KGg...'; // Base64 string
const binaryString = atob(base64String.split(',')[1]); // Binary data string
const blob = new Blob([binaryString], { type: 'image/png' }); // Create a BLOB object
  */

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setPhotos([]);

      const response = await axios.post('/api/image', values);

      const urls = response.data.map((image: { url: string }) => image.url);

      setPhotos(urls);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }
  const videoConstraints = {
    facingMode: "user"
  };
  const uploadToClient = (event:any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setUrl("")
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event:any) => {
    if (!image){
      return
    }
    const body = new FormData();
    body.append("file", image);
    const response = await fetch("/api/file", {
      method: "POST",
      body
    });
  };
  return ( 
    <div>
      <Heading
        title="Image Generation"
        description="Generate an image from your description."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
      <div>

        <label  style={{display:"inline-block",width:"400px", backgroundColor:"#fcfcfc",padding:"20px", border:"2px dotted #333", cursor:"pointer"}}>
          Drop a File or Click to Select Image
            <input type="file" name="myImage" id="myImage" onChange={uploadToClient} style={{visibility:"hidden",width:"10px",height:"1px"}}/>
        </label>
        <div  style={{display:"inline-block",width:"400px",backgroundColor:"#fcfcfc",padding:"20px", border:"2px dotted #333", marginLeft:"5px", cursor:"pointer"}} onClick={() => setCaptureEnable(true)}>
          Capture Image from the device Camera
        </div>

        {/* <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button> */}
      </div>
      {isCaptureEnable && (
        <>
        <div>
            <button onClick={() => setCaptureEnable(false)}>Cancel/Hide Camera </button>
          </div>
          <Webcam 
          videoConstraints={videoConstraints}               
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          />
            <button onClick={capture}>Capture Image</button>
          </>
        )}
        {(url || createObjectURL) && !isCaptureEnable && (
          <div>
            <Image width={500}  height={500} src={url|| createObjectURL}  alt="Screenshot" />
          </div>
          )}
          {image  && !isCaptureEnable && (
          <div>
            <Image width={500}  height={500} src={image}  alt="Screenshot" />
          </div>
          )}
          <label style={{display:"block",marginTop:"10px"}}>Image description</label>
          <input placeholder="a face" style={{border:"1px solid #666",width:"20em",padding:"2px"}}>
          </input>
          <label style={{display:"block",marginTop:"10px"}}>Target image description</label>
          <input placeholder="a face with blond hair"  style={{border:"1px solid #666",width:"20em",padding:"2px"}}>
          </input>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {!image && !isLoading && (
          <Empty label="No images generated." />
        )}
      </div>
    </div>
   );
}
 
export default PicPage;
