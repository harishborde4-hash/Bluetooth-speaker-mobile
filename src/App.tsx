import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Leaf, X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "The Golden Truffle Symphony",
    price: 4800,
    image: "https://images.unsplash.com/photo-1607330281291-1c1b5c2e0f3b?q=80&w=2070",
    description: "Black truffle shavings, 24k gold leaf, aged balsamic pearls",
    category: "Truffle"
  },
  {
    id: 2,
    name: "Caviar & Persian Lime Reverie",
    price: 5900,
    image: "https://images.unsplash.com/photo-1540420773420-336c6f4c5e5f?q=80&w=2070",
    description: "Ossetra caviar, Persian lime zest, microgreens",
    category: "Caviar"
  },
  {
    id: 3,
    name: "Saffron & Edible Rose Ensemble",
    price: 6200,
    image: "https://images.unsplash.com/photo-1567335991483-fc607bad5c6a?q=80&w=2070",
    description: "Saffron threads, edible roses, heirloom vegetables",
    category: "Saffron"
  },
  {
    id: 4,
    name: "Wagyu Beef & Black Garlic Opus",
    price: 7500,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2070",
    description: "A5 Wagyu tataki, black garlic, 24k gold flakes",
    category: "Signature"
  },
  {
    id: 5,
    name: "White Alba Truffle & Gold Dust",
    price: 9200,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070",
    description: "Fresh Alba truffles, gold dust, preserved lemon",
    category: "Truffle"
  }
];

const journalArticles = [
  {
    title: "The Art of Foraging in the French Alps",
    excerpt: "How our foragers source the finest microgreens at 4am.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070",
    date: "March 12, 2026"
  },
  {
    title: "Inside the Kitchen of a Three-Michelin-Star Chef",
    excerpt: "A rare look into the philosophy behind our bespoke creations.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2ad8b?q=80&w=2070",
    date: "March 8, 2026"
  },
  {
    title: "The 24-Carat Packaging Revolution",
    excerpt: "Why we deliver in hand-stamped gold boxes.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2070",
    date: "March 3, 2026"
  }
];

