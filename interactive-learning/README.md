# SMP Interactive Tools Hub

หน้า index รวมเครื่องมือ HTML แบบ standalone (ฟิสิกส์ คณิตศาสตร์ ชีววิทยา TGAT2)
ทุกอย่างเป็น static ไม่มี backend สคริปต์ `build.mjs` สแกนโฟลเดอร์ `tools/` แล้ว
generate หน้า index ให้อัตโนมัติตอน build เพิ่มเครื่องมือใหม่แค่วางไฟล์แล้ว build ใหม่

## โครงสร้าง

```
smp-interactive-hub/
  tools/           ไฟล์ต้นฉบับ (ชื่อ slug สะอาด 1 ไฟล์ = 1 เครื่องมือ)
  meta.json        ชื่อไทย/วิชา/คำอธิบายของแต่ละเครื่องมือ + ลำดับวิชา
  build.mjs        ตัว generate: อ่าน tools/ + meta.json แล้วสร้าง dist/
  package.json     สคริปต์ build / preview
  vercel.json      ตั้งค่า Vercel (buildCommand + outputDirectory)
  dist/            ผลลัพธ์ (สร้างอัตโนมัติ, ไม่ต้อง commit)
```

## รันในเครื่อง

```bash
npm run build      # สร้าง dist/
npm run preview    # build แล้วเปิดเซิร์ฟเวอร์ดูที่ http://localhost:4321
```

หลัง build เปิด `dist/index.html` ตรงๆ ในเบราว์เซอร์ก็ได้

## เพิ่มเครื่องมือใหม่

1. วางไฟล์ `.html` ลงในโฟลเดอร์ `tools/` ตั้งชื่อเป็น slug ภาษาอังกฤษ ไม่มีเว้นวรรค
   เช่น `projectile-motion.html` (ห้ามใช้ชื่อ `index.html` เพราะชนกับหน้าแรก)
2. เพิ่มรายการใน `meta.json` ใต้ `tools` โดยใช้ชื่อไฟล์ (ไม่รวม `.html`) เป็น key:
   ```json
   "projectile-motion": {
     "name": "การเคลื่อนที่แบบโพรเจกไทล์",
     "en": "Projectile Motion",
     "subject": "ฟิสิกส์",
     "description": "คำอธิบายสั้นๆ ที่โชว์บนการ์ด"
   }
   ```
3. `npm run build` แล้ว deploy ใหม่ (ถ้าต่อ Git กับ Vercel ไว้ แค่ push ก็ deploy เอง)

หมายเหตุ: ถ้าไม่ใส่ใน `meta.json` สคริปต์จะ fallback ไปใช้ `<title>` ในไฟล์เอง
และเตือนใน log แต่จะจัดเข้าวิชา "อื่นๆ"

## Deploy ขึ้น Vercel

### วิธี A: ผ่าน Git (แนะนำ ทำครั้งเดียวแล้ว push เพื่อ deploy)

1. `git init && git add . && git commit -m "init"` แล้ว push ขึ้น GitHub
2. ที่ vercel.com กด Add New Project แล้วเลือก repo นี้
3. Vercel อ่าน `vercel.json` เอง (Build Command `node build.mjs`, Output `dist`)
   กด Deploy ได้เลย ไม่ต้องตั้งอะไรเพิ่ม

### วิธี B: ผ่าน Vercel CLI (deploy ตรงจากเครื่อง ไม่ต้องมี GitHub)

```bash
npm i -g vercel
vercel        # ครั้งแรก: ตอบคำถาม link project
vercel --prod # deploy ขึ้น production
```

## กติกาชื่อไฟล์ (สำคัญ)

ชื่อไฟล์กลายเป็น URL ให้ใช้ a-z, 0-9 และ `-` เท่านั้น เลี่ยงเว้นวรรค อักษรไทย
และวงเล็บ เพราะทำ URL เพี้ยนบน static host ชื่อไทยสำหรับโชว์ให้ไปใส่ใน `meta.json`
ไม่ใช่ในชื่อไฟล์

## Sanitize อัตโนมัติ

ตอน build ถ้าเจอ `<link rel="canonical">` ที่ยังชี้ไป `example.com` (placeholder)
สคริปต์จะลบให้และแจ้งใน log กันไม่ให้ค่า placeholder หลุดขึ้น production
