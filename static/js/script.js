/**
 * Mariam Boutique UI - Translation functionality
 */

const translations = {
  en: {
    title: "Romaire Cosmetics",
    brand: "Romaire",
    nav_home: "Home",
    nav_shop: "Shop",
    nav_collections: "Collections",
    nav_about: "About",
    hero_badge: "Premium Beauty 2026",
    hero_title: "Embrace Your Natural Glow",
    hero_subtitle: "Discover Romaire's luxurious body oils, lip care, and premium gift sets crafted for you.",
    hero_cta: "Shop Now",
    section_trending: "Trending Products",
    product_1_title: "Romaire Lip Glow",
    product_1_price: "150 EGP",
    product_2_title: "Romaire Dry Body Oil",
    product_2_price: "350 EGP",
    product_3_title: "Soft Gift Set Box",
    product_3_price: "250 EGP",
    product_4_title: "Premium Daily Care Set",
    product_4_price: "380 EGP",
    btn_add_to_cart: "Add to Cart",
    cart_title: "Your Cart",
    cart_empty: "Your cart is empty.",
    cart_total: "Total:",
    cart_checkout: "Checkout",
    cart_view_page: "View Full Cart",
    cart_page_title: "Shopping Cart",
    cart_page_desc: "Review your selected items beautifully.",
    added_to_cart: "Added to cart!",
    checkout_page_title: "Secure Checkout",
    checkout_subtitle: "Please enter your details to complete the purchase.",
    shipping_details: "Shipping Details",
    payment_details: "Payment Method",
    f_first_name: "First Name",
    f_last_name: "Last Name",
    f_address: "Street Address",
    f_city: "City",
    f_phone: "Phone Number",
    f_card_number: "Card Number",
    f_expiry: "Expiry (MM/YY)",
    f_cvv: "CVV",
    btn_pay_now: "Pay Now",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    footer_text: "© 2026 Romaire Cosmetics. Designed with elegance.",
    toggle_lang: "عربي",
    admin_title: "Admin Dashboard - Romaire",
    nav_admin: "Admin",
    admin_welcome: "Welcome back, Admin",
    admin_subtitle: "Manage your orders and fulfillments here.",
    tab_orders: "Orders",
    tab_packaged: "Packaged",
    tab_done: "Done",
    panel_new_orders: "New Orders",
    panel_packaged: "Ready for Shipping",
    panel_done: "Completed Orders",
    btn_mark_packaged: "Packaged",
    btn_mark_done: "Done"
  },
  ar: {
    title: "مستحضرات روماير",
    brand: "روماير",
    nav_home: "الرئيسية",
    nav_shop: "تسوق",
    nav_collections: "المجموعات",
    nav_about: "عن العلامة",
    hero_badge: "عناية فاخرة 2026",
    hero_title: "تألقي بجمالك الطبيعي",
    hero_subtitle: "اكتشفي مجموعة روماير الفاخرة لزيوت الجسم، العناية بالشفاه، وهدايا مميزة صممت خصيصاً لكِ.",
    hero_cta: "تسوقي الآن",
    section_trending: "المنتجات الأكثر رواجاً",
    product_1_title: "مرطب شفاه روماير جلو",
    product_1_price: "150 ج.م",
    product_2_title: "زيت جاف لامع للجسم",
    product_2_price: "350 ج.م",
    product_3_title: "بوكس عيديّة لطيفة",
    product_3_price: "250 ج.م",
    product_4_title: "بوكس دلعك اليومي",
    product_4_price: "380 ج.م",
    btn_add_to_cart: "أضف للسلة",
    cart_title: "سلة التسوق",
    cart_empty: "سلة التسوق فارغة.",
    cart_total: "المجموع الكلي:",
    cart_checkout: "إتمام الشراء",
    cart_view_page: "عرض السلة",
    cart_page_title: "سلة المشتريات",
    cart_page_desc: "راجعي جميع العناصر المختارة قبل الشراء بأناقة.",
    added_to_cart: "تم الإضافة للسلة بنجاح!",
    checkout_page_title: "الدفع الآمن",
    checkout_subtitle: "يرجى إدخال تفاصيلك لإكمال عملية الشراء.",
    shipping_details: "تفاصيل الشحن",
    payment_details: "طريقة الدفع",
    f_first_name: "الاسم الأول",
    f_last_name: "اسم العائلة",
    f_address: "عنوان الشارع",
    f_city: "المدينة",
    f_phone: "رقم الهاتف",
    f_card_number: "رقم البطاقة",
    f_expiry: "تاريخ الانتهاء",
    f_cvv: "رمز الأمان",
    btn_pay_now: "ادفع الآن",
    order_summary: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    free: "مجاني",
    footer_text: "© 2026 روماير للتجميل. صُممت بأناقة.",
    toggle_lang: "EN",
    admin_title: "لوحة تحكم المشرف - روماير",
    nav_admin: "المشرف",
    admin_welcome: "مرحباً بعودتك، أيها المشرف",
    admin_subtitle: "إدارة طلباتك وتلبيتها هنا.",
    tab_orders: "الطلبات",
    tab_packaged: "مغلفة",
    tab_done: "منجزة",
    panel_new_orders: "طلبات جديدة",
    panel_packaged: "جاهزة للشحن",
    panel_done: "الطلبات المكتملة",
    btn_mark_packaged: "تغليف",
    btn_mark_done: "إنجاز"
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  
  // Set text direction securely and automatically switches typography via CSS
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
  
  // Find all elements with a translation key and update their text
  const i18nElements = document.querySelectorAll('[data-i18n]');
  i18nElements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang][key]) {
      element.innerText = translations[lang][key];
    }
  });

  // Optional: Update font weight scaling for Arabic since weights differ slightly from English fonts
  if (lang === 'ar') {
    document.documentElement.style.setProperty('--font-weight-bold', '600');
  } else {
    document.documentElement.style.setProperty('--font-weight-bold', '700');
  }
}

