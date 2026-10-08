const products = [
  {
    id: 1,
    name: "Sunday linen throw",
    category: "home",
    label: "HOME TEXTILES",
    price: 68,
    badge: "BEST LOVED",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=82",
    alt: "Soft neutral linen textiles in a calm living room"
  },
  {
    id: 2,
    name: "Everyday ceramic mug",
    category: "objects",
    label: "TABLE & OBJECTS",
    price: 24,
    badge: "SMALL BATCH",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=82",
    alt: "Handmade ceramic coffee mug"
  },
  {
    id: 3,
    name: "The Sunday tote",
    category: "wear",
    label: "BAGS & CARRY",
    price: 42,
    badge: "JUST IN",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=82",
    alt: "Everyday canvas tote bag"
  },
  {
    id: 4,
    name: "Soft form candle",
    category: "objects",
    label: "SCENT & SLOW LIVING",
    price: 32,
    badge: "",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=82",
    alt: "Sculptural candle on a warm neutral background"
  },
  {
    id: 5,
    name: "Ripple glass set",
    category: "home",
    label: "TABLE & OBJECTS",
    price: 38,
    badge: "SET OF TWO",
    image:
      "https://images.unsplash.com/photo-1513558161293-c0caddc450a5?auto=format&fit=crop&w=800&q=82",
    alt: "Simple glassware arranged on a table"
  },
  {
    id: 6,
    name: "Weekend market bag",
    category: "wear",
    label: "BAGS & CARRY",
    price: 56,
    badge: "MADE TO GO",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=82",
    alt: "Natural woven bag for the weekend market"
  },
  {
    id: 7,
    name: "Little olive bowl",
    category: "objects",
    label: "TABLE & OBJECTS",
    price: 29,
    badge: "MAKER FAVORITE",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=82",
    alt: "Hand-thrown pottery bowl"
  },
  {
    id: 8,
    name: "Cloud cotton robe",
    category: "wear",
    label: "SLOW MORNING",
    price: 84,
    badge: "",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=82",
    alt: "Comfortable cotton clothing in a light neutral tone"
  }
];

const grid = document.querySelector("#product-grid");
const cart = new Map();

let activeFilter = "all";
let searchQuery = "";

function renderProducts() {
  const visible = products.filter((product) => {
    const matchesFilter =
      activeFilter === "all" || product.category === activeFilter;

    const searchableText =
      `${product.name} ${product.label} ${product.category}`.toLowerCase();

    const matchesSearch = searchableText.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  if (visible.length === 0) {
    grid.innerHTML =
      '<p class="no-results">No little finds here just yet. Try another search.</p>';
    return;
  }

  grid.innerHTML = visible
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrap">
            <img
              class="product-image"
              src="${product.image}"
              alt="${product.alt}"
              loading="lazy"
            >

            ${
              product.badge
                ? `<span class="product-badge">${product.badge}</span>`
                : ""
            }

            <button class="quick-add" data-add="${product.id}">
              Add to bag <span>＋</span>
            </button>
          </div>

          <div class="product-info">
            <div>
              <div class="product-name">${product.name}</div>
              <div class="product-category">${product.label}</div>
            </div>

            <span class="product-price">
              $${product.price.toFixed(2)}
            </span>
          </div>
        </article>
      `
    )
    .join("");
}

function updateCart() {
  const entries = [...cart.entries()];

  const count = entries.reduce(
    (sum, [, quantity]) => sum + quantity,
    0
  );

  const total = entries.reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return sum + product.price * quantity;
  }, 0);

  document.querySelector(".cart-count").textContent = count;
  document.querySelector(".drawer-count").textContent = `(${count})`;
  document.querySelector(".subtotal-amount").textContent = total.toFixed(2);

  document.querySelector(".cart-empty").style.display =
    count > 0 ? "none" : "flex";

  document.querySelector(".cart-footer").style.display =
    count > 0 ? "block" : "none";

  document.querySelector(".cart-items").innerHTML = entries
    .map(([id, quantity]) => {
      const item = products.find((product) => product.id === id);

      return `
        <div class="cart-row">
          <img src="${item.image}" alt="">

          <div>
            <div class="cart-row-name">${item.name}</div>
            <div class="cart-row-price">$${item.price.toFixed(2)}</div>

            <div class="quantity">
              <button
                data-quantity="${id}"
                data-change="-1"
                aria-label="Remove one ${item.name}"
              >−</button>

              <span>${quantity}</span>

              <button
                data-quantity="${id}"
                data-change="1"
                aria-label="Add one ${item.name}"
              >＋</button>

              <button class="remove-item" data-remove="${id}">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function setDrawer(open) {
  const drawer = document.querySelector(".cart-drawer");
  const overlay = document.querySelector(".overlay");

  drawer.classList.toggle("open", open);
  overlay.classList.toggle("visible", open);
  drawer.setAttribute("aria-hidden", String(!open));

  document.body.style.overflow = open ? "hidden" : "";
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");

  if (!button) {
    return;
  }

  const id = Number(button.dataset.add);
  cart.set(id, (cart.get(id) || 0) + 1);

  updateCart();
  setDrawer(true);
});

document.querySelector(".cart-items").addEventListener("click", (event) => {
  const id = Number(
    event.target.dataset.quantity || event.target.dataset.remove
  );

  if (!id) {
    return;
  }

  if (event.target.dataset.remove) {
    cart.delete(id);
  } else {
    const nextQuantity =
      (cart.get(id) || 0) + Number(event.target.dataset.change);

    if (nextQuantity > 0) {
      cart.set(id, nextQuantity);
    } else {
      cart.delete(id);
    }
  }

  updateCart();
});

document
  .querySelector(".cart-toggle")
  .addEventListener("click", () => setDrawer(true));

document
  .querySelector(".drawer-close")
  .addEventListener("click", () => setDrawer(false));

document
  .querySelector(".overlay")
  .addEventListener("click", () => setDrawer(false));

document
  .querySelector(".cart-empty .button")
  .addEventListener("click", () => setDrawer(false));

document
  .querySelector(".checkout-button")
  .addEventListener("click", () => {
    alert("Thanks for shopping Forma! Checkout is a demo in this storefront.");
  });

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-chip.active").classList.remove("active");
    button.classList.add("active");

    activeFilter = button.dataset.filter;
    renderProducts();
  });
});

const searchPanel = document.querySelector(".search-panel");

document.querySelector(".search-toggle").addEventListener("click", () => {
  searchPanel.classList.add("open");
  searchPanel.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    document.querySelector("#product-search").focus();
  }, 200);
});

document.querySelector(".search-close").addEventListener("click", () => {
  searchPanel.classList.remove("open");
  searchPanel.setAttribute("aria-hidden", "true");
});

document.querySelector("#product-search").addEventListener("input", (event) => {
  searchQuery = event.target.value.trim().toLowerCase();

  renderProducts();

  document.querySelector("#shop").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const nav = document.querySelector(".main-nav");
  const open = nav.classList.toggle("open");

  event.currentTarget.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.remove("open");
  });
});

document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    activeFilter = card.dataset.category;

    document.querySelectorAll(".filter-chip").forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.filter === activeFilter
      );
    });

    renderProducts();
  });
});

document
  .querySelector(".newsletter-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    document.querySelector(".form-message").textContent =
      "You’re on the list. Look out for a little note from us!";

    event.currentTarget.reset();
  });

updateCart();
renderProducts();