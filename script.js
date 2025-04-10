import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
// === Data Produk ===
const produkList = [
  {
    nama: "Al-Quran Hafalan",
    harga: 120000,
    bahan: "Art Paper",
    tanggal: "2025-03-01",
    gambar: "img/quran1.jpg",
    stok: 1,
    label: "terlaris", // 🌟
  },
  {
    nama: "Al-Quran Terjemahan",
    harga: 140000,
    bahan: "HVS",
    tanggal: "2025-02-15",
    gambar: "img/quran2.png",
    stok: 1,
    label: "baru", // 🌟
  },
  {
    nama: "Tafsir Ibnu Katsir",
    harga: 180000,
    bahan: "Art Paper",
    tanggal: "2025-01-25",
    gambar: "img/quran3.jpg",
    stok: 2,
    label: "terlaris", // 🌟
  },
  {
    nama: "Sirah Nabawiyah",
    harga: 90000,
    bahan: "HVS",
    tanggal: "2025-01-05",
    gambar: "img/quran4.jpg",
    stok: 2,
  },
  {
    nama: "Fiqih Sunnah Sayid Sabiq",
    harga: 200000,
    bahan: "HVS",
    tanggal: "2025-04-05",
    gambar: "img/fikihsunnah.png ",
    stok: 1,
    label: "terlaris", // 🌟
  },
  {
    nama: "Ta'lim Mutaalim",
    harga: 230000,
    bahan: "HVS",
    tanggal: "2025-04-02",
    gambar: "img/quran7.jpg",
    stok: 1,
  },
  {
    nama: "Quran Hafalan Anak",
    harga: 140000,
    bahan: "HVS",
    tanggal: "2025-03-08",
    gambar: "img/qurananak.jpg",
    stok: 1,
  },
  {
    nama: "Tafsir Ibnu katsir (Full Jilid)",
    harga: 280000,
    bahan: "HVS",
    tanggal: "2025-03-012",
    gambar: "img/tafsirfull.jpg",
    stok: 1,
    label: "terlaris", // 🌟
  },
  {
    nama: " Tafsir Al Mu'awwidzat",
    harga: 85000,
    bahan: "HVS",
    tanggal: "2025-03-013",
    gambar: "img/tafsirMu.jpg",
    stok: 1,
  },
  {
    nama: "Hadist Arbain An Nawawi",
    harga: 100000,
    bahan: "HVS",
    tanggal: "2025-03-014",
    gambar: "img/hadist.jpg",
    stok: 1,
  },
  {
    nama: "hulasah Nurul Yaqin",
    harga: 80000,
    bahan: "HVS",
    tanggal: "2025-03-015",
    gambar: "img/musthalah.jpg",
    stok: 1,
  },
  {
    nama: "Panduan Sholat Teerlengkap",
    harga: 900000,
    bahan: "HVS",
    tanggal: "2025-03-016",
    gambar: "img/panduan.jpg",
    stok: 2,
    label: "terlaris", // 🌟
  },
];

let cart = [];

