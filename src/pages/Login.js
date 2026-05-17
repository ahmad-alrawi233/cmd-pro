import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("اكتب البيانات");
      return;
    }

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);

      console.log("تم تسجيل الدخول:", user.user.email);

      // 🔥 التحويل الاحترافي
      navigate("/admin");

    } catch (error) {
      console.log(error);
      alert(error.code);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.box}>
        <h2 style={styles.title}>CMD Software</h2>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={login}>
          تسجيل الدخول
        </button>
      </div>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1a2f"
  },
  box: {
    background: "#102a4c",
    padding: "40px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center"
  },
  title: {
    color: "gold"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "none"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "gold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};