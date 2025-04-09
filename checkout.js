import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config (gunakan punyamu ya)
const firebaseConfig = {
  apiKey: "AIzaSyCsYPtUMbC2vFPGNNSyEST_27QuHn1aS0o",
  authDomain: "login-fff1e.firebaseapp.com",
  projectId: "login-fff1e",
  storageBucket: "login-fff1e.firebasestorage.app",
  messagingSenderId: "961683942394",
  appId: "1:961683942394:web:142dbcae9708918ed2d243",
  measurementId: "G-HK3FRZW8FM",
};

// Ambil data keranjang dari URL
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userLogin = null;
let keranjang = [];
let totalHarga = 0;

// Cek login sebelum menampilkan struk
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Silakan login terlebih dahulu sebelum checkout.");
    window.location.href = "login.html";
    return;
  }

  userLogin = user;
  tampilkanStruk();
});

function tampilkanStruk() {
  const params = new URLSearchParams(window.location.search);
  const encodedData = params.get("data");
  if (!encodedData) {
    alert("Data keranjang tidak ditemukan.");
    return;
  }

  try {
    keranjang = JSON.parse(atob(decodeURIComponent(encodedData)));
  } catch (e) {
    alert("Gagal membaca data keranjang.");
    return;
  }

  const container = document.getElementById("struk");
  let html = "";
  totalHarga = 0;

  keranjang.forEach((item) => {
    const subtotal = item.harga * item.qty;
    totalHarga += subtotal;
    html += `<div class="border-b pb-2 mb-2">
      <p><strong>${item.nama}</strong> x ${item.qty}</p>
      <p class="text-right">Rp ${subtotal.toLocaleString()}</p>
    </div>`;
  });

  html += `<div class="mt-4 text-right font-bold text-lg">Total: Rp ${totalHarga.toLocaleString()}</div>`;
  container.innerHTML = html;
}

// Tombol checkout
document.getElementById("btnCheckout").addEventListener("click", async () => {
  if (!userLogin) {
    alert("Kamu belum login.");
    window.location.href = "login.html";
    return;
  }

  try {
    await addDoc(collection(db, "transaksi"), {
      userId: userLogin.uid,
      email: userLogin.email,
      date: new Date().toISOString(),
      items: keranjang,
      total: totalHarga,
    });

    alert("Checkout berhasil disimpan!");
    // window.location.href = "sukses.html";
  } catch (err) {
    console.error("Gagal simpan transaksi:", err);
    alert("Gagal menyimpan transaksi.");
  }
});
