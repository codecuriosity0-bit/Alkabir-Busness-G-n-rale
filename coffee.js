const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

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

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Pré-sélection de la gamme (+ prix) depuis les boutons "Commander cette gamme"
  const productSelect = document.getElementById('of-product');
  const PRICE_MAP = {
    'Grains entiers': '2 500 FCFA / 250g',
    'Café moulu': '2 000 FCFA / 250g',
    'Café instantané': '1 800 FCFA / 100g'
  };
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (productSelect) productSelect.value = btn.dataset.product;
      document.getElementById('commander').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Commande -> WhatsApp
  const WHATSAPP_NUMBER = '221781448308';
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('of-name').value.trim();
      const phone = document.getElementById('of-phone').value.trim();
      const product = document.getElementById('of-product').value;
      const message = document.getElementById('of-message').value.trim();
      const price = PRICE_MAP[product] || 'Prix à confirmer';

      if (!name || !phone || !product) return;

      const text =
        `Bonjour Alkabir Coffee, je m'appelle ${name}.\n` +
        `Téléphone : ${phone}\n` +
        `Gamme souhaitée : ${product}\n` +
        `Prix indicatif : ${price}\n` +
        (message ? `\n${message}` : '');

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      orderForm.reset();
    });
  }
