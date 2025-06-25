// Simple cart logic
  let cart = [];
  function addToCart(name, price) {
    cart.push({ name, price });
    updateCartDisplay();
    updateCartIcon();
  }

  function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');
    cartCount.textContent = cart.length;
    if (cartItems) {
      cartItems.innerHTML = '';
      if (cart.length === 0) {
        cartItems.innerHTML = '<li>Your cart is empty.</li>';
        if (checkoutButton) checkoutButton.disabled = true;
      } else {
        cart.forEach(item => {
          const li = document.createElement('li');
          li.textContent = `${item.name} - $${item.price}`;
          cartItems.appendChild(li);
        });
        if (checkoutButton) checkoutButton.disabled = false;
      }
    }
    updateCartIcon();
  }

  // --- Honeycomb filter logic ---
  const honeycombGrid = document.querySelector('.honeycomb-grid');
  const honeycombProducts = [];
  const productTitles = [
    'Jujutsu Kaisen', 'Blue Lock', 'Haikyu!!', 'Wind Breaker', 'My Hero Academia',
    'Bungo Stray Dogs', 'Kimetsu no Yaiba', 'Tian Guan Ci Fu', 'Honkai Star Rail', 'Genshin Impact'
  ];

  function getHoneycombLayout(containerWidth) {
    // Always at least 1 col, but for mobile, allow 2 cols if possible
    const HEX_WIDTH = 240;
    const minGap = 0; // can be adjusted
    let cols = Math.floor((containerWidth + minGap) / (HEX_WIDTH));
    if (cols < 1) cols = 1;
    // For mobile, force 2/1/2/1 pattern if width allows 2
    if (containerWidth < HEX_WIDTH * 2.5) {
      return { cols: 2, mobilePattern: true };
    }
    return { cols, mobilePattern: false };
  }

  function renderHoneycomb() {
    honeycombGrid.innerHTML = '';
    const containerWidth = honeycombGrid.offsetWidth || window.innerWidth;
    const HEX_WIDTH = 240;
    const HEX_HEIGHT = 208;
    let { cols, mobilePattern } = getHoneycombLayout(containerWidth);
    const totalProducts = 20;
    let productIndex = 1;
    let row = 0;
    let y = 0;
    while (productIndex <= totalProducts) {
      let rowCols = cols;
      if (mobilePattern) {
        rowCols = (row % 2 === 0) ? 2 : 1;
      }
      for (let col = 0; col < rowCols && productIndex <= totalProducts; col++) {
        const offsetX = (row % 2 === 1) ? HEX_WIDTH / 2 : 0;
        const x = col * HEX_WIDTH + offsetX;
        const title = productTitles[(productIndex - 1) % productTitles.length];
        const price = (Math.random() * 90 + 10).toFixed(2);
        const imgUrl = `https://picsum.photos/240/208?random=${productIndex}`;
        const hex = document.createElement('div');
        hex.className = 'hex-product';
        hex.style.left = x + 'px';
        hex.style.top = y + 'px';
        hex.setAttribute('data-title', title);
        hex.innerHTML = `
          <svg viewBox="0 0 240 208" width="240" height="208" style="display:block;">
            <defs>
              <clipPath id="hex-clip">
                <polygon points="120,0 240,52 240,156 120,208 0,156 0,52" />
              </clipPath>
            </defs>
            <image href="${imgUrl}" width="240" height="208" clip-path="url(#hex-clip)" preserveAspectRatio="xMidYMid slice" />
            <polygon points="120,0 240,52 240,156 120,208 0,156 0,52" fill="rgba(255,255,255,0.7)" stroke="#fbbf24" stroke-width="4"/>
            <foreignObject x="0" y="0" width="240" height="208">
              <div xmlns="http://www.w3.org/1999/xhtml" class="hex-content" style="width:240px;height:208px;">
                <h3>${title}</h3>
                <p>$${price}</p>
              </div>
            </foreignObject>
          </svg>
        `;
        hex.addEventListener('click', function() {
          openProductModal({
            img: imgUrl,
            name: title,
            desc: `This is a ${title} product.`,
            price: price
          });
        });
        honeycombGrid.appendChild(hex);
        honeycombProducts.push(hex);
        productIndex++;
      }
      row++;
      y += HEX_HEIGHT * 0.75;
    }
  }

  window.addEventListener('resize', function() {
    renderHoneycomb();
  });

  // Initial render after DOMContentLoaded
  window.addEventListener('DOMContentLoaded', function() {
    renderHoneycomb();
  });

  // Modal logic
  const modal = document.getElementById('product-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const modalWishlist = document.getElementById('modal-wishlist');
  const modalCart = document.getElementById('modal-cart');
  const modalClose = document.getElementById('modal-close');

  function openProductModal(product) {
    modalImg.src = product.img;
    modalTitle.textContent = product.name;
    modalDesc.textContent = product.desc;
    modalPrice.textContent = `$${product.price}`;
    modal.classList.add('active');
    modalWishlist.classList.remove('active');
  }

  modalClose.onclick = function() {
    modal.classList.remove('active');
  };

  modal.onclick = function(e) {
    if (e.target === modal) modal.classList.remove('active');
  };

  modalWishlist.onclick = function() {
    modalWishlist.classList.toggle('active');
  };

  modalCart.onclick = function() {
    addToCart(modalTitle.textContent, modalPrice.textContent.replace('$',''));
    modal.classList.remove('active');
  };

  // Collapsible for Popular Titles
  const popularToggle = document.getElementById('popular-toggle');
  const popularContent = document.getElementById('popular-content');
  const popularArrow = document.getElementById('popular-arrow');

  if (popularToggle && popularContent && popularArrow) {
  popularToggle.addEventListener('click', function() {
    const isOpen = popularContent.classList.toggle('open');
    if (isOpen) {
      popularContent.style.display = 'block';
      requestAnimationFrame(() => {
        popularContent.style.maxHeight = popularContent.scrollHeight + 'px';
      });
    } else {
      popularContent.style.maxHeight = '0px';
      setTimeout(() => {
        popularContent.style.display = 'none'; // hide after animation
      }, 400);
    }
    popularToggle.setAttribute('aria-expanded', isOpen);
    popularArrow.innerHTML = isOpen ? '&#9660;' : '&#9660;';
    popularToggle.blur();
  });
  // Start open
  popularContent.classList.add('open');
  popularContent.style.display = 'block';
  popularContent.style.maxHeight = popularContent.scrollHeight + 'px';
  popularToggle.setAttribute('aria-expanded', true);
  popularArrow.innerHTML = '&#9660;';
}

  // Sidebar filter logic
  const popularList = document.getElementById('popular-list');
  if (popularList) {
    popularList.querySelectorAll('li').forEach(li => {
      li.style.cursor = 'pointer';
      li.addEventListener('click', function(e) {
        const filterTitle = this.getAttribute('data-title');
        // Navigate to collection page with title as query param
        window.location.href = `collection.html?title=${encodeURIComponent(filterTitle)}`;
      });
    });
  }

  // Generate sidebar popular titles dynamically
  if (popularList) {
    popularList.innerHTML = '';
    productTitles.forEach((title, idx) => {
      const li = document.createElement('li');
      li.setAttribute('data-title', title);
      // Use the same images as before, or fallback to a placeholder
      const imgSrcs = [
        'https://cdn.myanimelist.net/images/anime/1804/126216.jpg',
        'https://cdn.myanimelist.net/images/anime/1015/127974.jpg',
        'https://cdn.myanimelist.net/images/anime/7/76014.jpg',
        'https://cdn.myanimelist.net/images/anime/1972/139503.jpg',
        'https://cdn.myanimelist.net/images/anime/10/78745.jpg',
        'https://cdn.myanimelist.net/images/anime/3/75178.jpg',
        'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
        'https://cdn.myanimelist.net/images/anime/1813/109223.jpg',
        'https://cdn.myanimelist.net/images/anime/1988/139504.jpg',
        'https://cdn.myanimelist.net/images/anime/1987/139505.jpg'
      ];
      const img = document.createElement('img');
      img.src = imgSrcs[idx % imgSrcs.length];
      img.alt = title;
      const span = document.createElement('span');
      span.textContent = title;
      li.appendChild(img);
      li.appendChild(span);
      li.style.cursor = 'pointer';
      li.addEventListener('click', function() {
        window.location.href = `collection.html?title=${encodeURIComponent(title)}`;
      });
      popularList.appendChild(li);
    });
  }

  // --- Accessible Menu Logic ---
  const menuBtn = document.getElementById('menu-btn');
  const searchMenuBtn = document.getElementById('search-menu-btn');
  const menuOverlay = document.getElementById('accessible-menu-overlay');
  const menu = document.getElementById('accessible-menu');
  const menuClose = document.getElementById('menu-close');
  const menuSearchSection = document.getElementById('menu-search-section');
  const menuNavSection = document.getElementById('menu-nav-section');
  const menuPopularSection = document.getElementById('menu-popular-section');

  function openMenu(focusSearch) {
    menuOverlay.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuOverlay.style.pointerEvents = 'auto';
    if (focusSearch && menuSearchSection) {
      setTimeout(function() {
        var input = menuSearchSection.querySelector('input, select, button');
        if (input) { input.focus(); }
        else { menu.focus(); }
      }, 100);
    } else {
      menu.focus();
    }
  }

  menuBtn.onclick = function() {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      menuOverlay.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuOverlay.style.pointerEvents = 'none';
    } else {
      openMenu(true);
    }
  };

  menuClose.onclick = function() {
    menuOverlay.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuOverlay.style.pointerEvents = 'none';
  };

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInside = menuOverlay.contains(event.target) || menuBtn.contains(event.target);
    if (!isClickInside) {
      menuOverlay.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuOverlay.style.pointerEvents = 'none';
    }
  });

  // Fill accessible menu with content
  function fillAccessibleMenu() {
    // Fill search section
    if (menuSearchSection) {
      menuSearchSection.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
          <span style="font-size:1.2rem;">🇺🇸</span>
          <select style="padding:0.3rem 0.7rem;border-radius:6px;">
            <option>EN</option>
            <option>JP</option>
          </select>
          <button style="background:none;border:none;cursor:pointer;font-size:1rem;">Register</button>
          <button style="background:none;border:none;cursor:pointer;font-size:1rem;">Login</button>
        </div>
      `;
    }
    // Fill nav section
    if (menuNavSection) {
      menuNavSection.innerHTML = `
        <ul style="list-style:none;padding:0;margin:0;">
          <li><a href="#">Home</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">Pre-Order</a></li>
          <li><a href="#">Kuji</a></li>
          <li><a href="#">Categories &#9654;</a></li>
          <li><a href="#">Search by title &#9654;</a></li>
          <li><a href="#">Point redeem</a></li>
          <li><a href="#">Articles</a></li>
        </ul>
      `;
    }
    // Fill popular section
    if (menuPopularSection) {
      menuPopularSection.innerHTML = `
        <div style="margin-top:2rem;font-size:0.95rem;color:#2563eb;">
          <a href="mailto:support@anihive-online.com" style="text-decoration:none;color:inherit;">
            <span style="font-size:1.1rem;vertical-align:middle;">✉️</span> support@anihive-online.com
          </a>
        </div>
      `;
    }
  }
  fillAccessibleMenu();

  // --- Initialize tooltips for buttons ---
  const tooltipButtons = document.querySelectorAll('[title]');
  tooltipButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerText = this.getAttribute('title');
      document.body.appendChild(tooltip);
      const rect = this.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.bottom + window.scrollY}px`;
      this._tooltip = tooltip;
    });

    button.addEventListener('mouseleave', function() {
      if (this._tooltip) {
        document.body.removeChild(this._tooltip);
        delete this._tooltip;
      }
    });

    button.addEventListener('mousemove', function(e) {
      if (this._tooltip) {
        const tooltip = this._tooltip;
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
      }
    });
  });

  // --- Accessibility enhancements ---
  const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const mainContent = document.querySelector('main');

  // Trap focus inside modal when open
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll(focusableElements)).filter(el => !el.hasAttribute('disabled'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else { // Tab
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Close modal on Esc key
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
    }
  });

  // Focus first element in menu search section when opened
  menuSearchSection.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusable = Array.from(menuSearchSection.querySelectorAll(focusableElements)).filter(el => !el.hasAttribute('disabled'));
      if (focusable.length > 0 && document.activeElement === focusable[focusable.length - 1]) {
        e.preventDefault();
        menuClose.focus();
      }
    }
  });

  // Carousel logic
  (function() {
    const images = document.querySelectorAll('.carousel-item');
    const dotsContainer = document.getElementById('carousel-dots');
    let current = 0;
    function showSlide(idx) {
      images.forEach((img, i) => img.classList.toggle('active', i === idx));
      if (dotsContainer) {
        Array.from(dotsContainer.children).forEach((dot, i) => dot.classList.toggle('active', i === idx));
      }
      current = idx;
    }
    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => showSlide(i));
        dotsContainer.appendChild(dot);
      });
    }
    function nextSlide() {
      showSlide((current + 1) % images.length);
    }
    if (images.length > 0) {
      createDots();
      showSlide(0);
      setInterval(nextSlide, 4000);
    }
  })();

  // Carousel logic for multiple carousels
  function setupCarousel(carouselId, dotsId, interval = 4000, isFilmRow = false) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    const images = carousel.querySelectorAll('.carousel-item');
    const dotsContainer = document.getElementById(dotsId);
    let current = 0;
    let timer;

    function showSlide(idx) {
      if (isFilmRow) {
        track.style.transform = `translateX(-${idx * 100}%)`;
        images.forEach((img, i) => img.classList.toggle('active', i === idx));
      } else {
        images.forEach((img, i) => img.classList.toggle('active', i === idx));
      }
      if (dotsContainer) {
        Array.from(dotsContainer.children).forEach((dot, i) => dot.classList.toggle('active', i === idx));
      }
      current = idx;
    }
    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          showSlide(i);
          resetTimer();
        });
        dotsContainer.appendChild(dot);
      });
    }
    function nextSlide() {
      showSlide((current + 1) % images.length);
    }
    function resetTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(nextSlide, interval);
    }
    if (images.length > 0) {
      createDots();
      showSlide(0);
      timer = setInterval(nextSlide, interval);
    }
  }

  setupCarousel('main-carousel', 'carousel-dots');
  setupCarousel('main-carousel-2', 'carousel-dots-2', 4000, true);
  setupCarousel('main-carousel-3', 'carousel-dots-3', 4000, true);

  // Hide accessible menu overlay if menu button is hidden (e.g. on desktop)
