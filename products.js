// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://ozeqcmisazkczgzzxsam.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZXFjbWlzYXprY3pnenp4c2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDkyMTksImV4cCI6MjA5NDc4NTIxOX0.qumZCa8A1FPafMY7r_aX03CrKh_93SBrktAJPGBzx5s';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── STATE ──
let allProducts = [];
let activeCategory = 'All';

// ── LOAD PRODUCTS ──
async function loadProducts() {
  const { data, error } = await db
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const grid = document.getElementById('products-grid');

  if (error) {
    console.error('Supabase error:', error.message);
    grid.innerHTML = '<p style="color:#888">Could not load products.</p>';
    return;
  }

  if (!data || data.length === 0) {
    grid.innerHTML = '<p style="color:#888">No products yet.</p>';
    return;
  }

  allProducts = data;
  renderProducts(allProducts);
}

// ── RENDER PRODUCTS ──
function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<p style="color:#888">No products found.</p>';
    return;
  }

  products.forEach(product => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${product.image_url}" alt="${product.name}" />
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-footer">
            <span class="product-price">${Number(product.price).toLocaleString()} RWF</span>
            <a href="https://wa.me/250798871623?text=I want to order: ${encodeURIComponent(product.name)}" 
               target="_blank" class="order-btn">Order Now</a>
          </div>
        </div>
      </div>
    `;
  });
}

// ── FILTER BY CATEGORY ──
function setCategory(category) {
  activeCategory = category;

  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === category) btn.classList.add('active');
  });

  filterProducts();
}

// ── SEARCH & FILTER ──
function filterProducts() {
  const search = document.getElementById('search-input').value.toLowerCase();

  let filtered = allProducts;

  if (activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }

  renderProducts(filtered);
}

loadProducts();