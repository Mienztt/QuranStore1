// === IMPORT FIREBASE ===
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

// === KONFIGURASI FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyCsYPtUMbC2vFPGNNSyEST_27QuHn1aS0o",
  authDomain: "login-fff1e.firebaseapp.com",
  projectId: "login-fff1e",
  storageBucket: "login-fff1e.appspot.com",
  messagingSenderId: "961683942394",
  appId: "1:961683942394:web:142dbcae9708918ed2d243",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === TAMPILKAN PENGGUNA DI TABEL ===
async function tampilkanPengguna() {
  const userTableBody = document.getElementById("userTableBody");
  userTableBody.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    let no = 1;

    querySnapshot.forEach((userDoc) => {
      const data = userDoc.data();
      const uid = userDoc.id;

      const row = document.createElement("tr");
      row.className = "border-b hover:bg-green-50";

      row.innerHTML = `
        <td class="p-3 text-sm">${no++}</td>
        <td class="p-3 font-semibold text-gray-800">${data.nama}</td>
        <td class="p-3 text-sm">${data.email}</td>
        <td class="p-3 text-sm">${data.username}</td>
        <td class="p-3 text-sm font-semibold text-${
          data.role === "admin"
            ? "red"
            : data.role === "kasir"
            ? "blue"
            : "green"
        }-600">${data.role}</td>
        <td class="p-3 text-sm">
          <button data-uid="${uid}" class="hapusBtn bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full">
            Hapus
          </button>
        </td>
      `;

      userTableBody.appendChild(row);
    });

    // Tambahkan event listener ke tombol hapus
    document.querySelectorAll(".hapusBtn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const uid = btn.getAttribute("data-uid");
        const konfirmasi = confirm("Yakin ingin menghapus pengguna ini?");
        if (!konfirmasi) return;

        try {
          await deleteDoc(doc(db, "users", uid));
          alert("Pengguna berhasil dihapus.");
          tampilkanPengguna(); // Refresh tabel
        } catch (err) {
          alert("Gagal menghapus: " + err.message);
          console.error(err);
        }
      });
    });
  } catch (err) {
    console.error("Gagal menampilkan pengguna:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", tampilkanPengguna);
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("loginUser");
  window.location.href = "login.html";
});
