// นำเข้าโมดูลและคล้ายๆ กับ axios สำหรับการทำ HTTP requests
import axios from "axios";
// นำเข้า Hook และ Function ที่ใช้ใน React
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
// นำเข้าไอคอนที่ใช้แสดงบนหน้าเว็บ
import { FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
// นำเข้าคอมโพเนนต์ที่ใช้สร้าง Tooltip
import ReactTooltip from "react-tooltip";
// นำเข้า Context และ Theme ที่ใช้สำหรับการจัดการสี
import { ThemeContext, DefaultTheme } from "styled-components";
// นำเข้าสไตล์ของคอมโพเนนต์ที่ใช้ในตาราง
import { Container, Tr, Th, Td, Button, NoTools } from "./styles";
// นำเข้าคอมโพเนนต์ที่ใช้สำหรับแสดงข้อความแจ้งเตือน
import { toast } from "react-toastify";
// นำเข้าสไตล์ของ react-toastify
import "react-toastify/dist/ReactToastify.css";

// กำหนด Interface ของข้อมูลเครื่องมือ
interface Tool {
  _id: string;
  name: string;
  description: string;
  link: string;
}

// กำหนด Interface ของ Props สำหรับ Table Component
interface Props {
  tools: Tool[]; // รายการเครื่องมือ
  setTools: Dispatch<SetStateAction<Tool[]>>; // ฟังก์ชันที่ใช้ในการอัปเดตรายการเครื่องมือ
  openEditModal(tool): void; // ฟังก์ชันที่ใช้ในการเปิด Modal สำหรับแก้ไขเครื่องมือ
}

// ฟังก์ชันหลักของ Table Component
function Table({ tools, openEditModal, setTools }: Props) {
  // สถานะสำหรับการปิดใช้งานปุ่มลบ
  const [deleteButtonsDisabled, setDeleteButtonsDisabled] = useState(false);
  // เรียกใช้ Context และ Theme ของ Styled Components
  const theme = useContext<DefaultTheme>(ThemeContext);

  // useEffect สำหรับการ Rebuild Tooltip เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  // ถ้าไม่มีเครื่องมือ
  if (tools.length <= 0) {
    return <NoTools>No tool yet :c</NoTools>;
  }

  // ฟังก์ชันสำหรับการลบเครื่องมือ
  async function handleDelete(id) {
    try {
      setDeleteButtonsDisabled(true); // ปิดใช้งานปุ่มลบ
      await axios.delete(`/api/tools/${id}`); // ส่งคำขอลบเครื่องมือ
      const filteredTools = tools.filter(
        (tool) => tool._id.toString() !== id.toString()
      ); // กรองเครื่องมือที่ถูกลบออก
      setTools(filteredTools); // อัปเดตรายการเครื่องมือ
      toast.success("Deleted with success"); // แสดงข้อความแจ้งเตือนสำเร็จ
    } catch (error) {
      toast.error("Error on delete, please try again"); // แสดงข้อความแจ้งเตือนข้อผิดพลาด
    } finally {
      setDeleteButtonsDisabled(false); // เปิดใช้งานปุ่มลบอีกครั้งหลังจากทำการลบเสร็จสิ้น
    }
  }

  // ส่วนของโค้ดที่คืนค่าตารางเครื่องมือ
  return (
    <Container>
      {/* ส่วนหัวของตาราง */}
      <thead>
        <Tr>
          <Th>Name</Th>
          <Th>Description</Th>
          <Th>Action</Th>
        </Tr>
      </thead>
      {/* ส่วนเนื้อหาของตาราง */}
      <tbody>
        {tools.map((tool) => (
          <Tr key={tool._id}>
            <Td>{tool.name}</Td>
            <Td>{tool.description}</Td>
            <Td>
              {/* ปุ่มลิงก์ไปยังเครื่องมือ */}
              <Button onClick={() => {}} data-tip data-for="link">
                <a href={tool.link} target="_blank">
                  <FiExternalLink size={18} color={theme.colors.primary} />
                </a>
              </Button>
              {/* ปุ่มแก้ไขเครื่องมือ */}
              <Button
                onClick={() => {
                  openEditModal(tool);
                }}
                data-tip
                data-for="edit"
              >
                <FiEdit2 size={18} color={theme.colors.primary} />
              </Button>
              {/* ปุ่มลบเครื่องมือ */}
              <Button
                disabled={deleteButtonsDisabled}
                onClick={() => {
                  handleDelete(tool._id);
                }}
                data-tip
                data-for="add"
              >
                <FiTrash2 size={18} color={theme.colors.primary} />
              </Button>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Container>
  );
}// ส่วนสุดท้ายที่ส่งออกคอมโพเนนต์
export default Table;