// Event listener for the toggle button
document.getElementById('lang-toggle').addEventListener('click', () => {
  const newLang = currentLang === 'en' ? 'ar' : 'en';
  
  // Optional cool visual transition when changing language
  document.body.style.opacity = '0.5';
  setTimeout(() => {
    setLanguage(newLang);
    document.body.style.opacity = '1';
  }, 150);
});

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  
  // Glassmorphism scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if(navbar) {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        navbar.style.padding = '0.5rem 0';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '1rem 0';
      }
    }
  });

  // Attach event listeners to Add to Cart buttons
  const addBtns = document.querySelectorAll('.add-to-cart-btn');
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const b = e.currentTarget;
      flyToCartAnimation(b);
      addToCart(
        b.getAttribute('data-id'),
        b.getAttribute('data-title-key'),
        parseFloat(b.getAttribute('data-price')),
        b.getAttribute('data-img')
      );
    });
  });

  // Sidebar toggle logic
  const openBtn = document.getElementById('open-cart-btn');
  const closeBtn = document.getElementById('close-cart');
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  
  if(openBtn && closeBtn && sidebar && overlay) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });
    const closeCart = () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    };
    closeBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
  }

  updateCartUI();
});

// --- Cart Logic ---
let cart = JSON.parse(localStorage.getItem('mariam_cart')) || [];

