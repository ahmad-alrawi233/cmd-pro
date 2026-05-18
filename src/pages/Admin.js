import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

const BACKEND_URL = "https://cmd-backend-v7zo.onrender.com";

export default function Admin() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);

  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceText, setServiceText] = useState("");
  const [serviceIcon, setServiceIcon] = useState("");
  const [serviceEditId, setServiceEditId] = useState(null);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectImages, setProjectImages] = useState([]);
  const [projectVideo, setProjectVideo] = useState("");
  const [projectDemo, setProjectDemo] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [projectEditId, setProjectEditId] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [serviceUploading, setServiceUploading] = useState(false);

  const servicesRef = collection(db, "services");
  const projectsRef = collection(db, "projects");
  const messagesRef = collection(db, "messages");

  const getServices = async () => {
    const data = await getDocs(servicesRef);
    setServices(data.docs.map((item) => ({ ...item.data(), id: item.id })));
  };

  const getProjects = async () => {
    const data = await getDocs(projectsRef);
    setProjects(data.docs.map((item) => ({ ...item.data(), id: item.id })));
  };

  const getMessages = async () => {
    try {
      const q = query(messagesRef, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      setMessages(data.docs.map((item) => ({ ...item.data(), id: item.id })));
    } catch {
      const data = await getDocs(messagesRef);
      setMessages(data.docs.map((item) => ({ ...item.data(), id: item.id })));
    }
  };

  useEffect(() => {
    getServices();
    getProjects();
    getMessages();
  }, []);

  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch('${BACKEND_URL}/upload', {
      method: "POST",
      body: formData,
    });

    return await res.json();
  };

  const uploadMainProjectImage = async (file) => {
    if (!file) return alert("اختر صورة أولًا");

    setUploading(true);

    try {
      const data = await uploadToBackend(file);
      if (data.imageUrl) {
        setProjectImage(data.imageUrl);
        alert("تم رفع الصورة الرئيسية");
      } else {
        alert(data.details || data.error || "فشل رفع الصورة");
      }
    } catch {
      alert("فشل الاتصال مع السيرفر");
    }

    setUploading(false);
  };

  const uploadGalleryImages = async (files) => {
    if (!files || files.length === 0) return alert("اختر صورًا إضافية");

    setUploading(true);

    try {
      const uploaded = [];

      for (const file of files) {
        const data = await uploadToBackend(file);
        if (data.imageUrl) uploaded.push(data.imageUrl);
      }

      setProjectImages((prev) => [...prev, ...uploaded]);
      alert("تم رفع الصور الإضافية");
    } catch {
      alert("فشل رفع الصور الإضافية");
    }

    setUploading(false);
  };

  const uploadServiceIcon = async (file) => {
    if (!file) return alert("اختر صورة للأيقونة");

    setServiceUploading(true);

    try {
      const data = await uploadToBackend(file);
      if (data.imageUrl) {
        setServiceIcon(data.imageUrl);
        alert("تم رفع أيقونة الخدمة");
      } else {
        alert(data.details || data.error || "فشل رفع الأيقونة");
      }
    } catch {
      alert("فشل الاتصال مع السيرفر");
    }

    setServiceUploading(false);
  };

  const resetServiceForm = () => {
    setServiceTitle("");
    setServiceText("");
    setServiceIcon("");
    setServiceEditId(null);
  };

  const saveService = async () => {
    if (!serviceTitle || !serviceText || !serviceIcon) {
      alert("املأ جميع حقول الخدمة وارفع أيقونة");
      return;
    }

    const data = {
      title: serviceTitle,
      text: serviceText,
      icon: serviceIcon,
    };

    if (serviceEditId) {
      await updateDoc(doc(db, "services", serviceEditId), data);
    } else {
      await addDoc(servicesRef, data);
    }

    resetServiceForm();
    getServices();
  };

  const editService = (item) => {
    setServiceEditId(item.id);
    setServiceTitle(item.title || "");
    setServiceText(item.text || "");
    setServiceIcon(item.icon || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteService = async (id) => {
    if (!window.confirm("هل تريد حذف هذه الخدمة؟")) return;
    await deleteDoc(doc(db, "services", id));
    getServices();
  };

  const resetProjectForm = () => {
    setProjectTitle("");
    setProjectDescription("");
    setProjectImage("");
    setProjectImages([]);
    setProjectVideo("");
    setProjectDemo("");
    setProjectTech("");
    setProjectDuration("");
    setProjectEditId(null);
  };

  const saveProject = async () => {
    if (!projectTitle || !projectDescription || !projectImage) {
      alert("أدخل اسم المشروع والوصف والصورة الرئيسية");
      return;
    }

    const data = {
      title: projectTitle,
      description: projectDescription,
      image: projectImage,
      images: projectImages,
      video: projectVideo,
      demo: projectDemo,
      tech: projectTech,
      duration: projectDuration,
    };

    if (projectEditId) {
      await updateDoc(doc(db, "projects", projectEditId), data);
    } else {
      await addDoc(projectsRef, data);
    }

    resetProjectForm();
    getProjects();
  };

  const editProject = (item) => {
    setProjectEditId(item.id);
    setProjectTitle(item.title || "");
    setProjectDescription(item.description || "");
    setProjectImage(item.image || "");
    setProjectImages(item.images || []);
    setProjectVideo(item.video || "");
    setProjectDemo(item.demo || "");
    setProjectTech(item.tech || "");
    setProjectDuration(item.duration || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async (id) => {
    if (!window.confirm("هل تريد حذف هذا المشروع؟")) return;
    await deleteDoc(doc(db, "projects", id));
    getProjects();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("هل تريد حذف هذه الرسالة؟")) return;
    await deleteDoc(doc(db, "messages", id));
    getMessages();
  };

  const updateMessageStatus = async (id, status) => {
    await updateDoc(doc(db, "messages", id), { status });
    getMessages();
  };

  const cleanPhone = (phone) => {
    return String(phone || "")
      .replace("+", "")
      .replace(/\s/g, "")
      .replace(/-/g, "");
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const newMessages = messages.filter((m) => !m.status || m.status === "new").length;
  const contactedMessages = messages.filter((m) => m.status === "contacted").length;
  const doneMessages = messages.filter((m) => m.status === "done").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-yellow-400">لوحة التحكم</h1>
            <p className="text-slate-400 mt-2">
              إدارة الموقع، المشاريع، الخدمات ورسائل العملاء
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-bold"
          >
            تسجيل خروج
          </button>
        </header>

        <section className="grid md:grid-cols-4 gap-5 mb-10">
          <StatCard title="المشاريع" value={projects.length} />
          <StatCard title="الخدمات" value={services.length} />
          <StatCard title="رسائل العملاء" value={messages.length} />
          <StatCard title="رسائل جديدة" value={newMessages} />
        </section>

        <section className="grid md:grid-cols-3 gap-5 mb-10">
          <MiniCard title="جديد" value={newMessages} color="text-yellow-400" />
          <MiniCard title="تم التواصل" value={contactedMessages} color="text-blue-400" />
          <MiniCard title="مكتمل" value={doneMessages} color="text-green-400" />
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-5">
            {serviceEditId ? "تعديل خدمة" : "إضافة خدمة"}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="input"
              placeholder="اسم الخدمة"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
            />

            <input
              className="input"
              placeholder="وصف الخدمة"
              value={serviceText}
              onChange={(e) => setServiceText(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => uploadServiceIcon(e.target.files[0])}
            />
          </div>

          {serviceUploading && (
            <p className="text-yellow-400 mt-4">جاري رفع أيقونة الخدمة...</p>
          )}

          {serviceIcon && (
            <img
              src={serviceIcon}
              alt="service icon"
              className="mt-5 w-24 h-24 object-contain bg-white rounded-2xl p-3 border border-slate-700"
            />
          )}

          <div className="flex gap-3 mt-5">
            <button onClick={saveService} className="btn-yellow">
              {serviceEditId ? "حفظ التعديل" : "إضافة الخدمة"}
            </button>

            {serviceEditId && (
              <button onClick={resetServiceForm} className="btn-gray">
                إلغاء
              </button>
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-10">
          {services.map((item) => (
            <div key={item.id} className="card p-6">
              <img
                src={item.icon}
                alt={item.title}
                className="w-20 h-20 object-contain bg-white rounded-2xl p-3 mb-4 border border-slate-700"
              />

              <h3 className="text-xl font-black text-yellow-400">{item.title}</h3>
              <p className="text-slate-400 mt-3">{item.text}</p>

              <div className="flex gap-3 mt-5">
                <button onClick={() => editService(item)} className="btn-blue">
                  تعديل
                </button>
                <button onClick={() => deleteService(item.id)} className="btn-red">
                  حذف
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-5">
            {projectEditId ? "تعديل مشروع" : "إضافة مشروع"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="اسم المشروع"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => uploadMainProjectImage(e.target.files[0])}
            />

            <input
              type="file"
              accept="image/*"
              multiple
              className="input md:col-span-2"
              onChange={(e) => uploadGalleryImages(e.target.files)}
            />

            <textarea
              className="input md:col-span-2 min-h-28"
              placeholder="وصف المشروع"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />

            <input
              className="input"
              placeholder="التقنيات المستخدمة مثال: React, Firebase, Node.js"
              value={projectTech}
              onChange={(e) => setProjectTech(e.target.value)}
            />

            <input
              className="input"
              placeholder="مدة التنفيذ مثال: 7 أيام"
              value={projectDuration}
              onChange={(e) => setProjectDuration(e.target.value)}
            />

            <input
              className="input md:col-span-2"
              placeholder="رابط Live Demo اختياري"
              value={projectDemo}
              onChange={(e) => setProjectDemo(e.target.value)}
            />

            <input
              className="input md:col-span-2"
              placeholder="رابط فيديو اختياري"
              value={projectVideo}
              onChange={(e) => setProjectVideo(e.target.value)}
            />
          </div>

          {uploading && (
            <p className="text-yellow-400 mt-4">جاري رفع الصور...</p>
          )}

          {projectImage && (
            <div className="mt-5">
              <p className="text-slate-400 mb-2">الصورة الرئيسية</p>
              <img
                src={projectImage}
                alt="preview"
                className="w-full max-w-md h-56 object-cover rounded-2xl border border-slate-700"
              />
            </div>
          )}

          {projectImages.length > 0 && (
            <div className="mt-5">
              <p className="text-slate-400 mb-2">صور إضافية</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {projectImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="gallery"
                    className="h-24 w-full object-cover rounded-xl border border-slate-700"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <button
              onClick={saveProject}
              disabled={uploading}
              className="btn-yellow disabled:opacity-50"
            >
              {projectEditId ? "حفظ التعديل" : "إضافة المشروع"}
            </button>

            {projectEditId && (
              <button onClick={resetProjectForm} className="btn-gray">
                إلغاء
              </button>
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-10">
          {projects.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-52 object-cover" />

              <div className="p-5">
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="text-slate-400 mt-3">{item.description}</p>

                <div className="text-sm text-slate-400 mt-4 space-y-1">
                  {item.tech && <p>التقنيات: {item.tech}</p>}
                  {item.duration && <p>مدة التنفيذ: {item.duration}</p>}
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => editProject(item)} className="btn-blue">
                    تعديل
                  </button>
                  <button onClick={() => deleteProject(item.id)} className="btn-red">
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">رسائل العملاء</h2>

          {messages.length === 0 && (
            <p className="text-slate-400">لا توجد رسائل حاليًا.</p>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {messages.map((msg) => {
              const phone = cleanPhone(msg.phone || msg.mobile || msg.number);
              const status = msg.status || "new";

              return (
                <div
                  key={msg.id}
                  className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-yellow-400">
                      {msg.name || "عميل جديد"}
                    </h3>

                    <StatusBadge status={status} />
                  </div>

                  <p className="text-slate-300 mt-2">
                    الهاتف: {phone || "غير موجود"}
                  </p>

                  <p className="text-slate-300 mt-2">
                    نوع المشروع: {msg.type || msg.projectType || "غير محدد"}
                  </p>

                  <p className="text-slate-400 mt-4 leading-7">
                    {msg.message || msg.details || "لا توجد رسالة"}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <button
                      onClick={() => updateMessageStatus(msg.id, "new")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl py-2 font-bold"
                    >
                      جديد
                    </button>

                    <button
                      onClick={() => updateMessageStatus(msg.id, "contacted")}
                      className="bg-blue-500 hover:bg-blue-600 rounded-xl py-2 font-bold"
                    >
                      تم التواصل
                    </button>

                    <button
                      onClick={() => updateMessageStatus(msg.id, "done")}
                      className="bg-green-500 hover:bg-green-600 rounded-xl py-2 font-bold"
                    >
                      مكتمل
                    </button>
                  </div>

                  <div className="flex gap-3 mt-4">
                    {phone && (
                      <a
                        href={'https://api.whatsapp.com/send?phone=${phone}'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center bg-green-500 hover:bg-green-600 rounded-xl py-3 font-bold"
                      >
                        واتساب
                      </a>
                    )}

                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl py-3 font-bold"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <p className="text-slate-400">{title}</p>
      <h3 className="text-3xl font-black text-yellow-400 mt-2">{value}</h3>
    </div>
  );
}

function MiniCard({ title, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <p className="text-slate-400">{title}</p>
      <h3 className={'text-2xl font-black mt-2 ${color}'}>{value}</h3>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "done") {
    return (
      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
        مكتمل
      </span>
    );
  }

  if (status === "contacted") {
    return (
      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
        تم التواصل
      </span>
    );
  }

  return (
    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
      جديد
    </span>
  );
}