// นำเข้าโมดูลและคอมโพเนนต์ที่จำเป็น
import { DefaultTheme, ThemeProvider } from "styled-components";
import GlobalStyle from "../styles/global";
import usePersistedState from "../utils/usePersistedState";
import light from "../styles/themes/light";
import dark from "../styles/themes/dark";
import { ToastContainer } from "react-toastify";// ใช้แสดงข้อความแจ้งเตือนบนหน้าเว็บ

// กำหนดฟังก์ชันหลักของแอพ MyApp ซึ่งรับพารามิเตอร์เป็น Component และ pageProps
function MyApp({ Component, pageProps }) {
  // ใช้ hook usePersistedState เพื่อบันทึกค่าธีมที่ผู้ใช้เลือกไว้ใน local storage
  const [theme, setTheme] = usePersistedState<DefaultTheme>("theme", dark);

  // กำหนดฟังก์ชัน toggleTheme เพื่อสลับธีมระหว่าง light และ dark
  const toggleTheme = () => {
    setTheme(theme.title === "light" ? dark : light);
  };

  // ส่ง Component และ pageProps ให้กับ Component ที่ถูกกำหนดไว้ใน App และแสดง ToastContainer สำหรับแสดงการแจ้งเตือนและแสดง GlobalStyle เพื่อใช้งานสไตล์ CSS ระดับโลก
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} toggleTheme={toggleTheme} />
      <ToastContainer />
      <GlobalStyle />
    </ThemeProvider>
  );
}

// ส่งออก MyApp เป็น default export
export default MyApp;
