/* ═══════════════════════════════════════════════════════════
   GNB SUDAMERIS · CRÉDITO GARANTIZADO DIGITAL
   app.js · v1.0 · Mayo 2025
═══════════════════════════════════════════════════════════ */

// ─── STEP NAVIGATION ─────────────────────────────────────────
let currentStep = 1;
const TOTAL_STEPS = 6;

const stepLabels = [
  '',
  'Paso 1 de 6 · Selección de garantía',
  'Paso 2 de 6 · Autorización de datos y firma electrónica',
  'Paso 3 de 6 · Verificación de identidad',
  'Paso 4 de 6 · Gestión documental y registro de garantías',
  'Paso 5 de 6 · Simulador y condiciones del crédito',
  'Paso 6 de 6 · Desembolso — aprobación y giro',
];

function goStep(n) {
  if (n < 1 || n > TOTAL_STEPS) return;

  // Hide all panels
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel-' + n);
  if (target) target.classList.add('active');

  // Update step tabs
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const tab  = document.getElementById('tab-' + i);
    const snum = document.getElementById('snum-' + i);
    if (!tab) continue;
    tab.classList.remove('active', 'done');
    if (snum) {
      snum.style.background = '';
      snum.style.color = '';
    }
    if (i < n) {
      tab.classList.add('done');
      if (snum) { snum.style.background = '#1a7a4a'; snum.style.color = '#fff'; snum.textContent = '✓'; }
    } else if (i === n) {
      tab.classList.add('active');
      if (snum) { snum.style.background = '#C8102E'; snum.style.color = '#fff'; snum.textContent = i; }
    } else {
      if (snum) snum.textContent = i;
    }
  }

  currentStep = n;

  // Progress bar
  const fill = document.getElementById('prog-fill');
  if (fill) fill.style.width = ((n / TOTAL_STEPS) * 100) + '%';

  // Bottom nav label
  const info = document.getElementById('step-info');
  if (info) info.textContent = stepLabels[n] || '';

  // Prev button opacity
  const btnPrev = document.getElementById('btn-prev');
  if (btnPrev) btnPrev.style.opacity = n === 1 ? '0.4' : '1';

  // Next button label
  const btnNext = document.getElementById('btn-next');
  if (btnNext) btnNext.textContent = n === TOTAL_STEPS ? '✓ Finalizar solicitud' : 'Continuar →';

  // Scroll to stepper
  const stepper = document.getElementById('stepper-section');
  if (stepper) stepper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextStep() {
  if (currentStep < TOTAL_STEPS) {
    goStep(currentStep + 1);
  } else {
    showSuccessModal();
  }
}

function prevStep() {
  if (currentStep > 1) goStep(currentStep - 1);
}

// ─── GARANTÍA SELECTION ───────────────────────────────────────
let selectedGarantia = 1;

function selectGarantia(n) {
  selectedGarantia = n;
  [1, 2].forEach(i => {
    const card  = document.getElementById('gcard-' + i);
    const check = document.getElementById('check-' + i);
    if (!card) return;
    if (i === n) {
      card.classList.add('selected');
      if (check) check.style.display = 'block';
    } else {
      card.classList.remove('selected');
      if (check) check.style.display = 'none';
    }
  });

  // Update simulator defaults based on selection
  if (n === 1) {
    const sl = document.getElementById('sl-monto');
    if (sl) { sl.max = 65; sl.value = 58; }
  } else {
    const sl = document.getElementById('sl-monto');
    if (sl) { sl.max = 41; sl.value = 35; }
  }
  updateSim();
}

// ─── SIMULATOR ────────────────────────────────────────────────
const IBR_BASE = 11.50; // IBR 3M vigente

function updateSim() {
  const slMonto = document.getElementById('sl-monto');
  const slPlazo = document.getElementById('sl-plazo');
  const slIbr   = document.getElementById('sl-ibr');
  if (!slMonto) return;

  const monto = parseInt(slMonto.value);
  const plazo = parseInt(slPlazo.value);
  const pb    = parseInt(slIbr.value);

  // Display slider values
  setEl('out-monto', '$' + monto + 'M');
  setEl('out-plazo', plazo + ' meses');
  setEl('out-ibr',   '+' + pb + ' pb');

  // Calcs
  const tasa       = IBR_BASE + pb / 100;
  const intAnual   = monto * (tasa / 100);
  const saldoGar   = selectedGarantia === 1 ? 85.4 : 50.0;
  const cobertura  = ((saldoGar / monto) * 100).toFixed(1);
  const cobColor   = parseFloat(cobertura) >= 130 ? '#1a7a4a'
                   : parseFloat(cobertura) >= 120 ? '#185FA5' : '#d97706';

  setEl('sim-monto', formatCOP(monto * 1_000_000) + ' COP');
  setEl('r-tasa',    tasa.toFixed(2) + '% E.A.');
  setEl('r-int',     formatCOP(Math.round(intAnual * 1_000_000)));
  setEl('r-cap',     formatCOP(monto * 1_000_000));

  const rCob = document.getElementById('r-cob');
  if (rCob) {
    rCob.textContent = cobertura + '%';
    rCob.style.color = cobColor;
  }
}

