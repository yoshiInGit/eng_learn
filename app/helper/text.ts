/**
 * 特定のフォーマットのテキストデータからJSONオブジェクトを抽出する関数
 * @param text 変換対象のテキスト
 * @returns 抽出されたJSONオブジェクト
 */
export function extractJsonFromText(text: string): any {
    try {
      // テキストからJSON部分を抽出
      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = text.match(jsonRegex);
      
      if (match && match[1]) {
        // 抽出されたJSON文字列をパース
        const jsonString = match[1].trim();
        const jsonObject = JSON.parse(jsonString);
        return jsonObject;
      } else {
        throw new Error("JSON形式のテキストが見つかりませんでした");
      }
    } catch (error) {
      console.error("JSONの抽出・パースに失敗しました:", error);
      return null;
    }
  }