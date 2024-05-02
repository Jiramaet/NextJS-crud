import { VercelRequest, VercelResponse } from "@vercel/node";  // api vercel

import indexTools from "../../../utils/indexTools";

//เป็นการสร้างฟังก์ชันที่เป็น default export ซึ่งรับพารามิเตอร์เป็น req (Vercel Request) และ res (Vercel Response) และใช้การเขียนแบบ arrow function.
export default async (req: VercelRequest, res: VercelResponse) => {
  const tools = await indexTools();

  return res.status(200).json(tools);
};