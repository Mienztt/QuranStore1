import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsYPtUMbC2vFPGNNSyEST_27QuHn1aS0o",
  authDomain: "login-fff1e.firebaseapp.com",
  projectId: "login-fff1e",
  storageBucket: "login-fff1e.appspot.com",
  messagingSenderId: "961683942394",
  appId: "1:961683942394:web:142dbcae9708918ed2d243",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("registerForm");

const fields = {
  nama: {
    validate: (val) => /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(val),
    message: "Nama harus diawali huruf besar dan hanya huruf/spasi.",
  },
  username: {
    validate: (val) => /^[a-z0-9]{3,20}$/.test(val),
    message: "Username hanya huruf kecil/angka (3-20 karakter).",
  },
  email: {
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    message: "Email tidak valid.",
  },
  whatsapp: {
    validate: (val) => /^62\d{9,12}$/.test(val),
    message: "Nomor WhatsApp harus diawali 62 dan panjang 11-14 digit.",
    preformat: (val) => {
      if (val.startsWith("08")) return "62" + val.slice(1);
      return val;
    },
  },
  password: {
    validate: (val) =>
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,20}/.test(val),
    message:
      "Password harus kuat (huruf besar, kecil, angka, simbol, 6-20 karakter).",
  },
  role: {
    validate: (val) => val !== "",
    message: "Peran harus dipilih.",
  },
};

// Validasi per field
function validateField(id) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById("error-" + id);
  let val = input.value.trim();

  if (fields[id].preformat) {
    val = fields[id].preformat(val);
    input.value = val;
  }

  if (!fields[id].validate(val)) {
    errorEl.textContent = fields[id].message;
    return false;
  } else {
    errorEl.textContent = "";
    return true;
  }
}

// Event listener real-time validasi
Object.keys(fields).forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => validateField(id));
});

// Handle submit
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const spinner = document.getElementById("loadingSpinner");
  spinner.classList.remove("hidden");

  let isValid = true;
  let firstInvalid = null;

  Object.keys(fields).forEach((id) => {
    const valid = validateField(id);
    if (!valid && !firstInvalid) {
      firstInvalid = document.getElementById(id);
      isValid = false;
    }
  });

  if (!isValid) {
    firstInvalid.focus();
    spinner.classList.add("hidden");
    return;
  }

  const nama = document.getElementById("nama").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const wa = document.getElementById("whatsapp").value.trim();
  const role = document.getElementById("role").value;

  // Sebelum createUser...
  const usernameExists = async (username) => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  // Di dalam submit...
  if (await usernameExists(username)) {
    alert("Username sudah digunakan. Silakan pilih yang lain.");
    spinner.classList.add("hidden");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      nama,
      username,
      email,
      wa,
      role,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    localStorage.setItem("loginUser", JSON.stringify(userData));

    // 🎉 SweetAlert - tampilan keren
    Swal.fire({
      icon: "success",
      title: "Pendaftaran Berhasil 🎉",
      text: "Akun kamu sudah siap digunakan.",
      confirmButtonText: "Lanjut Login",
      confirmButtonColor: "#16a34a",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      window.location.href = "login.html";
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Gagal Mendaftar 😥",
      text: error.message,
      confirmButtonText: "Coba Lagi",
      confirmButtonColor: "#dc2626",
    });
  } finally {
    spinner.classList.add("hidden");
  }
});

// Function to check login status

// Function to check login status
function cekStatusLogin(callback) {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Login dari Google
      callback(user.email);
    } else {
      // Coba cek dari localStorage
      const localUser = JSON.parse(localStorage.getItem("loginUser"));
      if (localUser) {
        callback(localUser.email);
      } else {
        // Tidak login
        callback(null);
      }
    }
  });
}
