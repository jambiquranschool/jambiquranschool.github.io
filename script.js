// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== ANIMATED COUNTER =====
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString('id-ID') + suffix;
  }, 16);
}

// ===== FADE-IN ON SCROLL =====
const fadeEls = document.querySelectorAll('.fade-in');
const counters = document.querySelectorAll('[data-target]');
const countedEls = new Set();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// ===== COUNTER OBSERVER =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countedEls.has(entry.target)) {
      countedEls.add(entry.target);
      const target = parseInt(entry.target.dataset.target);
      const suffix = entry.target.closest('.stat-item')
        ? (entry.target.dataset.target === '98' ? '%' : '+')
        : '';
      animateCount(entry.target, target, suffix);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ===== FORM SUBMIT =====
async function submitForm() {
  const namaOrtu   = document.querySelector('input[placeholder="Nama lengkap"]').value.trim();
  const namaAnak   = document.querySelector('input[placeholder="Nama anak"]').value.trim();
  const noWa       = document.querySelector('input[type="tel"]').value.trim();
  const unit       = document.querySelector('select').value;
  const pesan      = document.querySelector('textarea').value.trim();

  // Validasi sederhana
  if (!namaOrtu || !namaAnak || !noWa || !unit) {
    alert('Mohon lengkapi semua field yang wajib diisi.');
    return;
  }

  // ===== KIRIM KE GOOGLE SHEET =====
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzE2cT1XLUkurLZ8NGEyKl5EeczsPiec08VzAjrbZkDQcsfCgzLvlOT2p6EF2Bq-N9Zkg/exec';
  const payload = { namaOrtu, namaAnak, noWa, unit, pesan };
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Gagal kirim ke sheet:', e);
  }

  // ===== REDIRECT KE WHATSAPP =====
  const NOMOR_WA = '6282370679971';
  const teks = encodeURIComponent(
    `*Pendaftaran Siswa Baru - Jambi Qur'an School*\n\n` +
    `Nama Orang Tua : ${namaOrtu}\n` +
    `Nama Calon Siswa : ${namaAnak}\n` +
    // `No. WhatsApp : ${noWa}\n` +
    `Unit Diminati : ${unit}\n` +
    `Pesan : ${pesan || '-'}`
  );
  window.open(`https://wa.me/${NOMOR_WA}?text=${teks}`, '_blank');

  // ===== TAMPILKAN SUKSES =====
  document.getElementById('formArea').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}
