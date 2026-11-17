# 🚀 WorkFlow Agency - Localhost & Render Deployment Guide

यह प्रोजेक्ट एक फुल-स्टैक एजेंसी वर्कफ़्लो प्लेटफ़ॉर्म है जहाँ:
1. **Client**: वेबसाइट फ़्रंटएंड, बैकएंड, रेंडर डिप्लॉयमेंट, कस्टम डोमेन, इंस्टाग्राम रील्स और प्रमोशन जैसे काम बजट (₹) के साथ दे सकता है।
2. **Worker Panel**: कर्मचारियों को काम दिखता है, वे काम की स्थिति अपडेट कर सकते हैं और फ़ाइनल लिंक सबमिट कर सकते हैं।
3. **Admin Panel**: आप (मालिक) सब कुछ देख सकते हैं—क्लाइंट कौन है, उसे क्या चाहिए, कितने रुपये का काम है, और किस वर्कर को असाइन करना है।
4. **Email OTP Auth**: ईमेल पर 6-डिजिट OTP से सुरक्षित लॉगिन।

---

## 💻 1. Localhost पर तुरंत कैसे चलाएं (How to Run Locally)

### Step 1: Dependencies Install (अगर पहले से नहीं की)
```bash
npm install
```

### Step 2: Database Seed (Demo Data Load करना)
```bash
npm run seed
```
इससे SQLite डेटाबेस में एडमिन, डेमो क्लाइंट्स, डेमो वर्कर्स और 6 रियलिस्टिक प्रोजेक्ट्स लोड हो जाएंगे।

### Step 3: Server Start करें
```bash
npm start
```
या फ़ाइल ऑटो-रिलोड के साथ:
```bash
npm run dev
```

