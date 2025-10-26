# 🔧 حل مشكلة "Error connecting to database" على Render

## المشكلة:
```
message: "Error connecting to database": 400
fetch failed
```

---

## ✅ الحل (خطوة بخطوة):

### 1️⃣ **تحقق من Environment Variables**

افتح Render Dashboard → Web Service الخاص بك → **Environment** Tab

**تأكد أن هذه الـ Variables موجودة:**

```
DATABASE_URL=postgres://user:password@host/database?sslmode=require
SESSION_SECRET=any-random-long-string-here
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHI...
TELEGRAM_CHAT_ID=123456789
NODE_ENV=production
```

⚠️ **مهم جداً:** `DATABASE_URL` يجب أن يكون **Internal Database URL** من Render PostgreSQL

---

### 2️⃣ **احصل على الـ Internal Database URL**

1. اذهب إلى Render Dashboard
2. اذهب إلى **PostgreSQL Database** الذي أنشأته
3. في صفحة Database، اضغط على **"Connect"**
4. **انسخ "Internal Database URL"** (ليس External!)
5. الصق هذا الرابط في `DATABASE_URL` في Environment Variables للـ Web Service

**مثال على Internal Database URL:**
```
postgresql://shamcash_user:xyz123@dpg-abc123xyz-a/shamcash_db
```

---

### 3️⃣ **أنشئ الـ Tables في قاعدة البيانات**

بعد إضافة `DATABASE_URL` الصحيح:

1. اذهب إلى Web Service → **Shell** Tab
2. نفذ الأوامر التالية:

```bash
# تثبيت الحزم أولاً
npm install

# إنشاء Tables في قاعدة البيانات
npm run db:push

# إذا ظهر تحذير "data loss"، استخدم:
npm run db:push -- --force

# إنشاء حسابات الأدمن
npx tsx server/seed.ts
```

---

### 4️⃣ **أعد تشغيل التطبيق**

1. اذهب إلى **Settings** Tab
2. اضغط **"Manual Deploy"** → **"Deploy latest commit"**
3. انتظر حتى ينتهي الـ Build
4. افتح الموقع

---

## ✨ بعد هذه الخطوات:

الموقع **سيعمل** وستظهر صفحة تسجيل الدخول بدون أخطاء! 

---

## 🔍 للتحقق من نجاح الحل:

1. افتح الموقع من الرابط الذي أعطاك Render
2. يجب أن تظهر صفحة تسجيل الدخول **بدون خطأ**
3. جرب تسجيل دخول بأي بيانات
4. يجب أن تنتقل إلى صفحة SMS

---

## ❌ إذا استمرت المشكلة:

### تحقق من Logs:
1. Web Service → **Logs** Tab
2. ابحث عن أخطاء مثل:
   - `DATABASE_URL is not set`
   - `Connection refused`
   - `SSL error`

### الحلول:
- **إذا كان الخطأ `DATABASE_URL is not set`:**
  → تأكد أنك أضفت `DATABASE_URL` في Environment Variables

- **إذا كان الخطأ `Connection refused`:**
  → تأكد أنك استخدمت **Internal** Database URL وليس External

- **إذا كان الخطأ `SSL error`:**
  → أضف `?sslmode=require` في نهاية DATABASE_URL

---

## 📝 ملاحظات مهمة:

1. **استخدم Internal Database URL دائماً** (يبدأ بـ `postgresql://` بدون رقم port)
2. **لا تنسى `npm run db:push`** - هذا ينشئ الـ Tables
3. **Environment Variables تحتاج Redeploy** - بعد تغيير أي variable، اعمل Manual Deploy