function renderProduk(data = produkList) {
  const container = document.getElementById("produkContainer");
  container.innerHTML = "";
  data.forEach((produk, index) => {
    const isInCart = cart.some((item) => item.index === index);
    const isOutOfStock = produk.stok === 0;
    const card = document.createElement("div");
    card.className = "border p-4 rounded-xl shadow";
    card.innerHTML = `
    <div class="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      ${
        produk.label
          ? `<span class="absolute top-2 left-2 bg-${
              produk.label === "terlaris" ? "yellow" : "green"
            }-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              ${produk.label === "terlaris" ? "🔥 Terlaris" : "🆕 Baru"}
            </span>`
          : ""
      }
  
      <img src="${produk.gambar}" alt="${produk.nama}" class="w-full rounded" />
      <div class="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 class="font-bold text-lg text-green-700">${produk.nama}</h3>
          <p class="text-sm text-gray-600">Rp ${produk.harga.toLocaleString()}</p>
          <p class="text-xs text-gray-500 mt-1">Bahan: ${produk.bahan}</p>
          <p class="text-xs text-gray-400">Stok: ${produk.stok}</p>
        </div>
        <button class="mt-4 w-full text-sm ${
          isOutOfStock || isInCart
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white font-semibold py-2 rounded-xl transition" ${
      isOutOfStock || isInCart ? "disabled" : ""
    } data-index="${index}">
          ${
            isOutOfStock
              ? "Stok Habis"
              : isInCart
              ? "Sudah di Keranjang"
              : "Masukkan ke Keranjang"
          }
        </button>
      </div>
    </div>
  `;
    card.setAttribute("data-aos", "fade-up");

    container.appendChild(card);
  });
  document.querySelectorAll("button[data-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      if (
        !cart.some((item) => item.index === idx) &&
        produkList[idx].stok > 0
      ) {
        cart.push({ index: idx, qty: 1 });
        updateKeranjang();
        renderProduk();
      }
    });
  });
}

function updateKeranjang() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const totalPriceElement = document.getElementById("totalCartPrice");

  cartItems.innerHTML = "";
  cartCount.textContent = cart.length;

  let total = 0;

  cart.forEach((item) => {
    const produk = produkList[item.index];
    total += produk.harga * item.qty;

    const wrapper = document.createElement("div");
    wrapper.className =
      "flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow transition";
    wrapper.setAttribute("data-aos", "fade-up");

    wrapper.innerHTML = `
      <img src="${produk.gambar}" alt="${
      produk.nama
    }" class="w-14 h-14 object-cover rounded-lg border" />
      <div class="flex-1">
        <h4 class="font-semibold text-sm text-green-800">${produk.nama}</h4>
        <p class="text-xs text-gray-600">Rp ${produk.harga.toLocaleString()}</p>
        <div class="flex items-center gap-2 mt-1">
          <button class="bg-gray-200 text-gray-700 px-2 rounded" data-minus="${
            item.index
          }">-</button>
          <span class="text-sm">${item.qty}</span>
          <button class="bg-gray-200 text-gray-700 px-2 rounded" data-plus="${
            item.index
          }">+</button>
        </div>
      </div>
      <button class="text-red-500 hover:text-red-600 text-lg font-bold px-2" data-remove="${
        item.index
      }" title="Hapus">×</button>
    `;

    cartItems.appendChild(wrapper);
  });

  // Update total
  totalPriceElement.textContent = `Total: Rp ${total.toLocaleString()}`;

  // Tombol hapus
  document.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-remove"));
      const indexInCart = cart.findIndex((item) => item.index === idx);
      if (indexInCart > -1) {
        cart.splice(indexInCart, 1);
        updateKeranjang();
        renderProduk();
      }
    });
  });

  // Tombol +
  document.querySelectorAll("button[data-plus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-plus"));
      const item = cart.find((i) => i.index === idx);
      if (item && produkList[idx].stok > item.qty) {
        item.qty += 1;
        updateKeranjang();
      }
    });
  });

  // Tombol -
  document.querySelectorAll("button[data-minus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-minus"));
      const item = cart.find((i) => i.index === idx);
      if (item && item.qty > 1) {
        item.qty -= 1;
        updateKeranjang();
      }
    });
  });
}

// Panel toggle
const toggleBtn = document.getElementById("cartToggle");
toggleBtn?.addEventListener("click", () => {
  document.getElementById("cartPanel")?.classList.toggle("translate-x-full");
});

renderProduk();
updateKeranjang();

// === Filter & Sort ===
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const bahanFilter = document.getElementById("bahanFilter");
const hargaMin = document.getElementById("hargaMin");
const hargaMax = document.getElementById("hargaMax");
const resetBtn = document.getElementById("resetBtn");

