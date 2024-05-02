// นำเข้าฟังก์ชัน connectToDatabase จากไฟล์ connectToDatabase.ts
import connectToDatabase from "./connectToDatabase";

// สร้างฟังก์ชัน default โดยใช้ async function
export default async function () {
  // เชื่อมต่อกับฐานข้อมูลโดยใช้ connectToDatabase และ uri จากตัวแปรสภาพแวดล้อม DATABASE_URL
  const db = await connectToDatabase(process.env.DATABASE_URL);

  // เลือกคอลเล็กชัน "tools" จากฐานข้อมูล
  const collection = db.collection("tools");

  // ดึงข้อมูลทั้งหมดจากคอลเล็กชันและแปลงเป็น array
  const tools = await collection.find().toArray();

  // คืนค่าข้อมูลเครื่องมือทั้งหมด
  return tools;
}