function hideMenuIfButtonHidden() {
  const menuBtn = document.getElementById('menu-btn');
  const menuOverlay = document.getElementById('accessible-menu-overlay');
  if (menuBtn && menuOverlay) {
    const btnStyle = window.getComputedStyle(menuBtn);
    if (btnStyle.display === 'none') {
      menuOverlay.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuOverlay.style.pointerEvents = 'none';
    }
  }
}
window.addEventListener('resize', hideMenuIfButtonHidden);
document.addEventListener('DOMContentLoaded', hideMenuIfButtonHidden);

// --- Dropdown Accessibility & Keyboard Navigation ---
(function() {
  const dropdownBtn = document.getElementById('categoriesDropdownBtn');
  const dropdownContent = document.getElementById('categoriesDropdownContent');
  const dropdown = document.getElementById('categories-dropdown');
  if (!dropdownBtn || !dropdownContent || !dropdown) return;

  // Only allow keyboard open (Enter/Down/Space), not click
  dropdownBtn.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dropdownContent.style.display = 'flex';
      dropdownBtn.setAttribute('aria-expanded', 'true');
      // Focus first item
      const firstItem = dropdownContent.querySelector('.dropdown-sub');
      if (firstItem) firstItem.focus();
    }
  });

  // Keyboard: close dropdown on Escape
  dropdownContent.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdownContent.style.display = 'none';
      dropdownBtn.setAttribute('aria-expanded', 'false');
      dropdownBtn.focus();
    }
    // Arrow navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      let next = document.activeElement.nextElementSibling;
      while (next && !next.classList.contains('dropdown-sub')) next = next.nextElementSibling;
      if (next) next.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let prev = document.activeElement.previousElementSibling;
      while (prev && !prev.classList.contains('dropdown-sub')) prev = prev.previousElementSibling;
      if (prev) prev.focus();
    }
  });

  // Mouse: close dropdown when tabbing out
  dropdownContent.addEventListener('focusout', function(e) {
    setTimeout(() => {
      if (!dropdown.contains(document.activeElement)) {
        dropdownContent.style.display = '';
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    }, 0);
  });

  // Mouse: open/close handled by CSS :hover/:focus-within
  // Ensure aria-expanded is correct
  dropdown.addEventListener('mouseenter', function() {
    dropdownBtn.setAttribute('aria-expanded', 'true');
  });
  dropdown.addEventListener('mouseleave', function() {
    dropdownBtn.setAttribute('aria-expanded', 'false');
    // Hide dropdownContent if it was shown by keyboard
    dropdownContent.style.display = '';
  });
})();

