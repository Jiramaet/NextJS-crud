// นำเข้าโมดูลและคอมโพเนนต์ที่จำเป็น
import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

// สร้างคลาส MyDocument ซึ่ง extends จาก Document ของ Next.js
export default class MyDocument extends Document {
  // เขียน static method getInitialProps เพื่อเป็นตัวจัดการ initial props ของ document
  static async getInitialProps(ctx) { 
    // สร้าง instance ของ ServerStyleSheet เพื่อเก็บสไตล์ที่เราต้องการใช้
    const sheet = new ServerStyleSheet();
    // เก็บค่า renderPage ต้นฉบับ
    const originalRenderPage = ctx.renderPage;

    try {
      // แก้ไข renderPage เพื่อรวบรวมสไตล์ของแอพพลิเคชัน
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      // เรียกใช้ getInitialProps ของ Document และเก็บ initial props ไว้
      const initialProps = await Document.getInitialProps(ctx);
      // รวม styles ที่เราเก็บไว้ใน ServerStyleSheet ไปด้วย initial props
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      // seal ServerStyleSheet เพื่อป้องกันการเปลี่ยนแปลงของสไตล์ในภายหลัง
      sheet.seal();
    }
  }

  // เขียนเมทอด render เพื่อกำหนดโครงสร้าง HTML ของ document
  render(): JSX.Element {
    return (
      <Html lang="pt"> {/* กำหนดภาษาหลักของเอกสารเป็น Portuguese */}
        <Head>
          {/* กำหนด metadata ต่างๆ เช่น charSet, theme-color, และ description */}
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#1A1B1D" />
          <meta name="description" content="A simple CRUD app using Next.js" />
          {/* ลิงค์ไปยัง font ที่เราต้องการใช้ */}
          <link
            href="https://fonts.googleapis.com/css?family=Ubuntu:400,500,700"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/* เรียกใช้ Main component เพื่อแสดงเนื้อหาหลักของแอพพลิเคชัน */}
          <Main />
          {/* เรียกใช้ NextScript เพื่อรวม script ที่เป็นส่วนหลังของเอกสาร */}
          <NextScript />
        </body>
      </Html>
    );
  }
}
