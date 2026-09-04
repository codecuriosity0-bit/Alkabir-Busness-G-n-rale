// Nav background on scroll
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Theme toggle (sombre / clair) + logo adapté
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const brandLogos = document.querySelectorAll('.brand-logo');

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    brandLogos.forEach(img => {
      img.src = theme === 'light' ? 'ABG-light.jpeg' : 'ABG.jpeg';
    });
    localStorage.setItem('abg-theme', theme);
  }

  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // Mobile hamburger menu
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fun letter-pop typing: each character pops in with a little bounce
  function typePop(el, text, speed, onDone){
    if(reduceMotion){
      el.textContent = text;
      if(onDone) onDone();
      return;
    }
    let i = 0;
    (function step(){
      if(i < text.length){
        const ch = text[i];
        const span = document.createElement('span');
        span.className = 'letter-pop';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(span);
        i++;
        setTimeout(step, speed);
      } else if(onDone){
        onDone();
      }
    })();
  }
  // Erase letters one by one, fastest at the end
  function erasePop(el, speed, onDone){
    if(reduceMotion){
      el.textContent = '';
      if(onDone) onDone();
      return;
    }
    (function step(){
      if(el.children.length > 0){
        el.removeChild(el.lastElementChild);
        setTimeout(step, speed);
      } else if(onDone){
        onDone();
      }
    })();
  }
  // Hero: continuous type -> hold -> erase -> retype loop
  const abgText = "ABG";
  const fullText = "(Alkabir Business General)";
  const abgEl = document.getElementById('typeAbgText');
  const fullEl = document.getElementById('typeFull');
  const cursor1 = document.getElementById('cursor1');
  const tagline = document.getElementById('tagline');
  const scrollCue = document.getElementById('scrollCue');

  function heroCycle(isFirst){
    if(cursor1) cursor1.style.display = 'inline-block';
    typePop(abgEl, abgText, isFirst ? 190 : 150, () => {
      setTimeout(() => {
        if(cursor1) cursor1.style.display = 'none';
        typePop(fullEl, fullText, isFirst ? 42 : 32, () => {
          if(isFirst){
            tagline.classList.add('show');
            setTimeout(() => scrollCue.classList.add('show'), 300);
          }
          if(reduceMotion) return; // stay put, no looping erase
          setTimeout(() => {
            erasePop(fullEl, 18, () => {
              erasePop(abgEl, 35, () => {
                setTimeout(() => heroCycle(false), 500);
              });
            });
          }, 3400);
        });
      }, 400);
    });
  }
  window.addEventListener('load', () => heroCycle(true));

  // Bismillah: écriture/effacement par sous-chaînes (préserve la liaison des lettres arabes)
  const bismillahText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
  const bismillahEl = document.getElementById('bismillahText');

  function typeArabic(el, text, speed, onDone){
    if(reduceMotion){
      el.textContent = text;
      if(onDone) onDone();
      return;
    }
    let i = 0;
    (function step(){
      if(i <= text.length){
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if(onDone){
        onDone();
      }
    })();
  }
  function eraseArabic(el, speed, onDone){
    if(reduceMotion){
      if(onDone) onDone();
      return;
    }
    let i = el.textContent.length;
    (function step(){
      if(i > 0){
        i--;
        el.textContent = bismillahText.slice(0, i);
        setTimeout(step, speed);
      } else if(onDone){
        onDone();
      }
    })();
  }
  function bismillahCycle(isFirst){
    if(!bismillahEl) return;
    typeArabic(bismillahEl, bismillahText, isFirst ? 85 : 65, () => {
      if(reduceMotion) return;
      setTimeout(() => {
        eraseArabic(bismillahEl, 35, () => {
          setTimeout(() => bismillahCycle(false), 600);
        });
      }, 2800);
    });
  }
  if(bismillahEl) window.addEventListener('load', () => bismillahCycle(true));

  // Card brand-name typing, looping continuously once scrolled into view
  const cardTargets = [
    { el: document.getElementById('typeHoney'), text: 'Alkabir Honey' },
    { el: document.getElementById('typeCoffee'), text: 'Alkabir Coffee' }
  ];

  function cardCycle(card, el, text){
    typePop(el, text, 55, () => {
      card.classList.add('animated');
      if(reduceMotion) return;
      setTimeout(() => {
        erasePop(el, 25, () => {
          setTimeout(() => cardCycle(card, el, text), 450);
        });
      }, 2600);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const card = entry.target;
        const match = cardTargets.find(t => card.contains(t.el));
        if(match && !card.dataset.started){
          card.dataset.started = 'true';
          cardCycle(card, match.el, match.text);
        }
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.card').forEach(card => observer.observe(card));

  // Scroll reveal (fondu + montée), esprit Apple
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // Contact form -> WhatsApp
  // Numéro WhatsApp d'ABG au format international, sans "+" ni espaces
  const WHATSAPP_NUMBER = '221781448308';

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cf-name').value.trim();
      const phone = document.getElementById('cf-phone').value.trim();
      const message = document.getElementById('cf-message').value.trim();

      if (!name || !phone || !message) return;

      const text =
        `Bonjour ABG, je m'appelle ${name}.\n` +
        `Téléphone : ${phone}\n\n` +
        `${message}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      contactForm.reset();
    });
  }