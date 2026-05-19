// ── SUPABASE CONFIG ──

const SUPABASE_URL = 'https://ozeqcmisazkczgzzxsam.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZXFjbWlzYXprY3pnenp4c2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDkyMTksImV4cCI6MjA5NDc4NTIxOX0.qumZCa8A1FPafMY7r_aX03CrKh_93SBrktAJPGBzx5s';
      
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── LOAD AND DISPLAY PRODUCTS ──
async function loadProducts() {
  const { data, error } = await db
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  if (error) {
    console.error('Supabase error:', error.message);
    grid.innerHTML = '<p style="color:#888">Could not load products.</p>';
    return;
  }

  if (!data || data.length === 0) {
    grid.innerHTML = '<p style="color:#888">No products yet.</p>';
    return;
  }

  data.forEach(product => {
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

loadProducts();