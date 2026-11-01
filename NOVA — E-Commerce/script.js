const products = [
  {id:1,name:"Sunday Ceramic Mug",category:"Home",price:899,tag:"BESTSELLER",desc:"A slower kind of morning",shape:"mug",orb:"#d9ddcd"},
  {id:2,name:"Form Sculptural Vase",category:"Home",price:1499,tag:"NEW",desc:"A little art for your shelf",shape:"vase",orb:"#e5d8c8"},
  {id:3,name:"Everywhere Tote",category:"Accessories",price:1199,tag:"",desc:"Room for all the little things",shape:"tote",orb:"#e8dfcc"},
  {id:4,name:"Daily Ritual Bottle",category:"Wellness",price:999,tag:"",desc:"Stay close to your water",shape:"bottle",orb:"#d5dfd2"},
  {id:5,name:"Quiet Hours Candle",category:"Wellness",price:799,tag:"LOVED",desc:"Notes of cedar and soft amber",shape:"candle",orb:"#e5ded0"},
  {id:6,name:"Soft Glow Table Lamp",category:"Home",price:2499,tag:"",desc:"A warmer way to wind down",shape:"lamp",orb:"#e7d7c2"},
  {id:7,name:"Day Off Pouch",category:"Accessories",price:699,tag:"",desc:"Your everyday little organiser",shape:"pouch",orb:"#dce2d2"},
  {id:8,name:"The Good Things Journal",category:"Accessories",price:599,tag:"NEW",desc:"Space for thoughts and plans",shape:"book",orb:"#e5d9cb"}
];
const money = n => "₹" + n.toLocaleString("en-IN");
let cart = JSON.parse(localStorage.getItem("nova-cart") || "[]");
let activeCategory = "All";
const grid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function renderProducts(){
  const term = document.getElementById("searchInput").value.trim().toLowerCase();
  const visible = products.filter(p => (activeCategory==="All" || p.category===activeCategory) &&
    (p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)));
  grid.innerHTML = visible.length ? visible.map(p => `
    <article class="product-card">
      <div class="product-image" style="--orb:${p.orb}">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <div class="object ${p.shape}"></div>
        <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button>
      </div>
      <div class="product-info"><div><h3>${p.name}</h3><p>${p.desc}</p></div><span class="price">${money(p.price)}</span></div>
    </article>`).join("") : `<div class="no-results">No pieces found. Try another search.</div>`;
}
function saveCart(){localStorage.setItem("nova-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});saveCart();toast("Added to your bag");}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartItems").innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-line"><div class="cart-thumb"><div class="object ${p.shape}"></div></div>
      <div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div><button class="remove" data-remove="${p.id}">Remove</button></div>
      <div class="line-price">${money(p.price*item.qty)}</div></div>`;
  }).join("");
  const empty=cart.length===0;
  document.getElementById("cartEmpty").style.display=empty?"block":"none";
  document.getElementById("cartFooter").style.display=empty?"none":"block";
  document.getElementById("subtotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("visible");cartDrawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("visible");cartDrawer.setAttribute("aria-hidden","true");document.body.style.overflow="";}
let toastTimer;
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200);}

document.getElementById("filters").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));renderProducts();});
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("productGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(Number(btn.dataset.add));});
document.getElementById("cartItems").addEventListener("click",e=>{
  const qty=e.target.closest("[data-qty]"), remove=e.target.closest("[data-remove]");
  if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));
  if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));saveCart();}
});
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("continueShopping").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
document.querySelector(".search-toggle").addEventListener("click",()=>{document.getElementById("searchInput").focus();document.getElementById("shop").scrollIntoView({behavior:"smooth"});});
document.getElementById("checkoutBtn").addEventListener("click",()=>toast("Demo only — connect a payment provider to accept orders."));
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();const email=document.getElementById("emailInput");document.getElementById("newsletterMessage").textContent="You're on the list — welcome to NOVA!";email.value="";});
renderProducts();renderCart();
