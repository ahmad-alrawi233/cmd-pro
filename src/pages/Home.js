import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import gsap from "gsap";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "",
    message: "",
  });

  const [settings, setSettings] = useState({
    siteName: "CMD Software",
    heroTitle: "نبني لك نظامًا رقميًا يبيع ويكبر معك",
    heroText:
      "مواقع احترافية، تطبيقات، صفحات هبوط، ولوحات تحكم مصممة لجلب العملاء وتحويل الزوار إلى مبيعات.",
  });

  const whatsappLink = "https://api.whatsapp.com/send?phone=963982181098";
  const instagramLink = "https://instagram.com/cmd.software";
  const facebookLink = "https://facebook.com/cmd.software";

  useEffect(() => {
    const getProjects = async () => {
      const data = await getDocs(collection(db, "projects"));
      setProjects(data.docs.map((item) => ({ ...item.data(), id: item.id })));
    };

    const getServices = async () => {
      const data = await getDocs(collection(db, "services"));
      setServices(data.docs.map((item) => ({ ...item.data(), id: item.id })));
    };

    const getSettings = async () => {
      const snap = await getDoc(doc(db, "settings", "site"));
      if (snap.exists()) {
        setSettings((prev) => ({ ...prev, ...snap.data() }));
      }
    };

    getProjects();
    getServices();
    getSettings();

    gsap.fromTo(
      ".hero-content",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );

    gsap.fromTo(
      ".hero-card",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
    );

    const timer = setTimeout(() => {
      const sections = document.querySelectorAll(".reveal");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show-section");
            }
          });
        },
        { threshold: 0.15 }
      );

      sections.forEach((section) => observer.observe(section));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const choosePackage = (packageName) => {
    setForm((prev) => ({ ...prev, type: packageName }));
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async () => {
    if (!form.name || !form.phone || !form.message) {
      alert("اكتب الاسم ورقم الهاتف والرسالة");
      return;
    }

    await addDoc(collection(db, "messages"), {
      ...form,
      createdAt: new Date(),
    });

    alert("تم إرسال رسالتك بنجاح");
    setForm({ name: "", phone: "", type: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden" dir="rtl">
      <div className="fixed top-0 right-0 w-96 h-96 bg-yellow-400/20 blur-3xl rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>

      <nav className="fixed top-0 right-0 left-0 z-50 bg-[#050816]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="CMD Software"
              className="w-12 h-12 object-contain mix-blend-screen"
            />
            <span className="text-2xl font-black text-yellow-400">
              {settings.siteName}
            </span>
          </a>

          <div className="hidden md:flex gap-8 text-sm text-slate-300">
            <a href="#about" className="hover:text-yellow-400 transition">من نحن</a>
            <a href="#services" className="hover:text-yellow-400 transition">الخدمات</a>
            <a href="#solutions" className="hover:text-yellow-400 transition">الحلول</a>
            <a href="#projects" className="hover:text-yellow-400 transition">الأعمال</a>
            <a href="#faq" className="hover:text-yellow-400 transition">الأسئلة</a>
            <a href="#contact" className="hover:text-yellow-400 transition">تواصل</a>
          </div>

          <a href={whatsappLink} className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold hover:bg-yellow-300 transition">
            ابدأ الآن
          </a>
        </div>
      </nav>

      <section id="home" className="relative pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="hero-content opacity-100">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-yellow-300 mb-6">
              🚀 حلول رقمية للشركات الطموحة
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              {settings.heroTitle}
            </h2>

            <p className="text-slate-400 text-lg leading-8 mt-6 max-w-xl">
              {settings.heroText}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-9">
              <a href="#contact" className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black text-center hover:bg-yellow-300 transition">
                احصل على استشارة مجانية
              </a>

              <a href="#projects" className="border border-white/15 px-8 py-4 rounded-2xl font-bold text-center hover:border-yellow-400 transition">
                شاهد الأعمال
              </a>
            </div>
          </div>

          <div className="hero-card opacity-100 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <div className="bg-[#0b1024] rounded-[1.5rem] p-6">
              <div className="flex justify-center mb-6">
                <img
                  src="/logo.png"
                  alt="CMD Software"
                  className="w-36 h-36 object-contain mix-blend-screen"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Stat number="+50" text="مشروع منجز" />
                <Stat number="+30" text="عميل سعيد" />
                <Stat number="98%" text="رضا العملاء" />
                <Stat number="24/7" text="دعم ومتابعة" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="reveal relative py-24 px-6 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle
              title="من نحن؟"
              text="CMD Software شركة برمجيات تساعد أصحاب الأعمال على بناء حضور رقمي قوي وتحويل الأفكار إلى أنظمة قابلة للنمو."
            />

            <p className="text-slate-300 leading-8 text-lg mt-8">
              نؤمن أن الموقع أو التطبيق ليس مجرد تصميم جميل، بل أداة مبيعات ونمو.
              لذلك نركز على السرعة، وضوح تجربة المستخدم، سهولة الإدارة، وربط المشروع بأهداف العمل.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-3xl font-black text-yellow-400 mb-6">
              لماذا CMD Software؟
            </h3>

            <div className="grid gap-4">
              <Why text="تصميم احترافي يعكس هوية شركتك" />
              <Why text="لوحات تحكم سهلة لإدارة المحتوى" />
              <Why text="رفع صور ومشاريع ورسائل عملاء بشكل حقيقي" />
              <Why text="حلول قابلة للتطوير مستقبلًا" />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="reveal relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="خدمات بمستوى الشركات"
            text="كل ما تحتاجه لإطلاق مشروعك الرقمي من فكرة إلى منتج جاهز"
          />

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {services.map((service) => (
              <Service
                key={service.id}
                title={service.title}
                text={service.text}
                icon={service.icon}
              />
            ))}
          </div>

          {services.length === 0 && (
            <p className="text-center text-slate-400 mt-10">
              لا توجد خدمات بعد. أضف الخدمات من لوحة التحكم.
            </p>
          )}
        </div>
      </section>

      <section id="solutions" className="reveal relative py-24 px-6 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="حلول تناسب مشروعك"
            text="بدل الأسعار الثابتة، نختار الحل المناسب حسب حجم مشروعك وهدفك"
          />

          <div className="grid md:grid-cols-3 gap-7 mt-14">
            <PricingCard
              title="Starter"
              price="موقع تعريفي"
              onChoose={() => choosePackage("حل Starter - موقع تعريفي")}
              features={[
                "صفحة رئيسية احترافية",
                "تصميم متجاوب",
                "زر واتساب",
                "نموذج تواصل",
                "تسليم سريع",
              ]}
            />

            <PricingCard
              title="Business"
              price="موقع + لوحة تحكم"
              active
              onChoose={() => choosePackage("حل Business - موقع + لوحة تحكم")}
              features={[
                "كل مزايا Starter",
                "لوحة تحكم لإدارة المحتوى",
                "إدارة مشاريع وخدمات",
                "رفع صور",
                "رسائل عملاء",
              ]}
            />

            <PricingCard
              title="Pro"
              price="نظام مخصص"
              onChoose={() => choosePackage("حل Pro - نظام مخصص")}
              features={[
                "تحليل كامل للمشروع",
                "Backend مخصص",
                "صلاحيات مستخدمين",
                "تكاملات خارجية",
                "دعم وتطوير مستمر",
              ]}
            />
          </div>
        </div>
      </section>

      <section id="projects" className="reveal relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="أعمالنا"
            text="اضغط على أي مشروع لمشاهدة التفاصيل والصور"
          />

          <div className="grid md:grid-cols-3 gap-7 mt-14">
            {projects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProjectIndex(index);
                  setSelectedImageIndex(0);
                }}
                className="group cursor-pointer bg-white/10 border border-white/10 rounded-[2rem] overflow-hidden hover:-translate-y-2 transition duration-300"
              >
                <img src={project.image} alt={project.title} className="w-full h-60 object-cover group-hover:scale-105 transition duration-500" />

                <div className="p-6">
                  <h3 className="text-2xl font-black">{project.title}</h3>
                  <p className="text-slate-400 mt-3 leading-7 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-5 text-yellow-400 font-bold">
                    مشاهدة التفاصيل ←
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="text-center text-slate-400 mt-12">
              لا توجد مشاريع بعد. أضفها من لوحة التحكم.
            </p>
          )}
        </div>
      </section>

      <section id="process" className="reveal relative py-24 px-6 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="طريقة العمل"
            text="نحوّل فكرتك إلى منتج واضح بخطوات منظمة"
          />

          <div className="grid md:grid-cols-4 gap-5 mt-14">
            <Step num="01" title="تحليل الفكرة" />
            <Step num="02" title="تصميم الواجهة" />
            <Step num="03" title="تطوير النظام" />
            <Step num="04" title="الإطلاق والمتابعة" />
          </div>
        </div>
      </section>

      <section id="faq" className="reveal relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            title="أسئلة شائعة"
            text="إجابات سريعة على أكثر الأسئلة التي يسألها العملاء"
          />

          <div className="grid gap-5 mt-14">
            <FAQ q="كم مدة تنفيذ الموقع؟" a="حسب حجم المشروع، لكن الموقع التعريفي عادة يحتاج من 3 إلى 7 أيام." />
            <FAQ q="هل الموقع يعمل على الجوال؟" a="نعم، جميع المواقع تكون متجاوبة مع الجوال والتابلت والكمبيوتر." />
            <FAQ q="هل أستطيع تعديل المحتوى لاحقًا؟" a="نعم، يمكن إدارة الخدمات والمشاريع والرسائل من لوحة التحكم." />
            <FAQ q="هل يوجد دعم بعد التسليم؟" a="نعم، يمكن الاتفاق على دعم شهري أو تعديلات حسب الحاجة." />
          </div>
        </div>
      </section>

      <section id="contact" className="reveal relative py-28 px-6 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              جاهز تبني مشروعك؟
            </h2>

            <p className="text-slate-400 mt-5 text-lg leading-8">
              أرسل لنا تفاصيل مشروعك، وسنتواصل معك لمساعدتك في اختيار الحل المناسب.
            </p>

            <a href={whatsappLink} className="inline-block mt-8 bg-yellow-400 text-black px-9 py-4 rounded-2xl font-black hover:bg-yellow-300 transition">
              تواصل عبر واتساب
            </a>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-[2rem] p-7">
            <h3 className="text-2xl font-black mb-5">طلب استشارة</h3>

            <div className="grid gap-4">
              <input className="bg-white/10 border border-white/10 rounded-xl p-4 outline-none focus:border-yellow-400" placeholder="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="bg-white/10 border border-white/10 rounded-xl p-4 outline-none focus:border-yellow-400" placeholder="رقم الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="bg-white/10 border border-white/10 rounded-xl p-4 outline-none focus:border-yellow-400" placeholder="نوع المشروع" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              <textarea className="bg-white/10 border border-white/10 rounded-xl p-4 outline-none focus:border-yellow-400 min-h-32" placeholder="رسالتك" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

              <button onClick={sendMessage} className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black hover:bg-yellow-300 transition">
                إرسال الطلب
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer
        whatsappLink={whatsappLink}
        instagramLink={instagramLink}
        facebookLink={facebookLink}
      />

      <a href={whatsappLink} className="fixed bottom-6 left-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition">
        💬
      </a>

      {selectedProjectIndex !== null && projects[selectedProjectIndex] && (
        <ProjectModal
          projects={projects}
          selectedProjectIndex={selectedProjectIndex}
          setSelectedProjectIndex={setSelectedProjectIndex}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          whatsappLink={whatsappLink}
        />
      )}
    </div>
  );
}

