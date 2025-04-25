import { NextRequest, NextResponse } from "next/server";
import { invokeGemini } from "../gemini";
import { extractJsonFromText } from "@/app/helper/text";

/*
requestBody:{
    "situation": "string",
    "messageHistory": string,
    "userMessage": string,
}
*/
export async function POST(request: NextRequest): Promise<NextResponse>{
    const requestBody = await request.json();
    const { situation, messageHistory, userMessage } = requestBody;

    const response = await invokeGemini({prompt: prompt({
        situation: situation,
        messageHistory: messageHistory,
        userMessage: userMessage,  
    })});


    const data = extractJsonFromText(response);


    return NextResponse.json(data);
}


const prompt = ({situation, messageHistory, userMessage}:{situation : string, messageHistory: string, userMessage: string}) => `
現在あなたと以下の指定した状況で英語で会話している。
これまでの会話履歴からこの以下のようなユーザーのメッセージが届いた。

このメッセージに対する返答を"message"に書いて。

また、"user message"に文法的な誤り、または不自然な返答がれば日本語で"correction"に訂正して。これまでの"message history"での間違いは無視して。
"user message"が日本語の場合は、英訳して。
何も誤りがなければnullにして。訂正には簡単な解説を入れて
<example>
正: He doesn't like coffee.
三人称単数（He）の現在形では、動詞に "s" をつけるか、"does not" の短縮形 "doesn't" を使います。
</example>

指定したjson形式で返答して

<situation>
${situation}
</situation>

<message history>
${messageHistory}
</message history>

<user message>
${userMessage}
</user message>

<response schema>
{ 
 message : str
 correction : str | null
}
</schema>
`
