const foods = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Burgers",
    price: 8.50,
    description: "Juicy beef, fresh lettuce and special sauce.",
    image: "photo-1568901346375-23c9450c58cd"
  },
  {
    id: 2,
    name: "Cheese Burger",
    category: "Burgers",
    price: 9.50,
    description: "Beef, melted cheese and crispy onions.",
    image: "photo-1572802419224-296b0aeee0d9"
  },
  {
    id: 3,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 10.00,
    description: "Tomato sauce, mozzarella and fresh basil.",
    image: "photo-1574071318508-1cdbab80d002"
  },
  {
    id: 4,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 12.00,
    description: "Classic pizza topped with pepperoni.",
    image: "photo-1628840042765-356cda07504e"
  },
  {
    id: 5,
    name: "French Fries",
    category: "Sides",
    price: 3.50,
    description: "Golden, crispy fries with a little salt.",
    image: "photo-1573080496219-bb080dd4f877"
  },
  {
    id: 6,
    name: "Chicken Wings",
    category: "Sides",
    price: 6.50,
    description: "Flavorful wings with a crispy coating.",
    image: "photo-1527477396000-e27163b481c2"
  },
  {
    id: 7,
    name: "Fresh Lemonade",
    category: "Drinks",
    price: 2.50,
    description: "Refreshing lemonade served chilled.",
    image: "photo-1513558161293-cdaf765edfd7"
  },
  {
    id: 8,
    name: "Iced Coffee",
    category: "Drinks",
    price: 3.50,
    description: "Smooth coffee served over ice.",
    image: "photo-1461023058943-07fcbe16d735"
  },
  {
    id: 9,
    name: "Double Burger",
    category: "Burgers",
    price: 11.00,
    description: "Two beef patties with cheese and sauce.",
    image: "photo-1553979459-d2229ba7433a"
  }
];

let selectedCategory = "All";
let cart = [];

const foodGrid = document.getElementById("food-grid");
const searchInput = document.getElementById("search");
const emptyMessage = document.getElementById("empty-message");

// Format prices consistently.
function money(amount) {
  return "$" + amount.toFixed(2);
}

// Build a URL for each food photo.
function imageUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=700&q=80`;
}

// Display the menu.
function renderFoods() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filteredFoods = foods.filter(food => {
    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    const matchesSearch =
      food.name.toLowerCase().includes(searchText) ||
      food.description.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  foodGrid.innerHTML = filteredFoods.map(food => `
    <article class="food-card">
      <img
        src="${imageUrl(food.image)}"
        alt="${food.name}"
        loading="lazy"
      >

      <div class="food-info">
        <h3>${food.name}</h3>
        <p>${food.description}</p>

        <div class="food-bottom">
          <span class="price">${money(food.price)}</span>
          <button class="add-btn" data-add="${food.id}">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filteredFoods.length !== 0;
}

// Search as the customer types.
searchInput.addEventListener("input", renderFoods);

// Filter by food category.
document.querySelector(".categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  selectedCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach(categoryButton => {
    categoryButton.classList.toggle(
      "active",
      categoryButton === button
    );
  });

  renderFoods();
});

// Add food to the cart.
foodGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  const id = Number(button.dataset.add);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  renderCart();
});

// Change quantity or remove cart items.
document.getElementById("cart-items").addEventListener("click", event => {
  const button = event.target.closest("button");

  if (!button) return;

  const id = Number(button.dataset.id);
  const item = cart.find(cartItem => cartItem.id === id);

  if (!item) return;

  if (button.dataset.action === "increase") {
    item.quantity++;
  }

  if (button.dataset.action === "decrease") {
    item.quantity--;

    if (item.quantity <= 0) {
      cart = cart.filter(cartItem => cartItem.id !== id);
    }
  }

  if (button.dataset.action === "remove") {
    cart = cart.filter(cartItem => cartItem.id !== id);
  }

  renderCart();
});

// Display the cart and calculate the total.
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  const countElement = document.getElementById("cart-count");
  const checkoutButton = document.getElementById("checkout-btn");

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="muted">Your cart is empty. Add something delicious!</p>';
  } else {
    cartItems.innerHTML = cart.map(item => {
      const food = foods.find(foodItem => foodItem.id === item.id);
      const subtotal = food.price * item.quantity;

      total += subtotal;
      count += item.quantity;

      return `
        <div class="cart-row">
          <div class="cart-name">
            <strong>${food.name}</strong>
            <div class="muted">${money(subtotal)}</div>
          </div>

          <div class="quantity-controls">
            <button data-action="decrease" data-id="${food.id}"
              aria-label="Decrease ${food.name} quantity">−</button>

            <span>${item.quantity}</span>

            <button data-action="increase" data-id="${food.id}"
              aria-label="Increase ${food.name} quantity">+</button>

            <button class="remove-btn" data-action="remove"
              data-id="${food.id}">Remove</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Update the total quantity and price.
  countElement.textContent = count;
  totalElement.textContent = money(total);
  checkoutButton.disabled = cart.length === 0;
}

// Demo checkout: this does not send an actual order.
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return;

  const orderSummary = cart.map(item => {
    const food = foods.find(foodItem => foodItem.id === item.id);

    return `${item.quantity} x ${food.name}`;
  }).join("\n");

  const total = cart.reduce((sum, item) => {
    const food = foods.find(foodItem => foodItem.id === item.id);

    return sum + food.price * item.quantity;
  }, 0);

  alert(
    "Demo Order\n\n" +
    orderSummary +
    "\n\nTotal: " + money(total) +
    "\n\nThis is a demonstration. No order was sent."
  );
});

// Show the menu and empty cart when the page loads.
renderFoods();
renderCart();