function Stat({ number, text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h3 className="text-4xl font-black text-yellow-400">{number}</h3>
      <p className="text-slate-400 mt-2">{text}</p>
    </div>
  );
}

function SectionTitle({ title, text }) {
  return (
    <div className="text-center">
      <h2 className="text-4xl md:text-5xl font-black">{title}</h2>
      <p className="text-slate-400 mt-4 text-lg">{text}</p>
    </div>
  );
}

function Why({ text }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">
      <span className="text-yellow-400 font-black">✓</span>
      <p className="text-slate-300">{text}</p>
    </div>
  );
}

function Service({ title, text, icon }) {
  return (
    <div className="relative group bg-white/10 border border-white/10 rounded-[2rem] p-8 hover:border-yellow-400 transition duration-300 overflow-hidden">
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl group-hover:bg-yellow-400/20 transition"></div>

      <div className="relative flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-[2rem] bg-white shadow-2xl p-4 flex items-center justify-center mb-7 group-hover:scale-110 transition duration-300">
          {icon ? (
            <img src={icon} alt={title} className="w-full h-full object-contain" />
          ) : (
            <span className="text-5xl">⚙️</span>
          )}
        </div>

        <h3 className="text-2xl font-black text-yellow-400">{title}</h3>
        <p className="text-slate-300 mt-4 leading-8 text-lg">{text}</p>
      </div>
    </div>
  );
}