// --- Scroll-to-top button logic ---
(function() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (!scrollBtn) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 120) {
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
  scrollBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// --- Cart icon badge and total logic ---
function updateCartIcon() {
  const cartBadge = document.getElementById('cart-badge');
  const cartTotal = document.getElementById('cart-total');
  const cartIcon = document.getElementById('cart-icon');
  const cartIconContainer = document.getElementById('cart-icon-container');
  let itemCount = cart.length;
  let totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);
  // Show badge if items exist
  if (itemCount > 0) {
    cartBadge.textContent = itemCount;
    cartBadge.style.display = 'flex';
    cartTotal.textContent = '฿' + totalAmount.toLocaleString();
    cartTotal.style.display = 'inline-block';
    cartIcon.style.cursor = 'pointer';
    cartIconContainer.onclick = openCartModal;
  } else {
    cartBadge.style.display = 'none';
    cartTotal.style.display = 'none';
    cartIcon.style.cursor = 'default';
    cartIconContainer.onclick = null;
  }
}

// On page load, initialize cart icon state
window.addEventListener('DOMContentLoaded', function() {
  updateCartIcon();
});

// Carousel sliding logic for all carousels
function setupCarousel(carouselId, dotsId, interval = 3500, showDots = true) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const items = track.querySelectorAll('.carousel-item');
  const dots = (showDots && dotsId) ? document.getElementById(dotsId) : null;
  let current = 0;
  function show(idx) {
    items.forEach((img, i) => img.classList.toggle('active', i === idx));
    if (dots) {
      Array.from(dots.children).forEach((dot, i) => dot.classList.toggle('active', i === idx));
    }
  }
  function next() {
    current = (current + 1) % items.length;
    show(current);
  }
  // Dots
  if (dots) {
    dots.innerHTML = '';
    items.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => { current = i; show(current); };
      dots.appendChild(dot);
    });
  } else if (dotsId) {
    // Hide dots container if not showing dots
    const dotsElem = document.getElementById(dotsId);
    if (dotsElem) dotsElem.style.display = 'none';
  }
  show(current);
  setInterval(next, interval);
}
window.addEventListener('DOMContentLoaded', function() {
  setupCarousel('main-carousel', 'carousel-dots', 4000, true);
  setupCarousel('main-carousel-2', 'carousel-dots-2', 3500, false);
  setupCarousel('main-carousel-3', 'carousel-dots-3', 3500, false);
});

window.addEventListener('scroll', function() {
  var productModal = document.getElementById('product-modal');
  if (productModal && productModal.classList.contains('active')) {
    productModal.classList.remove('active');
  }
});