import React from "react";
import ReactTooltip from "react-tooltip";

// คอมโพเนนต์สำหรับการแสดงข้อความแสดงคำแนะนำ
const Tooltips: React.FC = () => {
  return (
    <>
      {/* ข้อความแสดงคำแนะนำสำหรับการสลับธีม */}
      <ReactTooltip id="toggleTheme" effect="solid">
        <span>Toggle theme</span>
      </ReactTooltip>

      {/* ข้อความแสดงคำแนะนำสำหรับการเพิ่มเครื่องมือใหม่ */}
      <ReactTooltip id="add" effect="solid">
        <span>Add new tool</span>
      </ReactTooltip>

      {/* ข้อความแสดงคำแนะนำสำหรับการเปิดลิงก์ในแท็บใหม่ */}
      <ReactTooltip id="link" effect="solid">
        <span>Open in new tab</span>
      </ReactTooltip>

      {/* ข้อความแสดงคำแนะนำสำหรับการแก้ไขเครื่องมือ */}
      <ReactTooltip id="edit" effect="solid">
        <span>Edit tool</span>
      </ReactTooltip>

      {/* ข้อความแสดงคำแนะนำสำหรับการลบเครื่องมือ */}
      <ReactTooltip id="delete" effect="solid">
        <span>delete tool</span>
      </ReactTooltip>
    </>
  );
};

export default Tooltips;