function PricingCard({ title, price, features, active, onChoose }) {
  const cardClass = active
    ? "rounded-[2rem] p-8 border transition duration-300 bg-yellow-400 text-black border-yellow-400 scale-105 shadow-2xl"
    : "rounded-[2rem] p-8 border transition duration-300 bg-white/10 text-white border-white/10 hover:border-yellow-400";

  const priceClass = active
    ? "mt-4 text-xl font-bold text-black"
    : "mt-4 text-xl font-bold text-yellow-400";

  const buttonClass = active
    ? "w-full text-center mt-8 rounded-2xl py-4 font-black transition bg-black text-white hover:bg-slate-900"
    : "w-full text-center mt-8 rounded-2xl py-4 font-black transition bg-yellow-400 text-black hover:bg-yellow-300";

  return (
    <div className={cardClass}>
      <h3 className="text-3xl font-black">{title}</h3>
      <p className={priceClass}>{price}</p>

      <ul className="mt-8 space-y-4">
        {features.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span>{active ? "●" : "✓"}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <button onClick={onChoose} className={buttonClass}>
        اطلب هذا الحل
      </button>
    </div>
  );
}

function FAQ({ q, a }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-black text-yellow-400">{q}</h3>
      <p className="text-slate-300 mt-3 leading-7">{a}</p>
    </div>
  );
}

