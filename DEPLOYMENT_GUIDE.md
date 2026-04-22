# 🚀 Netlify Deployment Guide

## ✅ สถานะปัจจุบัน
- Git Repository: ✅ Connected to GitHub
- netlify.toml: ✅ Created with correct settings
- Publish directory: ✅ Set to `www`

## 📋 ขั้นตอนตั้งค่า Netlify (ทำให้เสร็จ)

### 1. รอให้ Deploy เสร็จ
- ดู Deploy log ให้ "Site is live" แล้ว
- รอให้ Post-processing Complete

### 2. เข้าไปที่ Netlify Dashboard
- URL: https://app.netlify.com/
- เลือก Project: `tranquil-melba-77872b` (หรือชื่อที่ระบบให้)

### 3. ไปที่ Site Settings
- Click **Site settings** (หรือ **Deploy settings**)
- หรือไปที่ **Deploys** → **Deploy settings**

### 4. ตั้งค่า Build & Deploy
**กรณีถ้าเปลี่ยน settings ด้วยตนเอง:**
- **Build command**: เว้นว่าง (หรือไม่ต้องเขียนอะไร)
- **Publish directory**: `www`
- Click **Save**

**แต่ถ้าไม่เห็น field เหล่านี้** → ไม่เป็นไร! เพราะผม set ใน `netlify.toml` แล้ว ✅

### 5. Trigger Redeploy (ถ้าต้อง)
- ไปที่ **Deploys** tab
- Click **Trigger deploy** → **Deploy site**

---

## 🎮 ทดลองเกม
หลังจาก Deploy เสร็จ:
1. เข้า URL ของเกม (Netlify จะให้ URL)
2. เกมควรโหลด index.html จาก www/ folder
3. ลองเล่นเกมดู

---

## 📌 ถ้าเกิด Error
**ถ้าเห็น "Page not found" หรือ "404":**
- ตรวจสอบว่า `www/index.html` มีอยู่จริง ✅
- ตรวจสอบ netlify.toml มี `publish = "www"` ✅

**ถ้า Deploy ล้มเหลว:**
- ลองกด "Trigger deploy" อีกครั้ง
- หรือ Push code ใหม่ไป GitHub (Netlify จะ deploy ใหม่อัตโนมัติ)

---

## 🔄 Deploy อัตโนมัติ
ทุกครั้งที่คุณ:
```bash
git push origin main
```
→ Netlify จะ **deploy ใหม่อัตโนมัติ** ✨

---

**ต้องความช่วยเหลือ ติดตามไว้ครับ!** 👍