function Navbar({ cartCount, setShowCart }: { cartCount: number; setShowCart: (show: boolean) => void }) {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/collections', label: 'Collections' },
    { path: '/bespoke', label: 'Bespoke' },
    { path: '/journal', label: 'The Journal' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-[#D4AF77]" />
          <Link to="/" className="text-2xl tracking-[4px] font-serif text-[#D4AF77]">LUXE VERDANT</Link>
        </div>

        <div className="flex items-center gap-10 text-sm tracking-widest text-white/80">
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              className={`hover:text-[#D4AF77] transition-colors ${location.pathname === link.path ? 'text-[#D4AF77]' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-xs tracking-widest border border-white/30 px-3 py-1.5 rounded-full">
            <span className="text-white/70">EN</span>
            <span className="text-white/30">|</span>
            <span className="text-white/70">FR</span>
          </div>
          
          <button className="text-white/70 hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 text-white/70 hover:text-[#D4AF77] transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#D4AF77] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-5 h-5 text-[#D4AF77]" />
            <span className="text-xl tracking-widest text-[#D4AF77]">LUXE VERDANT</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-[240px]">
            Hand-foraged ingredients. Chef-curated compositions. Delivered in 24-carat style.
          </p>
        </div>
        
        <div>
          <div className="uppercase text-xs tracking-widest text-white/50 mb-6">Shop</div>
          <div className="space-y-3 text-sm">
            <div className="text-white/70 hover:text-white cursor-pointer">Signature Collections</div>
            <div className="text-white/70 hover:text-white cursor-pointer">Seasonal Harvests</div>
            <div className="text-white/70 hover:text-white cursor-pointer">Bespoke Salads</div>
          </div>
        </div>
        
        <div>
          <div className="uppercase text-xs tracking-widest text-white/50 mb-6">Discover</div>
          <div className="space-y-3 text-sm">
            <div className="text-white/70 hover:text-white cursor-pointer">Our Farms</div>
            <div className="text-white/70 hover:text-white cursor-pointer">The Journal</div>
            <div className="text-white/70 hover:text-white cursor-pointer">Chef Collaborations</div>
          </div>
        </div>
        
        <div>
          <div className="uppercase text-xs tracking-widest text-white/50 mb-6">Connect</div>
          <div className="flex gap-6 text-white/60">
            <div>Instagram</div>
            <div>WhatsApp</div>
          </div>
          <div className="mt-12 text-[10px] text-white/30 tracking-widest">
            MUMBAI • LONDON • DUBAI
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-white/10 text-center text-[10px] tracking-[1px] text-white/30">
        © 2026 LUXE VERDANT • CARBON NEGATIVE • FOR CONNOISSEURS ONLY
      </div>
    </footer>
  );
}

function CartModal({ 
  cartItems, 
  setCartItems, 
  showCart, 
  setShowCart 
}: { 
  cartItems: CartItem[]; 
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>; 
  showCart: boolean; 
  setShowCart: (show: boolean) => void;
}) {
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.product.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  return (
    <AnimatePresence>
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/80 z-[100]" onClick={() => setShowCart(false)} />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed top-0 bottom-0 right-0 w-[480px] bg-black border-l border-white/20 z-[110] overflow-auto"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div className="text-3xl font-serif text-[#D4AF77]">Your Cart</div>
                <button onClick={() => setShowCart(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-white/30" />
                  </div>
                  <div className="text-xl text-white/70">Your cart is empty</div>
                  <div className="text-white/40 mt-3">Discover our collection of rare compositions</div>
                </div>
              ) : (
                <>
                  <div className="space-y-8">
                    {cartItems.map(item => (
                      <div key={item.product.id} className="flex gap-6 border-b border-white/10 pb-8">
                        <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-2xl" />
                        <div className="flex-1">
                          <div className="font-serif text-lg leading-tight text-white">{item.product.name}</div>
                          <div className="text-[#D4AF77] mt-1">₹{item.product.price.toLocaleString('en-IN')}</div>
                          
                          <div className="flex items-center gap-4 mt-4">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 border border-white/30 flex items-center justify-center hover:bg-white/5 text-white/70"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <div className="font-mono text-sm w-6 text-center">{item.quantity}</div>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 border border-white/30 flex items-center justify-center hover:bg-white/5 text-white/70"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-white/30 hover:text-red-400 self-start"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 border-t border-white/10 pt-8">
                    <div className="flex justify-between text-lg mb-8">
                      <div className="text-white/70">Total</div>
                      <div className="text-[#D4AF77] font-medium">₹{total.toLocaleString('en-IN')}</div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowCart(false);
                        window.location.href = '/shop'; // Could be improved with navigate
                      }}
                      className="w-full py-5 bg-[#D4AF77] text-black font-medium tracking-widest text-sm hover:bg-amber-300 transition-colors"
                    >
                      PROCEED TO CHECKOUT
                    </button>
                    
                    <div className="text-center text-[10px] text-white/40 mt-8 tracking-widest">
                      24 HOUR DELIVERY • TEMPERATURE CONTROLLED
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Page Components
function HomePage({ addToCart }: { addToCart: (product: Product) => void }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* HERO */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607330281291-1c1b5c2e0f3b?q=80&w=2070')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black"></div>
        </div>
        
        <div className="relative z-10 text-center px-8 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-[92px] leading-none font-serif tracking-[-2px] text-[#D4AF77] mb-6"
          >
            LUXE<br />VERDANT
          </motion.div>
          
          <div className="text-2xl text-white/80 font-light tracking-widest mb-12">SALADS FOR THE DISCERNING PALATE</div>
          
          <div className="flex gap-4 justify-center">
            <Link 
              to="/shop"
              className="px-16 py-5 border border-[#D4AF77] text-[#D4AF77] hover:bg-[#D4AF77] hover:text-black transition-all text-sm tracking-[2px]"
            >
              SHOP THE COLLECTION
            </Link>
            <Link 
              to="/bespoke"
              className="px-16 py-5 bg-transparent border border-white/30 hover:border-white text-sm tracking-[2px]"
            >
              CREATE BESPOKE
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs tracking-[3px] text-white/40 flex flex-col items-center gap-2">
          SCROLL TO EXPLORE
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        </div>
      </div>

      {/* SIGNATURE COLLECTIONS */}
      <div className="max-w-7xl mx-auto px-8 py-28">
        <div className="text-center mb-16">
          <div className="inline text-xs tracking-[3px] border border-[#D4AF77]/30 px-8 py-3 text-[#D4AF77]">SIGNATURE COLLECTIONS</div>
          <div className="text-6xl font-serif mt-6 text-white">Our Most Cherished Creations</div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {products.slice(0, 4).map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-zinc-950 border border-white/10 overflow-hidden"
            >
              <div className="relative h-96 overflow-hidden">
                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-all group-hover:scale-105 duration-700" />
                <div className="absolute top-6 right-6 px-5 py-1 text-xs bg-black/70 text-emerald-300 border border-emerald-900">LIMITED</div>
              </div>
              <div className="p-8">
                <div className="font-serif text-3xl text-white mb-2">{product.name}</div>
                <div className="text-[#D4AF77] text-xl">₹{product.price.toLocaleString('en-IN')}</div>
                <div className="text-white/60 text-sm mt-3 line-clamp-2">{product.description}</div>
                
                <button 
                  onClick={() => addToCart(product)}
                  className="mt-8 w-full py-4 text-xs tracking-widest border border-white/30 hover:bg-white hover:text-black transition-all"
                >
                  ADD TO CART
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ShopPage({ addToCart }: { addToCart: (product: Product) => void }) {
  const [filter, setFilter] = useState<string>("All");
  
  const categories = ["All", "Truffle", "Caviar", "Saffron", "Signature"];
  
  const filteredProducts = filter === "All" 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="pt-20 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-between items-end border-b border-white/10 pb-8">
          <div>
            <div className="uppercase text-xs tracking-widest text-emerald-300">CURATED DAILY</div>
            <div className="text-7xl font-serif text-white mt-2">The Collection</div>
          </div>
          
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-7 py-3 text-sm transition-all ${filter === cat 
                  ? 'bg-white text-black' 
                  : 'bg-transparent border border-white/20 text-white/70 hover:border-white/60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 pt-16">
          {filteredProducts.map(product => (
            <div key={product.id} className="group">
              <div className="overflow-hidden aspect-[4/3] mb-6 bg-zinc-900">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="font-serif text-2xl text-white mb-2">{product.name}</div>
              <div className="flex justify-between items-center">
                <div className="text-[#D4AF77]">₹{product.price.toLocaleString('en-IN')}</div>
                <button 
                  onClick={() => addToCart(product)}
                  className="text-xs border border-[#D4AF77] text-[#D4AF77] px-8 py-3.5 hover:bg-[#D4AF77] hover:text-black transition-all"
                >
                  ADD TO COLLECTION
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function CollectionsPage() {
  return (
    <div className="pt-20 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center">
          <div className="text-emerald-400 text-xs tracking-[4px]">EXCLUSIVE TO THE DISCERNING</div>
          <h1 className="text-7xl font-serif mt-4">Signature Collections</h1>
          <p className="max-w-md mx-auto mt-6 text-white/60">Each composition is limited to 24 servings per day.</p>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8">
          {products.map((product, i) => (
            <div key={i} className="bg-zinc-900 p-2">
              <img src={product.image} className="w-full aspect-video object-cover" alt="" />
              <div className="p-8">
                <div className="uppercase text-xs text-emerald-400 mb-3 tracking-widest">CHAPTER {String(i+1).padStart(2,'0')}</div>
                <div className="text-4xl font-serif text-white mb-4 leading-none">{product.name}</div>
                <div className="text-white/70">{product.description}</div>
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-3xl text-[#D4AF77]">₹{product.price}</div>
                  <Link to="/shop" className="text-xs border border-white/40 px-10 py-4 hover:bg-white/5">EXPLORE THIS CHAPTER →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function BespokePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const ingredients = ["Alba Truffle", "Gold Leaf", "Ossetra Caviar", "Saffron", "Wagyu Tataki", "Persian Lime", "Edible Flowers", "Black Garlic"];
  
  const toggleIngredient = (ing: string) => {
    if (selectedIngredients.includes(ing)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
    } else {
      setSelectedIngredients([...selectedIngredients, ing]);
    }
  };

  return (
    <div className="pt-20 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <div className="font-serif text-[68px] leading-none tracking-tight text-white">Curate Your Own</div>
          <div className="text-4xl text-[#D4AF77] mt-3">24-Carat Salad</div>
          <p className="text-white/60 mt-6 max-w-xs mx-auto">Select from our most treasured ingredients. Our chefs will compose your vision.</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-12">
          <div className="grid grid-cols-4 gap-4">
            {ingredients.map(ing => (
              <button
                key={ing}
                onClick={() => toggleIngredient(ing)}
                className={`h-28 border flex items-center justify-center text-center transition-all text-sm tracking-wider hover:border-[#D4AF77] ${selectedIngredients.includes(ing) ? 'border-[#D4AF77] bg-black/60' : 'border-white/20'}`}
              >
                {ing}
              </button>
            ))}
          </div>

          {selectedIngredients.length > 0 && (
            <div className="mt-12 pt-12 border-t border-white/10">
              <div className="text-xs uppercase tracking-widest text-white/50 mb-4">YOUR CREATION</div>
              <div className="flex flex-wrap gap-4">
                {selectedIngredients.map(ing => (
                  <div key={ing} className="bg-emerald-950 border border-emerald-900 px-6 py-4 text-sm text-emerald-300">{ing}</div>
                ))}
              </div>
              <button className="mt-12 px-16 py-6 bg-white text-black text-sm tracking-widest hover:bg-amber-200 transition-colors">SEND TO OUR CHEFS →</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function JournalPage() {
  return (
    <div className="pt-20 bg-[#0A0A0A] text-white">
      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <div className="text-[#D4AF77] text-sm tracking-[3px]">THE LUXE VERDANT JOURNAL</div>
          <div className="text-6xl font-light mt-6">Stories from the Source</div>
        </div>

        <div className="space-y-20">
          {journalArticles.map((article, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="grid grid-cols-12 gap-8 group"
            >
              <div className="col-span-7">
                <div className="text-xs text-white/50">{article.date}</div>
                <div className="font-serif text-5xl leading-tight mt-4 group-hover:text-[#D4AF77] transition-colors">{article.title}</div>
                <div className="mt-6 text-lg text-white/70 max-w-prose">{article.excerpt}</div>
                <div className="inline-block mt-8 border-b border-white/30 pb-1 text-xs tracking-widest cursor-pointer hover:border-white">READ THE STORY →</div>
              </div>
              <div className="col-span-5">
                <img src={article.image} className="w-full aspect-[16/13] object-cover" alt={article.title} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const location = useLocation();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    setShowCart(true);
  };

  // Close cart when changing pages
  useEffect(() => {
    setShowCart(false);
  }, [location.pathname]);

  return (
    <div className="bg-black text-white font-sans">
      <Navbar cartCount={cartCount} setShowCart={setShowCart} />
      
      <Routes>
        <Route path="/" element={<HomePage addToCart={addToCart} />} />
        <Route path="/shop" element={<ShopPage addToCart={addToCart} />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/bespoke" element={<BespokePage />} />
        <Route path="/journal" element={<JournalPage />} />
      </Routes>

      <CartModal 
        cartItems={cartItems} 
        setCartItems={setCartItems} 
        showCart={showCart} 
        setShowCart={setShowCart} 
      />
    </div>
  );
}
