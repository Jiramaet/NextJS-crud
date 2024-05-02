//VercelRequest และ VercelResponse เป็นอ็อบเจ็กต์ที่ใช้สำหรับรับข้อมูลของคำขอและส่งข้อมูลของการตอบกลับใน Vercel Functions
import { VercelRequest, VercelResponse } from "@vercel/node";
import connectToDatabase from "../../../utils/connectToDatabase";

import { ObjectId } from "mongodb";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { name, description, link } = req.body; // import data

  const { //import {id}
    query: { id },
    method,
  } = req;

  const db = await connectToDatabase(process.env.DATABASE_URL);

  const collection = db.collection("tools"); //เลือกคอลเล็กชัน "tools" จากฐานข้อมูล:

  const o_id = new ObjectId(`${id}`); //สร้างอ็อบเจ็กต์ ObjectId จาก id ที่รับมา:

  switch (method) {
    case "GET": // cal data
      const tool = await collection.findOne({ _id: o_id });

      if (!tool) {
        return res.status(404).json({ error: "Tool not found" }).end();
      }

      return res.status(200).json(tool).end();
    case "PUT": // update data
      await collection.findOneAndUpdate(
        { _id: o_id },
        { $set: { name, description, link } },
        { upsert: true }
      );

      return res.status(200).end();
    case "DELETE": // delete data
      try {
        const tool = await collection.findOne({ _id: o_id });
        if (tool) {
          await collection.findOneAndDelete({ _id: o_id });
        }

        return res.status(200).end();
      } catch (err) {
        return res.status(500).json({
          error: "Error when deleting tool, please try again.",
        });
      }
    default:
      break;
  }
};