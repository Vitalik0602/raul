/* ==========================================================
   RAUL — Commercial Frontend Script
   Автор: ChatGPT (production version)
   ========================================================== */

/* ===================== НАСТРОЙКИ ===================== */

// ВПИШИ СВОИ ДАННЫЕ
const TELEGRAM_BOT_TOKEN = "PASTE_YOUR_TELEGRAM_BOT_TOKEN_HERE";
const TELEGRAM_CHAT_ID   = "PASTE_YOUR_CHAT_ID_HERE";

// Общие настройки
const SCROLL_OFFSET = 90;


/* ===================== ВСПОМОГАТЕЛЬНЫЕ ===================== */

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

function smoothScrollTo(element) {
  const y = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}


/* ===================== TELEGRAM ===================== */

function composeTelegramMessage(form) {
  const formName = form.dataset.form || "Заявка";
  const data = new FormData(form);

  const name = data.get("name") || "-";
  const phone = data.get("phone") || "-";
  const message = data.get("message") || "-";

  return (
    `🛒 <b>${formName}</b>\n\n` +
    `👤 Имя: <b>${name}</b>\n` +
    `📞 Телефон: <b>${phone}</b>\n` +
    `📝 Комментарий:\n${message}`
  );
}

async function sendToTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error("Telegram Bot Token или Chat ID не указаны");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "HTML"
      })
    }
  );

  if (!response.ok) {
    throw new Error("Ошибка отправки в Telegram");
  }
}


/* ===================== ФОРМЫ ===================== */

function initForms() {
  qsa(".tg-form").forEach(form => {
    const status = qs(".form__status", form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      status.textContent = "Отправляем...";
      status.style.color = "#ffffff";

      try {
        const message = composeTelegramMessage(form);
        await sendToTelegram(message);

        status.textContent = "Заявка отправлена! Мы скоро свяжемся.";
        status.style.color = "#30d158";
        form.reset();
      } catch (error) {
        status.textContent = "Ошибка отправки. Попробуйте позже.";
        status.style.color = "#ff453a";
        console.error(error);
      }
    });
  });
}


/* ===================== КНОПКИ «КУПИТЬ» ===================== */

function initBuyButtons() {
  qsa("[data-buy]").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.dataset.buy;
      const form = qs(".tg-form");

      if (!form) return;

      const textarea = qs("textarea[name='message']", form);
      if (textarea) {
        textarea.value = `${product}. Хочу узнать наличие и цену.`;
      }

      smoothScrollTo(form);
      textarea && textarea.focus();
    });
  });
}


/* ===================== АНИМАЦИИ ===================== */

function initRevealOnScroll() {
  const elements = qsa(".glass, .card, .product, .title");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
      entry.target.classList.toggle("hidden", !entry.isIntersecting);
    });
  }, { threshold: 0.15 });

  elements.forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
  });
}


/* ===================== MAGNETIC BUTTON ===================== */

function initMagneticButtons() {
  qsa(".btn").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x / 14}px, ${y / 14}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
}


/* ===================== HEADER SCROLL ===================== */

function initHeaderShadow() {
  const header = qs(".header");
  if (!header) return;

  const toggle = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}


/* ===================== HERO PARALLAX ===================== */

function initHeroParallax() {
  const bg = qs(".hero__bg-glass");
  if (!bg) return;

  window.addEventListener("scroll", () => {
    bg.style.transform = `translateY(${window.scrollY * 0.08}px)`;
  }, { passive: true });
}


/* ===================== ЯКОРЯ ===================== */

function initAnchors() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = qs(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
    });
  });
}


/* ===================== INIT ===================== */

document.addEventListener("DOMContentLoaded", () => {
  initForms();
  initBuyButtons();
  initRevealOnScroll();
  initMagneticButtons();
  initHeaderShadow();
  initHeroParallax();
  initAnchors();
});

/* ================= BUY BUTTON ================= */
document.querySelectorAll("[data-buy]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const form=document.querySelector(".tg-form");
    if(!form) return;
    form.querySelector("textarea").value=`${btn.dataset.buy} — хочу узнать цену`;
    form.scrollIntoView({behavior:"smooth"});
  });
});

/* ================= FLOAT TELEGRAM ================= */
const tg=document.createElement("div");
tg.className="tg-float";
tg.innerHTML=`<a href="https://t.me/YOUR_TELEGRAM">@ Telegram</a>`;
document.body.appendChild(tg);

/* ================= SIMPLE REVIEW AUTO SCROLL ================= */
const slider=document.querySelector(".reviews__slider");
if(slider){
  let scroll=0;
  setInterval(()=>{
    scroll+=300;
    if(scroll>slider.scrollWidth) scroll=0;
    slider.scrollTo({left:scroll,behavior:"smooth"});
  },4000);
}

// Привязка к кнопкам Trade-in
document.querySelectorAll("[data-buy='Trade-in — хочу обменять']").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const form=document.querySelector(".tg-form");
    if(!form) return;
    form.querySelector("textarea").value="Хочу обменять устройство по Trade-in";
    form.scrollIntoView({behavior:"smooth"});
  });
});
