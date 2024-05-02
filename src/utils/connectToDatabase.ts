// นำเข้าโมดูลและคอมโพเนนต์ที่จำเป็น
import { MongoClient, Db } from "mongodb";
import url from "url";

// กำหนดตัวแปร cachedDb เพื่อเก็บฐานข้อมูลที่เชื่อมต่อไว้
let cachedDb: Db = null;

// กำหนดฟังก์ชัน connectToDatabase ซึ่งรับ uri เป็นพารามิเตอร์
async function connectToDatabase(uri: string) {
  // ถ้ามี cachedDb จะคืนค่า cachedDb กลับ
  if (cachedDb) {
    return cachedDb;
  }

  // เชื่อมต่อกับฐานข้อมูลโดยใช้ MongoClient
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // ดึงชื่อฐานข้อมูลจาก uri และใช้เป็นชื่อฐานข้อมูล
  const dbName = url.parse(uri).pathname.substr(1);
  const db = client.db(dbName);

  // เก็บฐานข้อมูลไว้ใน cachedDb เพื่อให้สามารถเรียกใช้ฐานข้อมูลเดิมได้โดยไม่ต้องเชื่อมต่อใหม่
  cachedDb = db;

  // คืนค่าฐานข้อมูล
  return db;
}

// ส่งออกฟังก์ชัน connectToDatabase เป็น default export
export default connectToDatabase;