function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const sortValue = sortSelect.value;
  const bahanValue = bahanFilter.value;
  const min = parseInt(hargaMin.value) || 0;
  const max = parseInt(hargaMax.value) || Infinity;

  let hasil = produkList.filter((produk) => {
    return (
      produk.nama.toLowerCase().includes(keyword) &&
      (bahanValue === "" || produk.bahan === bahanValue) &&
      produk.harga >= min &&
      produk.harga <= max
    );
  });

  switch (sortValue) {
    case "harga-asc":
      hasil.sort((a, b) => a.harga - b.harga);
      break;
    case "harga-desc":
      hasil.sort((a, b) => b.harga - a.harga);
      break;
    case "tanggal-asc":
      hasil.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
      break;
    case "tanggal-desc":
      hasil.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      break;
    case "nama-asc":
      hasil.sort((a, b) => a.nama.localeCompare(b.nama));
      break;
    case "nama-desc":
      hasil.sort((a, b) => b.nama.localeCompare(a.nama));
      break;
  }

  renderProduk(hasil);
}

[searchInput, sortSelect, bahanFilter, hargaMin, hargaMax].forEach((el) => {
  el.addEventListener("input", applyFilters);
});

resetBtn?.addEventListener("click", () => {
  searchInput.value = "";
  sortSelect.value = "";
  bahanFilter.value = "";
  hargaMin.value = "";
  hargaMax.value = "";
  applyFilters();
});

// Tombol Lihat Struk dengan validasi login
// PASTIKAN ini dipanggil setelah DOM selesai dimuat
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  console.log("Status login user:", user); // Tambahkan ini!
  currentUser = user;
});

window.addEventListener("DOMContentLoaded", () => {
  const lihatStrukBtn = document.getElementById("lihatStrukBtn");
  if (lihatStrukBtn) {
    lihatStrukBtn.addEventListener("click", () => {
      if (!currentUser) {
        Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Silakan login terlebih dahulu untuk melanjutkan.",
          confirmButtonText: "Login Sekarang",
          confirmButtonColor: "#166534",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "login.html";
          }
        });
        return;
      }

      const keranjangBaru = cart.map((item) => {
        const produk = produkList[item.index];
        return {
          nama: produk.nama,
          harga: produk.harga,
          qty: item.qty || 1,
        };
      });

      const encoded = encodeURIComponent(btoa(JSON.stringify(keranjangBaru)));
      window.location.href = `checkout.html?data=${encoded}`;
    });
  }
});
window.logout = () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("loginUser");

      // Buat elemen toast
      const toast = document.createElement("div");
      toast.textContent = "🚪 Logout berhasil. Sampai jumpa lagi!";
      toast.className =
        "fixed top-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm animate-toast";

      // Tambahkan ke body
      document.body.appendChild(toast);

      // CSS animasi toast
      const style = document.createElement("style");
      style.textContent = `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-toast {
          animation: slideIn 0.4s ease-out;
        }
      `;
      document.head.appendChild(style);

      // Auto redirect dan hapus toast setelah 2 detik
      setTimeout(() => {
        toast.remove();
        window.location.href = "index.html";
      }, 2000);
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert("Gagal logout: " + error.message);
    });
};

const backToTopBtn = document.getElementById("backToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.remove("hidden");
  } else {
    backToTopBtn.classList.add("hidden");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
//  fungsi tutup panel
const closeCartBtn = document.getElementById("closeCartBtn");
closeCartBtn?.addEventListener("click", () => {
  document.getElementById("cartPanel")?.classList.add("translate-x-full");
});
const overlay = document.getElementById("cartOverlay");
const panel = document.getElementById("cartPanel");

toggleBtn?.addEventListener("click", () => {
  panel.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
});

closeCartBtn?.addEventListener("click", () => {
  panel.classList.add("translate-x-full");
  overlay.classList.add("hidden");
});

overlay?.addEventListener("click", () => {
  panel.classList.add("translate-x-full");
  overlay.classList.add("hidden");
});

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
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = document.getElementById("mobileMenu");

  toggleBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
});
