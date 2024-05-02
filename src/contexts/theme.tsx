// นำเข้าคำสั่งและคอมโพเนนต์ที่จำเป็น
import React, { createContext, useContext } from "react";
import { DefaultTheme } from "styled-components";

// นำเข้าฟังก์ชัน usePersistedState เพื่อใช้ในการบันทึกสถานะของธีม
import usePersistedState from "../utils/usePersistedState";

// นำเข้าธีมไฟล์ที่กำหนดไว้
import light from "../styles/themes/light";
import dark from "../styles/themes/dark";

// กำหนดรูปแบบของข้อมูลที่จะใช้ใน Context
interface ThemeContextData {
  theme: DefaultTheme;
  toggleTheme: Function;
}

// สร้าง Context สำหรับการจัดการธีม
const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

// Component สำหรับการจัดการธีม
export const ThemeProvider: React.FC = ({ children }) => {
  // ใช้ Hook usePersistedState เพื่อเก็บสถานะของธีม
  const [theme, setTheme] = usePersistedState<DefaultTheme>("theme", light);

  // ฟังก์ชันสำหรับเปลี่ยนธีม
  const toggleTheme = () => {
    setTheme(theme.title === "light" ? dark : light);
  };

  // สร้าง Context.Provider เพื่อให้ Component ที่เรียกใช้งาน Context นี้ได้รับค่า
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook สำหรับใช้งาน Context ของธีม
export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}

// Higher-Order Component สำหรับการใช้ Context ของธีมใน Component อื่น ๆ
export function withThemeContext(Component) {
  return function contextComponent(props) {
    return (
      <ThemeContext.Consumer>
        {(context) => <Component {...props} context={context} />}
      </ThemeContext.Consumer>
    );
  };
}
