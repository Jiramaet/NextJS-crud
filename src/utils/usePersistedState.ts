// นำเข้า useState, useEffect, Dispatch และ SetStateAction จากโมดูล react
import { useState, useEffect, Dispatch, SetStateAction } from "react";

// กำหนดชนิดข้อมูล Response ที่มีการรับค่าและการกำหนดค่าของ state
type Response<T> = [T, Dispatch<SetStateAction<T>>];

// กำหนดฟังก์ชัน usePersistedState ที่ใช้ในการจัดการ state ที่ถูกเก็บไว้ใน local storage
function usePersistedState<T>(key: string, initialState: T): Response<T> {
  // ใช้ useState เพื่อสร้าง state และ setState
  const [state, setState] = useState(() => {
    // ถ้าอยู่ในบราวเซอร์ (process.browser) ให้คืนค่าจาก local storage หากมีข้อมูลที่เก็บใน key นั้น ไม่มีให้ใช้ initialState
    if (process.browser) {
      const storageValue = localStorage.getItem(key);

      if (storageValue) {
        return JSON.parse(storageValue);
      }
      return initialState;
    } else {
      return initialState; // ในกรณีที่ไม่ได้อยู่ในบราวเซอร์ (เช่น เซิร์ฟเวอร์) ให้ใช้ initialState
    }
  });

  // ใช้ useEffect เพื่อทำการเซฟ state ใหม่เมื่อมีการเปลี่ยนแปลงใน state หรือ key
  useEffect(() => {
    process.browser && localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  // คืนค่า state และ setState
  return [state, setState];
}

// ส่งออกฟังก์ชัน usePersistedState เป็น default export
export default usePersistedState;
