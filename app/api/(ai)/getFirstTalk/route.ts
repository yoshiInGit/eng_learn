import { NextRequest, NextResponse } from "next/server";
import { invokeGemini } from "../gemini";

/*
requestBody:{
    "situation": "string",
    "conversation": string,
}
*/
export async function POST(request: NextRequest): Promise<NextResponse>{
    const requestBody = await request.json();
    const { situation, conversation } = requestBody;
    console.log("situation", situation);
    console.log("conversation", conversation); 

    //TODO : ここで会話の状況を設定するAPIを呼び出す
    const res = await invokeGemini({prompt: prompt({situation})});


    return NextResponse.json({ 
        message: res, 
    });
}

const prompt = ({situation}:{situation : string}) => `
これからあなたと私で与えられた状況で英語で会話をします。
まずあなたから会話をはじめてください。
会話はできるだけ質問になるようにしてください。
会話では"/"を使って文を構成せず、適当に確定した文にしてください。
<example>
Good morning, sir.
</example>

<situation>
${situation}
</situation>

ASSISTANT:
`