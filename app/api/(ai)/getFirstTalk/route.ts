import { NextRequest, NextResponse } from "next/server";

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


    return NextResponse.json({ 
        message: "HEllo! How are you doing?", 
    });
}
