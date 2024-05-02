// นำเข้าคอมโพเนนต์และฟังก์ชันที่จำเป็น
import {
  useState,  // ใช้สำหรับเก็บสถานะใน Component
  useCallback,  // ใช้สำหรับกำหนดฟังก์ชัน Callback ที่ไม่เปลี่ยนแปลงตัวแปร
  useContext,  // ใช้ในการเข้าถึงค่าจาก Context
  forwardRef,  // ใช้ในการส่ง ref ไปยังคอมโพเนนต์ลูก
  useImperativeHandle,  // ใช้ในการกำหนดฟังก์ชันที่จะถูกเรียกใช้จากภายนอก Component
  FormEvent,  // ใช้ในการกำหนดชนิดของอีเวนต์ในฟอร์ม
  Dispatch,  // ใช้ในการส่งออกเหตุการณ์เพื่อเปลี่ยนแปลงสถานะ
  SetStateAction,  // ใช้ในการกำหนดประเภทของอาร์กิวเมนต์ที่จะเป็นอินพุตของสถานะ

} from "react";

// นำเข้า Context และ DefaultTheme จาก styled-components เพื่อใช้ในการกำหนดธีม
import { ThemeContext, DefaultTheme } from "styled-components";

// นำเข้าไอคอนจาก react-icons/fi
import { FiTool, FiBookOpen, FiLink } from "react-icons/fi";

// นำเข้า OutsideClickHandler เพื่อให้ปิด Modal เมื่อคลิกข้างนอก
import OutsideClickHandler from "react-outside-click-handler";

// นำเข้าฟังก์ชัน toast จาก react-toastify เพื่อแสดงข้อความแจ้งเตือน
import { toast } from "react-toastify";

// นำเข้าสไตล์และคอมโพเนนต์ที่ใช้ในการสร้าง Modal
import {
  Container,
  ModalTitle,
  Form,
  InputGroup,
  Input,
  Button,
  CancelButton,
  ButtonsWrapper,
  TextAreaGroup,
  TextArea,
} from "./styles";

// นำเข้า Axios เพื่อใช้ในการส่งคำขอ HTTP
import axios from "axios";

// นำเข้า retinaImage จาก polished
import { retinaImage } from "polished";


// กำหนด Interface สำหรับ ModalHandles เพื่อให้ Component ลูกสามารถเรียกใช้ฟังก์ชัน openModal และ openEditModal ได้
export interface ModalHandles {
  openModal: () => void; // ฟังก์ชันเปิด Modal
  openEditModal: (tool: Tool) => void; // ฟังก์ชันเปิด Modal แก้ไข Tool
}

// กำหนด Interface สำหรับ Tool ที่ใช้ใน Modal
interface Tool {
  _id: string; // ไอดีของเครื่องมือ
  name: string; // ชื่อเครื่องมือ
  description: string; // คำอธิบายของเครื่องมือ
  link: string; // ลิงก์ของเครื่องมือ
}

// กำหนด Props สำหรับ Modal Component
interface Props {
  tools: Array<Tool>; // รายการเครื่องมือทั้งหมด
  setTools: Dispatch<SetStateAction<Tool[]>>; // ฟังก์ชันสำหรับกำหนดสถานะของเครื่องมือ
}

