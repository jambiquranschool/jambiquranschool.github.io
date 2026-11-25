// Muncul saat di-scroll (bagian kontak)
const fadeObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:0.12});
document.querySelectorAll(".fade-in").forEach(el=>fadeObserver.observe(el));

// Menu mobile
const menu=document.getElementById('menu'),nav=document.getElementById('nav');
menu.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o)});
nav.addEventListener('click',e=>{if(e.target.closest('a'))nav.classList.remove('open');menu.setAttribute('aria-expanded',false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded',false)}});

// Saring pengumuman per unit
const tombol=document.querySelectorAll('.filter button'),baris=document.querySelectorAll('#daftar li'),kosong=document.getElementById('kosong');
tombol.forEach(b=>b.addEventListener('click',()=>{
  tombol.forEach(x=>x.setAttribute('aria-pressed',x===b));
  let n=0;baris.forEach(li=>{const ok=li.dataset.unit.split(' ').includes(b.dataset.f);li.hidden=!ok;if(ok)n++});
  kosong.hidden=n>0;
}));

// Video: pemutar dimuat otomatis saat bagian video terlihat di layar.
const videoObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const box = e.target;
    obs.unobserve(box);
    const f = document.createElement('iframe');
    f.src = box.dataset.embed.trim();
    f.title = box.dataset.title;
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    box.replaceChildren(f);
  });
}, { rootMargin: '200px' });

document.querySelectorAll('.vbox').forEach(box => {
  if (!box.dataset.embed.trim()) {
    box.innerHTML = '<p class="nanti">Video segera hadir.</p>';
    return;
  }
  videoObserver.observe(box);
});

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
  const NOMOR_WA = '6285267681824';
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

// Unit pendidikan: tampilkan panel sesuai tab yang ditekan
const tabUnit = document.querySelectorAll('.unit-tabs button');
const panelUnit = document.querySelectorAll('.unit-panel');
tabUnit.forEach(b => b.addEventListener('click', () => {
  tabUnit.forEach(x => x.setAttribute('aria-pressed', x === b));
  panelUnit.forEach(p => { p.hidden = p.dataset.unit !== b.dataset.u; });
}));