### Step 4: Browser में ओपन करें (3 अलग-अलग पोर्टल्स)
- 🌐 **मुख्य एजेंसी हब (Main Hub)**: 👉 **[http://localhost:5000](http://localhost:5000)**
- 💼 **क्लाइंट पोर्टल (Client Portal)**: 👉 **[http://localhost:5000/client](http://localhost:5000/client)**
- 🛠️ **वर्कर डेस्क (Worker Desk)**: 👉 **[http://localhost:5000/worker](http://localhost:5000/worker)**
- 👑 **एडमिन कमांड सेंटर (Admin Headquarters)**: 👉 **[http://localhost:5000/admin](http://localhost:5000/admin)**

---

## 🔑 2. तीनों अलग-अलग पोर्टल्स को कैसे उपयोग करें

1. **💼 Client Portal (`/client`)**:
   - सिर्फ काम देने वाले ग्राहकों के लिए।
   - यहाँ से क्लाइंट नया काम सबमिट करता है:
     - Website Frontend (React, Vue, Tailwind)
     - Website Backend (Node.js, Express, DB)
     - Render Live Deployment
     - Custom Domain & SSL Setup
     - Instagram & YouTube Reels Editing
     - Instagram Growth & Ads
   - बजट (₹) और डेडलाइन डालकर सबमिट करें।
   - 5-स्टेप विजुअल माइलस्टोन प्रोग्रेस बार से लाइव स्थिति और वर्कर के लिंक्स देखें।

2. **🛠️ Worker Desk (`/worker`)**:
   - सिर्फ काम करने वाले डेवलपर्स और वीडियो एडिटर्स के लिए।
   - यहाँ वर्कर को एडमिन द्वारा सौंपा गया काम, क्लाइंट की पूरी रिक्वायरमेंट और डेडलाइन दिखती है।
   - वर्कर काम की स्थिति बदल सकता है (`In Progress`, `Under Review`, `Completed`) और Google Drive / GitHub / Render का लाइव लिंक सबमिट कर सकता है।

3. **👑 Admin Headquarters (`/admin`)**:
   - सिर्फ एजेंसी के मालिक (आपके) लिए।
   - पूरे बिजनेस की कुल कमाई (₹ Total Pipeline Volume)।
   - सारे क्लाइंट्स की लिस्ट, उन्हें क्या काम चाहिए, और कितने रुपये का काम है।
   - **1-क्लिक डायरेक्ट ईमेल बटन** क्लाइंट से सीधे संपर्क करने के लिए।
   - ड्रॉपडाउन से किसी भी वर्कर को काम सौंपना (Assign / Reassign)।
   - यूजर डायरेक्टरी और एक्टिविटी ऑडिट स्ट्रीम।

> 💡 **नोट**: Localhost पर जब भी आप OTP मंगाएंगे, वह आपके टर्मिनल (कंसोल) में प्रिंट होगा और स्क्रीन पर भी "Click to Paste" का बटन आ जाएगा ताकि आपको ईमेल खोलने की भी ज़रूरत न पड़े!

---

## 🌐 3. बाद में Render पर Live कैसे करें (How to Deploy to Render)

जब आप इसे इंटरनेट पर लाइव करना चाहें, यह 100% रेंडर रेडी है:

### तरीका 1: Render GitHub Auto-Deploy (Recommended)
1. अपने इस प्रोजेक्ट फ़ोल्डर को GitHub रिपॉज़िटरी में पुश करें:
   ```bash
   git init
   git add .
   git commit -m "Agency Workflow Hub full release"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. **[https://dashboard.render.com](https://dashboard.render.com)** पर जाएं।
3. **New +** &rarr; **Web Service** चुनें।
4. अपनी GitHub रिपॉजिटरी सिलेक्ट करें।
5. सेटिंग्स भरें:
   - **Name**: `agency-workflow-hub`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. **Environment Variables** में ये जोड़ें:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `(Generate Any 32-character Random Secret)`
   - `ADMIN_EMAIL` = `आपका_ईमेल@domain.com`
   - `ADMIN_NAME` = `आपका नाम`
   *(अगर असली ईमेल पर OTP भेजना है, तो Gmail App Password या Brevo/SendGrid के SMTP क्रेडेंशियल्स डाल दें, जैसे `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=...`, `SMTP_PASS=...`)*
7. **Deploy Web Service** पर क्लिक करें! 2 मिनट में आपकी वेबसाइट लाइव हो जाएगी (`https://your-service.onrender.com`)!

---

## 🛠️ प्रोजेक्ट फ़ाइल स्ट्रक्चर (Clean & Modular)
```
clint server/
├── data/
│   └── agency.db            # SQLite डेटाबेस (Built-in node:sqlite, zero dependency)
├── public/
│   ├── css/
│   │   └── style.css        # मॉडर्न UI स्टाइलिंग और एनिमेशन्स
│   ├── js/
│   │   └── app.js           # फ़्रंटएंड स्टेट, OTP लॉजिक, क्लाइंट/वर्कर/एडमिन पैनल्स
│   └── index.html           # रिस्पॉन्सिव, डार्क-थीम सिंगल पेज एप्लिकेशन
├── src/
│   ├── config/
│   │   └── db.js            # डेटाबेस इनिशियलाइज़ेशन, टेबल्स, इंडेक्स, डिफ़ॉल्ट एडमिन
│   ├── controllers/
│   │   ├── authController.js   # Email OTP जेनरेशन, वेरिफिकेशन, JWT
│   │   ├── taskController.js   # क्लाइंट का काम बनाना, वर्कर का प्रोग्रेस अपडेट
│   │   └── adminController.js  # मालिक के लिए KPI, रेवेन्यू, वर्कर असाइनमेंट, यूजर्स
│   ├── middleware/
│   │   └── auth.js          # JWT ऑथेंटिकेशन और रोल-बेस्ड परमिशन चेक्स
│   ├── routes/
│   │   ├── authRoutes.js    # /api/auth
│   │   ├── taskRoutes.js    # /api/tasks
│   │   └── adminRoutes.js   # /api/admin
│   ├── utils/
│   │   └── mailer.js        # Nodemailer OTP टेम्पलेट + लोकल कंसोल फ़ॉलबैक
│   ├── seed.js              # डेमो डेटा लोडर
│   └── server.js            # Express 5 सर्वर एंट्रीपॉइंट
├── test/
│   └── api-test.js          # 10-स्टेप ऑटोमेटेड एंड-टू-एंड टेस्ट सूट
├── .env                     # एनवायरनमेंट वैरिएबल्स
├── .env.example
├── package.json
├── render.yaml              # रेंडर का 1-क्लिक डिप्लॉय कॉन्फ़िगरेशन
└── PLAN.md
```