function saveCart() {
  localStorage.setItem('mariam_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, titleKey, price, img) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, titleKey, price, img, quantity: 1 });
  }
  saveCart();
  showToast(translations[currentLang].added_to_cart);
  
  // Bump animation on cart icon
  const badge = document.getElementById('cart-count-badge');
  if(badge) {
    badge.classList.remove('bump');
    void badge.offsetWidth; // trigger reflow
    badge.classList.add('bump');
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function updateCartUI() {
  const container = document.getElementById('cart-items-container');
  const badge = document.getElementById('cart-count-badge');
  const totalEl = document.getElementById('cart-total-price');
  const fullCartContainer = document.getElementById('full-cart-container');
  
  let totalQty = 0;
  let totalPrice = 0;
  
  cart.forEach(item => {
    totalQty += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  // Update Slidebar UI
  if (container) {
    if (cart.length === 0) {
      container.innerHTML = `<div class="empty-cart" data-i18n="cart_empty">${translations[currentLang].cart_empty}</div>`;
    } else {
      container.innerHTML = '';
      cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <img src="${item.img}" alt="Product">
          <div class="cart-item-details">
            <div class="cart-item-title" data-i18n="${item.titleKey}">${translations[currentLang][item.titleKey] || item.titleKey}</div>
            <div class="cart-item-price">${item.price.toFixed(2)} EGP</div>
            <div style="font-size: 0.85rem; color: var(--c-text-light);">Qty: ${item.quantity}</div>
          </div>
          <div class="cart-item-actions">
            <button class="icon-btn remove-btn" onclick="removeFromCart('${item.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6L17 21a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
            </button>
          </div>
        `;
        container.appendChild(itemEl);
      });
    }
  }

  // Update Full Cart Page UI
  if (fullCartContainer) {
    if (cart.length === 0) {
      fullCartContainer.innerHTML = `<div class="empty-cart" style="font-size:1.5rem; padding: 4rem;" data-i18n="cart_empty">${translations[currentLang].cart_empty}</div>`;
    } else {
       let html = `<div style="display:flex; flex-direction:column; gap:1.5rem;">`;
       cart.forEach(item => {
         html += `
          <div class="cart-item glass cart-line-item">
             <img src="${item.img}" alt="product">
             <div class="cart-line-details">
                <h3 data-i18n="${item.titleKey}">${translations[currentLang][item.titleKey] || item.titleKey}</h3>
                <p class="money">${item.price.toFixed(2)} EGP</p>
             </div>
             <div class="cart-line-actions">
                <span class="qty">Qty: ${item.quantity}</span>
                <button class="icon-btn remove-btn" onclick="removeFromCart('${item.id}')">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6L17 21a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
             </div>
          </div>
         `;
       });
       html += `</div>
       <div style="margin-top:3rem; padding-top:2rem; border-top:1px solid var(--glass-border); display:flex; justify-content:space-between; align-items:center;">
         <h2 style="font-size:1.8rem; color:var(--c-primary);"><span data-i18n="cart_total">${translations[currentLang].cart_total}</span> ${totalPrice.toFixed(2)} EGP</h2>
         <button class="btn-primary" style="font-size:1.1rem; padding: 1rem 2rem;" onclick="window.location.href='checkout.html'" data-i18n="cart_checkout">${translations[currentLang].cart_checkout}</button>
       </div>`;
       fullCartContainer.innerHTML = html;
    }
  }
  
  // Checkout Page Rendering
  const checkoutItems = document.getElementById('checkout-summary-items');
  const checkoutSub = document.getElementById('checkout-subtotal');
  const checkoutTot = document.getElementById('checkout-total');
  
  if (checkoutItems && checkoutSub && checkoutTot) {
      checkoutItems.innerHTML = '';
      if(cart.length === 0) {
          checkoutItems.innerHTML = `<p style="text-align:center; color: var(--c-text-light); padding: 2rem 0;">Your cart is empty.</p>`;
      } else {
          cart.forEach(item => {
              const row = document.createElement('div');
              row.className = 'summary-item-row';
              row.innerHTML = `
                 <img src="${item.img}">
                 <div class="summary-details">
                    <span class="title" data-i18n="${item.titleKey}">${translations[currentLang][item.titleKey] || item.titleKey}</span>
                    <span class="qty">x${item.quantity}</span>
                 </div>
                 <span class="price">${(item.price * item.quantity).toFixed(2)} EGP</span>
              `;
              checkoutItems.appendChild(row);
          });
      }
      checkoutSub.innerText = `${totalPrice.toFixed(2)} EGP`;
      checkoutTot.innerText = `${totalPrice.toFixed(2)} EGP`;
  }
  
  // Update Header Badges & Totals
  if (badge) {
    badge.innerText = totalQty;
    if (totalQty > 0) badge.style.display = 'flex';
    else badge.style.display = 'none';
  }
  // Mobile badges across pages
  document.querySelectorAll('.cart-badge').forEach(el => {
      if(el.id !== 'cart-count-badge') { // update all mobile badges
          el.innerText = totalQty;
          if (totalQty > 0) el.style.display = 'flex';
          else el.style.display = 'none';
      }
  });
  if (totalEl) {
    totalEl.innerText = `${totalPrice.toFixed(2)} EGP`;
  }
}

// Toast notification function
function showToast(message) {
  const container = document.getElementById('toast-container');
  if(!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" stroke-width="3" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Override setLanguage to also update cart UI bindings
const originalSetLanguage = setLanguage;
setLanguage = function(lang) {
  originalSetLanguage(lang);
  updateCartUI(); // re-render cart to update product titles and phrases dynamically
};

// Fly to cart animation
function flyToCartAnimation(btnEl) {
  const card = btnEl.closest('.product-card') || btnEl.closest('.cart-item');
  if (!card) return;
  const originalImg = card.querySelector('img');
  if (!originalImg) return;
  
  const clone = originalImg.cloneNode(true);
  const rect = originalImg.getBoundingClientRect();
  
  clone.style.position = 'fixed';
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.zIndex = '9999';
  clone.style.transition = 'left 0.8s ease-in, top 0.8s ease-out, width 0.8s ease, height 0.8s ease, opacity 0.8s ease, transform 0.8s ease';
  clone.style.borderRadius = '15px';
  clone.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
  clone.style.opacity = '0.9';
  clone.style.objectFit = 'cover';
  clone.style.pointerEvents = 'none';
  
  document.body.appendChild(clone);
  
  let cartBtn = document.getElementById('open-cart-btn');
  if (!cartBtn) { 
    // Fallback if we are on cart.html page where the ID might just be cart-btn class
    cartBtn = document.querySelector('.cart-btn'); 
  }
  if (!cartBtn) { clone.remove(); return; }
  
  const cartRect = cartBtn.getBoundingClientRect();
  
  requestAnimationFrame(() => {
    clone.style.top = `${cartRect.top + 10}px`;
    clone.style.left = `${cartRect.left + 10}px`;
    clone.style.width = '20px';
    clone.style.height = '20px';
    clone.style.opacity = '0.1';
    clone.style.transform = 'scale(0.2)';
  });
  
  setTimeout(() => clone.remove(), 800);
}

// Admin Dashboard Logic
function initAdminDashboard() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const panels = document.querySelectorAll('.admin-panel');

  if (tabBtns.length === 0 || panels.length === 0) return;

  // Tab switching logic
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked tab
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-target');
      
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.style.display = 'block';
          // Trigger animation
          panel.classList.remove('mac-os-open');
          void panel.offsetWidth; // Reflow
          panel.classList.add('mac-os-open');
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  // Setup initial buttons
  setupOrderButtons();
}

function setupOrderButtons() {
  const packageBtns = document.querySelectorAll('.btn-package');
  const doneBtns = document.querySelectorAll('.btn-done');

  packageBtns.forEach(btn => {
    // Prevent multiple bindings
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";
    
    btn.addEventListener('click', (e) => {
      const orderCard = e.target.closest('.order-card');
      const packagedList = document.getElementById('packaged-orders-list');
      
      if (orderCard && packagedList) {
        // Change button to Done
        e.target.classList.remove('btn-package');
        e.target.classList.add('btn-done');
        e.target.setAttribute('data-i18n', 'btn_mark_done');
        e.target.innerText = translations[currentLang]?.btn_mark_done || "Done";
        
        // Move to packaged list
        packagedList.appendChild(orderCard);
        
        // Re-bind the new Done button logic for this card
        e.target.dataset.bound = "false";
        setupOrderButtons();
        
        showToast("Order moved to Packaged!");
      }
    });
  });

  doneBtns.forEach(btn => {
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";
    
    btn.addEventListener('click', (e) => {
      const orderCard = e.target.closest('.order-card');
      const doneList = document.getElementById('done-orders-list');
      
      if (orderCard && doneList) {
        // Remove button completely or disable it
        e.target.remove();
        
        // Move to done list
        doneList.appendChild(orderCard);
        showToast("Money taken, order completed!");
      }
    });
  });
}