function formatCOP(n) {
  return '$' + n.toLocaleString('es-CO');
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── SUCCESS MODAL ────────────────────────────────────────────
function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    // Create modal dynamically
    const m = document.createElement('div');
    m.id = 'success-modal';
    m.style.cssText = `
      position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.6);
      display:flex;align-items:center;justify-content:center;
    `;
    m.innerHTML = `
      <div style="background:white;border-radius:16px;padding:36px;max-width:440px;width:90%;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,0.3)">
        <div style="font-size:52px;margin-bottom:12px">🎉</div>
        <div style="font-size:20px;font-weight:700;color:#111827;margin-bottom:8px">¡Solicitud completada!</div>
        <div style="font-size:13px;color:#6b7280;margin-bottom:20px;line-height:1.6">
          Tu crédito garantizado ha sido procesado exitosamente.<br>
          Recibirás el desembolso en tu cuenta en las próximas horas vía ACH.
        </div>
        <div style="background:#f0fdf4;border:1px solid rgba(26,122,74,0.3);border-radius:10px;padding:14px;margin-bottom:20px;text-align:left">
          <div style="font-size:11px;color:#166534;font-weight:600;margin-bottom:6px">Resumen de tu operación</div>
          <div style="font-size:11px;color:#4b5563;display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.06)"><span>Monto aprobado</span><span style="font-weight:600;color:#1a7a4a">$58,700,000</span></div>
          <div style="font-size:11px;color:#4b5563;display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.06)"><span>Tasa</span><span style="font-weight:600">IBR + 180 pb = 13.30% EA</span></div>
          <div style="font-size:11px;color:#4b5563;display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.06)"><span>Plazo</span><span style="font-weight:600">12 meses (bullet)</span></div>
          <div style="font-size:11px;color:#4b5563;display:flex;justify-content:space-between;padding:4px 0"><span>Desembolso</span><span style="font-weight:600;color:#1a7a4a">ACH · hoy mismo</span></div>
        </div>
        <div style="display:flex;gap:10px;">
          <button onclick="document.getElementById('success-modal').remove();goStep(1)"
            style="flex:1;background:#f3f4f6;border:none;border-radius:8px;padding:10px;font-size:12px;cursor:pointer;color:#374151">
            Nueva solicitud
          </button>
          <button onclick="document.getElementById('success-modal').remove()"
            style="flex:1;background:#C8102E;border:none;border-radius:8px;padding:10px;font-size:13px;font-weight:500;cursor:pointer;color:white">
            Ir al inicio
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  }
}

// ─── OTP VALIDATION DEMO ──────────────────────────────────────
function setupOTPDemo() {
  const input = document.querySelector('.otp-input');
  if (!input) return;
  input.addEventListener('input', function () {
    const val = this.value.replace(/\D/g, '').slice(0, 6);
    this.value = val;
    if (val.length === 6) {
      this.style.borderColor = '#1a7a4a';
      this.style.color       = '#1a7a4a';
      showToast('✅ OTP verificado correctamente');
    } else {
      this.style.borderColor = '';
      this.style.color       = '';
    }
  });
}

// ─── TOAST NOTIFICATION ───────────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.getElementById('gnb-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'gnb-toast';
  const bg = type === 'error' ? '#C8102E' : '#1a7a4a';
  toast.style.cssText = `
    position:fixed;bottom:90px;right:20px;z-index:9999;
    background:${bg};color:white;
    padding:10px 18px;border-radius:10px;
    font-size:12px;font-weight:500;
    box-shadow:0 4px 16px rgba(0,0,0,0.2);
    animation:slideUp 0.3s ease;
  `;
  toast.textContent = msg;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── UPLOAD ZONE DEMO ─────────────────────────────────────────
function setupUploadZones() {
  document.querySelectorAll('.upload-zone').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.style.borderColor = '#C8102E';
      zone.style.background  = 'rgba(200,16,46,0.04)';
    });
    zone.addEventListener('dragleave', () => {
      zone.style.borderColor = '';
      zone.style.background  = '';
    });
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.style.borderColor = '';
      zone.style.background  = '';
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        showToast(`✅ ${files.length} archivo(s) cargado(s) correctamente`);
      }
    });
  });
}

// ─── SMOOTH SCROLL TO ANCHOR ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  if (e.key === 'ArrowRight' || e.key === 'Enter') nextStep();
  if (e.key === 'ArrowLeft')  prevStep();
});

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  goStep(1);
  updateSim();
  setupOTPDemo();
  setupUploadZones();

  // Animate KPI cards on scroll
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.kpi-card, .hero-stat, .parte-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      obs.observe(el);
    });
  }
});
