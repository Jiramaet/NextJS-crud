// นำเข้าโมดูลและคล้ายๆ กับ axios สำหรับการทำ HTTP requests
import Head from "next/head";
// นำเข้า Hook และ Function ที่ใช้ใน React
import { useCallback, useContext, useEffect, useRef, useState } from "react";
// นำเข้าไอคอนที่ใช้แสดงบนหน้าเว็บ
import { FiTool, FiSun, FiMoon, FiPlus } from "react-icons/fi";
// นำเข้า Context และ Theme ที่ใช้สำหรับการจัดการสี
import { ThemeContext, DefaultTheme } from "styled-components";
// นำเข้าคอมโพเนนต์ที่ใช้สร้าง Tooltip
import ReactTooltip from "react-tooltip";
// นำเข้าโมดูล axios สำหรับทำ HTTP requests
import axios from "axios";

// นำเข้าคอมโพเนนต์ Table
import Table from "../components/Table";
// นำเข้าคอมโพเนนต์ Tooltips
import Tooltips from "../components/Tooltips";
// นำเข้าคอมโพเนนต์ Modal และ ModalHandles ที่เป็น Ref
import Modal, { ModalHandles } from "../components/Modal";

// นำเข้าสไตล์และคอมโพเนนต์ที่ใช้สร้างหน้าแรก
import {
  Wrapper,
  Container,
  Header,
  LogoWrapper,
  TextWraper,
  Title,
  Subtitle,
  LeftSide,
  RightSide,
  ToggleTheme,
  Add,
} from "../styles/pages/home";
// นำเข้าโมดูล GetServerSideProps สำหรับการดึงข้อมูลจากเซิร์ฟเวอร์
import { GetServerSideProps } from "next";
// นำเข้าฟังก์ชัน indexTools สำหรับการดึงรายการเครื่องมือ
import indexTools from "../utils/indexTools";

// กำหนด Interface ของข้อมูลเครื่องมือ
interface Tool {
  _id: string;
  name: string;
  description: string;
  link: string;
}

// กำหนดคอมโพเนนต์หลัก Home
export default function Home({ toggleTheme, tools: storegedTools }) {
  // สถานะสำหรับเก็บข้อมูลเครื่องมือ
  const [tools, setTools] = useState<Array<Tool>>(storegedTools);

  // Context สำหรับ Theme
  const theme = useContext<DefaultTheme>(ThemeContext);
  // Ref สำหรับ Modal
  const modalRef = useRef<ModalHandles>(null);

  // useEffect สำหรับ Rebuild tooltips เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  // ฟังก์ชันเปิด Modal
  const openModal = useCallback(() => {
    modalRef.current?.openModal();
  }, []);

  // ฟังก์ชันเปิด Modal แก้ไขเครื่องมือ
  const openEditModal = useCallback((tool: Tool) => {
    modalRef.current?.openEditModal(tool);
  }, []);

  return (
    <div>
      {/* แท็ก Head สำหรับการตั้งค่าหัวเว็บ */}
      <Head>
        <title>Next Crud - Dev tools</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ส่วนหลักของหน้าแรก */}
      <Wrapper>
        <Container>
          <Header>
            <LeftSide>
              <TextWraper>
                <Title>
                  {/* โลโก้ */}
                  <LogoWrapper>
                    <FiTool color="#fff" size={18} />
                  </LogoWrapper>
                  Manage my tools
                </Title>
                {/* ข้อความรอง */}
                <Subtitle>
                  What makes your life easier as a programmer?
                </Subtitle>
              </TextWraper>
            </LeftSide>

            <RightSide>
              {/* ปุ่มเปลี่ยน Theme */}
              <ToggleTheme
                onClick={toggleTheme}
                data-tip
                data-for="toggleTheme"
              >
                {theme.title === "light" ? (
                  <FiSun size={28} color={theme.colors.secondary} />
                ) : (
                  <FiMoon size={28} color={theme.colors.secondary} />
                )}
              </ToggleTheme>
              {/* ปุ่มเพิ่มเครื่องมือ */}
              <Add onClick={openModal} data-tip data-for="add">
                <FiPlus size={36} color="fff" />
              </Add>
            </RightSide>
          </Header>
          {/* คอมโพเนนต์ตาราง */}
          <Table
            tools={tools}
            openEditModal={openEditModal}
            setTools={setTools}
          />
        </Container>
      </Wrapper>

      {/* คอมโพเนนต์ที่ใช้สำหรับ Tooltip */}
      <Tooltips />
      {/* คอมโพเนนต์ Modal */}
      <Modal tools={tools} setTools={setTools} ref={modalRef} />
    </div>
  );
}

// ฟังก์ชันเรียกข้อมูลเริ่มต้นที่เซิร์ฟเวอร์
export const getServerSideProps: GetServerSideProps = async () => {
  // เรียกข้อมูลเครื่องมือจากเซิร์ฟเวอร์
  const tools = await (await indexTools()).map((tool) => {
    return {
      ...tool,
      _id: tool._id.toString(),
      createdAt: tool.createdAt.toString(),
    };
  });

  // ส่งข้อมูลเครื่องมือกลับเป็น props
  return {
    props: {
      tools,
   

    },
  };
};
