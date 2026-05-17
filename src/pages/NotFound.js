export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6" dir="rtl">
      <div className="text-center">
        <h1 className="text-8xl font-black text-yellow-400">404</h1>

        <h2 className="text-3xl font-bold mt-6">
          الصفحة غير موجودة
        </h2>

        <p className="text-slate-400 mt-4">
          الرابط الذي دخلته غير صحيح.
        </p>

        <a
          href="/"
          className="inline-block mt-8 bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black hover:bg-yellow-300"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
  
}