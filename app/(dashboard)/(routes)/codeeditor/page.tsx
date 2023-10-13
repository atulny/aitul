"use client";

import * as z from "zod";
import axios from "axios";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState , useRef} from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import Editor from "@monaco-editor/react"

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input} from "@/components/ui/input";
import {TextArea} from "@/components/ui/textArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";
import React from "react";
import dynamic from "next/dynamic";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

/* const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
); */
interface filesObj {
  [index: string]: string;
  name: string,
  language:string,
  value:string

}
interface fileDict {
  [index: string]: filesObj;

}
type Monaco = typeof monaco 
const files:fileDict = {
  "script.py": {
    name: "script.py",
    language: "python",
    value: "# Here is some python code for test"
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<div> </div>"
  }
}
/*

function HomePage() {
  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
  return (
    <div>
      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
        }}
      />
    </div>
  );
}*/
const CodePage = () => {
  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [opt, setOpt] = useState<String>("");
  const [loading, setLoading] = useState<boolean>(false);
  type OnMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void

  const [fileName, setFileName] = useState("script.py"); // change to "index.html"
  const editorRef:React.MutableRefObject<null>| undefined= useRef(null);
  const file:filesObj= files[fileName];
  /* const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco; */
 

  function handleEditorDidMount(editor:monaco.editor.IStandaloneCodeEditor, monaco:any) {
    if (editor != undefined){
      // eslint-disable-next-line no-alert
      //editorRef?.current = editor;
    }
  } 
  const handleEditorValueChange = (value: string|undefined) => {
    //console.log('event is ', event);
    if (value != undefined){
      file.value = value;
    }
  };
  function getEditorValue() {
    //alert(editorRef.current.getValue());
  }
  const onSubmit =  async () => {
   // eslint-disable-next-line no-alert
   //file.value

   setLoading(false);
  }
  return (
    <div>
      <Heading
        title="Code Review"
        description="Review and get recomendations."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">

        <Editor
          height="60vh"
          width="100%"
          theme="vs-dark"
          onMount={handleEditorDidMount}
          path={file.name}
          defaultLanguage={file.language}
          defaultValue={file.value}
        />
        <Button className="col-span-12 lg:col-span-2 w-full" type="button" disabled={loading} onClick={async (ev)=>{setLoading(true);await onSubmit()}} size="icon">
                Review
              </Button>
    </div>
    </div>
  );
}
 
export default CodePage;