// กำหนด Component Modal
const Modal: React.ForwardRefRenderFunction<ModalHandles, Props> = (
  { tools, setTools }, // รับ Props เข้ามาใน Component
  ref // รับ Ref ของ Component
) => {
  // กำหนดสถานะสำหรับ Modal
  const [visible, setVisible] = useState(false); // สถานะการแสดง Modal
  const [name, setName] = useState(""); // ชื่อเครื่องมือ
  const [description, setDescription] = useState(""); // คำอธิบายของเครื่องมือ
  const [link, setLink] = useState(""); // ลิงก์ของเครื่องมือ
  const [tool, setTool] = useState<Tool>(); // เครื่องมือที่ถูกเลือก
  const [buttonDisabled, setButtonDisabled] = useState(false); // สถานะการปิดปุ่ม

  // เรียกใช้ Context และ Theme
  const theme = useContext<DefaultTheme>(ThemeContext);

  // ฟังก์ชันสำหรับล้างข้อมูลในฟิลด์
  const clearFields = useCallback(() => {
    setName("");
    setDescription("");
    setLink("");
    setTool(undefined);
  }, []);

  // ฟังก์ชันสำหรับปิด Modal
  const closeModal = useCallback(() => {
    clearFields();
    setVisible(false);
  }, []);

  // ฟังก์ชันสำหรับเปิด Modal
  const openModal = useCallback(() => {
    setVisible(true);
  }, []);

  // ฟังก์ชันสำหรับเปิด Modal แก้ไข Tool
  const openEditModal = useCallback((tool: Tool) => {
    setName(tool.name);
    setDescription(tool.description);
    setLink(tool.link);
    setVisible(true);

    setTool(tool);
  }, []);

  // กำหนด Ref สำหรับเรียกใช้ฟังก์ชันเปิด Modal และ Modal แก้ไข Tool
  useImperativeHandle(ref, () => {
    return {
      openModal,
      openEditModal,
    };
  });

  // ฟังก์ชันสำหรับการส่งฟอร์ม
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // หยุดการกระทำ Default ของฟอร์ม

    try {
      setButtonDisabled(true); // กำหนดสถานะปุ่มเพื่อป้องกันการคลิกซ้ำ
      const tool = { name, description, link }; // สร้างข้อมูลเครื่องมือ
      const response = await axios.post("/api/tools/store", tool); // ส่งคำขอ HTTP เพื่อบันทึกเครื่องมือใหม่
      toast.success("Tool add successfully"); // แสดงข้อความสำเร็จ
      closeModal(); // ปิด Modal

      const newTool = { ...tool, _id: response.data.toString() }; // สร้างเครื่องมือใหม่พร้อม ID ที่ได้จากการเพิ่ม
      const updatedTools = [...tools, newTool]; // รวมเครื่องมือใหม่กับรายการเครื่องมือทั้งหมด
      setTools(updatedTools); // กำหนดรายการเครื่องมือใหม่ให้กับสถานะ
    } catch (error) {
      console.log(error); // แสดงข้อผิดพลาดใน Console
      toast.error("Error on add tool, please try again"); // แสดงข้อความแจ้งเตือนข้อผิดพลาด
    } finally {
      setButtonDisabled(false); // เปิดใช้งานปุ่มอีกครั้งหลังจากการส่งคำขอเสร็จสิ้น
    }
  }


 // ฟังก์ชันสำหรับการส่งคำขอการแก้ไขเครื่องมือ
async function handleEditSubmit(event: FormEvent) {
  event.preventDefault(); // หยุดการกระทำ Default ของฟอร์ม

  try {
    setButtonDisabled(true); // กำหนดสถานะปุ่มเพื่อป้องกันการคลิกซ้ำ
    const updatedTool = { _id: tool._id, name, description, link }; // สร้างข้อมูลเครื่องมือที่ถูกแก้ไข
    await axios.put(`/api/tools/${tool._id}`, updatedTool); // ส่งคำขอ HTTP เพื่ออัปเดตเครื่องมือ
    toast.success("Tool updated successfully"); // แสดงข้อความสำเร็จ
    closeModal(); // ปิด Modal

    const updatedTools = tools.map((tool) => { // อัปเดตรายการเครื่องมือ
      if (tool._id.toString() === updatedTool._id.toString()) { // หากไอดีของเครื่องมือตรงกับที่ถูกแก้ไข
        return updatedTool; // ให้ใช้เครื่องมือที่ถูกแก้ไขแทน
      } else {
        return tool; // ถ้าไม่ใช่ให้ใช้เครื่องมือเดิม
      }
    });

    setTools(updatedTools); // กำหนดรายการเครื่องมือใหม่ให้กับสถานะ
  } catch (error) {
    toast.error("Error on update tool, please try again"); // แสดงข้อความแจ้งเตือนข้อผิดพลาด
  } finally {
    setButtonDisabled(false); // เปิดใช้งานปุ่มอีกครั้งหลังจากการส่งคำขอเสร็จสิ้น
  }
}

if (!visible) { // ถ้า Modal ไม่ปรากฏ
  return null; // ไม่แสดงอะไร
}

return (
  <Container>
    <OutsideClickHandler onOutsideClick={closeModal}>
      <Form onSubmit={tool ? handleEditSubmit : handleSubmit}> {/* ส่งฟังก์ชันที่ถูกเรียกใช้งานไป */}
        <ModalTitle>{name !== "" ? name : "Tool"}</ModalTitle> {/* กำหนดชื่อ Modal */}
        <InputGroup>
          <FiTool size={16} color={theme.colors.primary} />
          <Input
            type="text"
            placeholder="Tool name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>

        <TextAreaGroup>
          <FiBookOpen size={16} color={theme.colors.primary} />
          <TextArea
            placeholder="A small descripiton of the tool"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </TextAreaGroup>

        <InputGroup>
          <FiLink size={16} color={theme.colors.primary} />
          <Input
            type="text"
            placeholder="Where I find the tool?"
            required
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </InputGroup>

        <ButtonsWrapper>
          <CancelButton type="button" onClick={closeModal}>
            Cancel
          </CancelButton>
          {tool ? (
            <Button type="submit" disabled={buttonDisabled}>
              Update
            </Button>
          ) : (
            <Button type="submit" disabled={buttonDisabled}>
              Add new
            </Button>
          )}
        </ButtonsWrapper>
      </Form>
    </OutsideClickHandler>
  </Container>
);
};

export default forwardRef(Modal);
