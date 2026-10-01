# شعبتي — Next.js + Prisma + SSE

## تشغيل محلي
    npm install
    npm run dev        # http://localhost:3000

## نشر حقيقي (Railway أو Render؛ يحتاج خادم Node دائم، لا Vercel بسبب SSE والمحاكي)
1. ارفع المجلد إلى GitHub.
2. Railway: New Project ← Deploy from GitHub. أضف Volume على /data
   وعيّن DATABASE_URL=file:/data/prod.db
3. Build: npm run build — Start: npm start
4. لبيانات الجامعة الحقيقية: SIMULATE=false وغذِّ جدول Section من نظام التسجيل.

## للتوسع
غيّر provider في prisma/schema.prisma إلى postgresql وDATABASE_URL إلى Neon أو Supabase.