function Step({ num, title }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-[2rem] p-7 text-center">
      <div className="text-yellow-400 text-3xl font-black">{num}</div>
      <h3 className="text-2xl font-bold mt-4">{title}</h3>
    </div>
  );
}

function Footer({ whatsappLink, instagramLink, facebookLink }) {
  return (
    <footer className="relative border-t border-white/10 bg-[#030712] px-6 py-14">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CMD Software" className="w-14 h-14 object-contain mix-blend-screen" />
            <h3 className="text-3xl font-black text-yellow-400">CMD Software</h3>
          </div>

          <p className="text-slate-400 leading-8 mt-5 max-w-xl">
            نبني مواقع، تطبيقات، ولوحات تحكم تساعد الشركات على النمو وتحويل الأفكار إلى منتجات رقمية حقيقية.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-black mb-5">روابط سريعة</h4>
          <div className="grid gap-3 text-slate-400">
            <a href="#about" className="hover:text-yellow-400">من نحن</a>
            <a href="#services" className="hover:text-yellow-400">الخدمات</a>
            <a href="#solutions" className="hover:text-yellow-400">الحلول</a>
            <a href="#projects" className="hover:text-yellow-400">الأعمال</a>
            <a href="#contact" className="hover:text-yellow-400">تواصل</a>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-black mb-5">تواصل معنا</h4>
          <div className="grid gap-3 text-slate-400">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="hover:text-yellow-400">WhatsApp</a>
            <a href={instagramLink} target="_blank" rel="noreferrer" className="hover:text-yellow-400">Instagram: cmd.software</a>
            <a href={facebookLink} target="_blank" rel="noreferrer" className="hover:text-yellow-400">Facebook: cmd.software</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-white/10 text-center text-slate-500">
        CMD Software © 2026 — Creativity, Mastery, Development
      </div>
    </footer>
  );
}

function ProjectModal({
  projects,
  selectedProjectIndex,
  setSelectedProjectIndex,
  selectedImageIndex,
  setSelectedImageIndex,
  whatsappLink,
}) {
  const project = projects[selectedProjectIndex];
  const allImages = [project.image, ...(project.images || [])].filter(Boolean);
  const currentImage = allImages[selectedImageIndex] || project.image;

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur flex items-center justify-center p-4" onClick={() => setSelectedProjectIndex(null)}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[#0b1024] border border-white/10 rounded-[2rem] max-w-6xl w-full overflow-hidden relative max-h-[95vh] overflow-y-auto">
        <button onClick={() => setSelectedProjectIndex(null)} className="absolute top-4 left-4 bg-red-500 text-white w-10 h-10 rounded-full font-bold z-10">
          ×
        </button>

        <img src={currentImage} alt={project.title} className="w-full h-96 object-cover" />

        {allImages.length > 1 && (
          <div className="grid grid-cols-5 md:grid-cols-8 gap-3 p-4 bg-black/30">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="project"
                onClick={() => setSelectedImageIndex(i)}
                className={`h-20 w-full object-cover rounded-xl cursor-pointer border ${
                  selectedImageIndex === i ? "border-yellow-400" : "border-white/10"
                }`}
              />
            ))}
          </div>
        )}

        <div className="p-8">
          <h2 className="text-4xl font-black text-yellow-400">{project.title}</h2>
          <p className="text-slate-300 mt-5 leading-8 text-lg">{project.description}</p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {project.tech && (
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-yellow-400 font-bold">التقنيات المستخدمة</p>
                <p className="text-slate-300 mt-2">{project.tech}</p>
              </div>
            )}

            {project.duration && (
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-yellow-400 font-bold">مدة التنفيذ</p>
                <p className="text-slate-300 mt-2">{project.duration}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black hover:bg-yellow-300">
                مشاهدة الموقع
              </a>
            )}

            {project.video && (
              <a href={project.video} target="_blank" rel="noreferrer" className="bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-bold hover:border-yellow-400">
                مشاهدة الفيديو
              </a>
            )}

            <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-6 py-3 rounded-xl font-black hover:bg-green-600">
              أريد مشروع مشابه
            </a>
          </div>
        </div>

        {projects.length > 1 && (
          <>
            <button
              onClick={() => {
                setSelectedProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
                setSelectedImageIndex(0);
              }}
              className="absolute top-1/2 left-4 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl text-3xl"
            >
              ‹
            </button>

            <button
              onClick={() => {
                setSelectedProjectIndex((prev) => (prev + 1) % projects.length);
                setSelectedImageIndex(0);
              }}
              className="absolute top-1/2 right-4 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl text-3xl"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}