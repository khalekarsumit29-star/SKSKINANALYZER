import { useState } from 'react';
import { Star, Droplets, Sun, Zap, Leaf, Search, ExternalLink, Sparkles, Filter, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  suitable_for: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  url: string;
  badge?: string;
}

const DERMACO_PRODUCTS: Product[] = [
  {
    id: 1, name: '1% Salicylic Acid Gel Face Wash', category: 'Cleanser',
    suitable_for: 'Oily, Acne-Prone', price: '₹349', rating: 4.5, reviews: 12400,
    description: 'Daily gel face wash with salicylic acid that gently exfoliates, unclogs pores and prevents acne breakouts.',
    image: 'https://thedermaco.com/media/catalog/product/1/_/1_salicylic_acid_gel_face_wash_-_200ml.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=salicylic+acid+gel+face+wash', badge: 'Bestseller'
  },
  {
    id: 2, name: '2% Salicylic Acid Serum', category: 'Serum',
    suitable_for: 'Oily, Acne-Prone', price: '₹599', rating: 4.4, reviews: 9800,
    description: 'Concentrated serum that targets active acne, blackheads and whiteheads with 2% salicylic acid.',
    image: 'https://thedermaco.com/media/catalog/product/2/_/2_salicylic_acid_face_serum_-_30ml.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=salicylic+acid+serum'
  },
  {
    id: 3, name: '1% Hyaluronic Acid Sunscreen SPF 50', category: 'Sunscreen',
    suitable_for: 'All', price: '₹499', rating: 4.6, reviews: 18200,
    description: 'Lightweight SPF 50 PA++++ sunscreen infused with hyaluronic acid for sun protection with hydration.',
    image: 'https://thedermaco.com/media/catalog/product/h/a/ha_sunscreen_aqua_gel_-_80g.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=hyaluronic+acid+sunscreen', badge: 'Bestseller'
  },
  {
    id: 4, name: '10% Vitamin C Serum', category: 'Serum',
    suitable_for: 'Pigmentation, Dull Skin', price: '₹599', rating: 4.3, reviews: 8500,
    description: 'Brightening serum with pure vitamin C that fades dark spots, evens skin tone and boosts radiance.',
    image: 'https://thedermaco.com/media/catalog/product/1/0/10_vitamin_c_face_serum_-_30ml.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=vitamin+c+serum'
  },
  {
    id: 5, name: '2% Niacinamide Moisturizer', category: 'Moisturizer',
    suitable_for: 'Oily, Combination', price: '₹449', rating: 4.5, reviews: 6200,
    description: 'Oil-free gel moisturizer with niacinamide to control oil production and minimize pore appearance.',
    image: 'https://thedermaco.com/media/catalog/product/2/_/2_niacinamide_gel_face_moisturizer.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=niacinamide+moisturizer'
  },
  {
    id: 6, name: '1% Retinol Face Cream', category: 'Treatment',
    suitable_for: 'Aging, Wrinkles', price: '₹699', rating: 4.2, reviews: 4100,
    description: 'Night cream with encapsulated retinol that reduces fine lines, wrinkles and improves skin texture.',
    image: 'https://thedermaco.com/media/catalog/product/1/_/1_retinol_face_cream_-_30g.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=retinol+face+cream'
  },
  {
    id: 7, name: '2% Hyaluronic Acid Serum', category: 'Serum',
    suitable_for: 'Dry, Sensitive, All', price: '₹499', rating: 4.7, reviews: 15300,
    description: 'Intense hydration serum with low and high molecular weight hyaluronic acid for plump, dewy skin.',
    image: 'https://thedermaco.com/media/catalog/product/2/_/2_hyaluronic_acid_face_serum_-_30ml.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=hyaluronic+acid+serum', badge: 'Top Rated'
  },
  {
    id: 8, name: 'AHA BHA 10% Face Wash', category: 'Cleanser',
    suitable_for: 'Oily, Combination, Acne-Prone', price: '₹349', rating: 4.4, reviews: 7900,
    description: 'Exfoliating face wash with glycolic + salicylic acid blend to unclog pores and brighten skin.',
    image: 'https://thedermaco.com/media/catalog/product/a/h/aha_bha_10_face_wash.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=aha+bha+face+wash'
  },
  {
    id: 9, name: '0.3% Ceramide Moisturizer', category: 'Moisturizer',
    suitable_for: 'Dry, Sensitive', price: '₹499', rating: 4.6, reviews: 5400,
    description: 'Rich barrier-repair moisturizer with ceramides and hyaluronic acid for dry and sensitive skin.',
    image: 'https://thedermaco.com/media/catalog/product/c/e/ceramide_moisturizer.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=ceramide+moisturizer'
  },
  {
    id: 10, name: '5% Niacinamide Serum', category: 'Serum',
    suitable_for: 'Oily, Acne-Prone, Pigmentation', price: '₹599', rating: 4.5, reviews: 11000,
    description: 'Pore-minimizing serum with niacinamide + zinc to control sebum, reduce acne marks and even skin tone.',
    image: 'https://thedermaco.com/media/catalog/product/5/_/5_niacinamide_face_serum.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=niacinamide+serum'
  },
  {
    id: 11, name: 'Cicastin 10X Repair Cream', category: 'Treatment',
    suitable_for: 'Sensitive, Dry', price: '₹549', rating: 4.3, reviews: 3200,
    description: 'SOS rescue cream with centella asiatica to calm irritation, redness and repair damaged skin barrier.',
    image: 'https://thedermaco.com/media/catalog/product/c/i/cicastin_10x_repair_cream.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=cicastin+repair+cream'
  },
  {
    id: 12, name: '1% SPF 60 Sunscreen Gel', category: 'Sunscreen',
    suitable_for: 'All, Oily', price: '₹549', rating: 4.5, reviews: 9500,
    description: 'Ultra-light gel sunscreen with SPF 60 PA++++ for maximum protection. No white cast, no greasiness.',
    image: 'https://thedermaco.com/media/catalog/product/s/p/spf_60_sunscreen_gel.jpg',
    url: 'https://thedermaco.com/catalogsearch/result/?q=spf+60+sunscreen+gel'
  },
];

const CATEGORY_ICONS: Record<string, any> = {
  Cleanser: Droplets, Moisturizer: Leaf, Treatment: Zap, Sunscreen: Sun, Serum: Sparkles,
};

const CATEGORY_GRADIENTS: Record<string, { from: string; to: string; accent: string; badge: string }> = {
  Cleanser:    { from: '#1e3a5f', to: '#0f172a', accent: '#60a5fa', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  Moisturizer: { from: '#14532d', to: '#0f172a', accent: '#34d399', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  Treatment:   { from: '#451a03', to: '#0f172a', accent: '#fbbf24', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  Sunscreen:   { from: '#431407', to: '#0f172a', accent: '#fb923c', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  Serum:       { from: '#3b0764', to: '#0f172a', accent: '#c084fc', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

const formatReviews = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

export default function Products({ user }: { user: any }) {
  const [search, setSearch]             = useState('');
  const [activeCategory, setCategory]   = useState('All');

  const skinType = (user?.skin_type || '').toLowerCase();

  // Sort: products matching user's skin type first
  const sorted = [...DERMACO_PRODUCTS].sort((a, b) => {
    const aMatch = a.suitable_for.toLowerCase().includes(skinType) || a.suitable_for === 'All' ? 1 : 0;
    const bMatch = b.suitable_for.toLowerCase().includes(skinType) || b.suitable_for === 'All' ? 1 : 0;
    return bMatch - aMatch;
  });

  const categories = ['All', ...Array.from(new Set(DERMACO_PRODUCTS.map(p => p.category)))];

  const filtered = sorted.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <h1 className="text-white" style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px' }}>Recommended Products</h1>
          <span style={{
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            color: '#34d399', fontSize: '12px', fontWeight: 700,
            padding: '6px 14px', borderRadius: '99px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Sparkles className="w-3 h-3" /> For {user?.skin_type || 'Your'} Skin
          </span>
        </div>
        <p className="text-gray-400" style={{ fontSize: '14px' }}>
          Curated products from <a href="https://thedermaco.com" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>The Derma Co</a> matched to your skin analysis.
        </p>
      </header>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '200px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#6b7280' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            style={{
              width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px',
              borderRadius: '14px', fontSize: '14px',
              background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-1)',
              outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(16,185,129,0.4)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const active = activeCategory === cat;
            const Icon = cat !== 'All' ? CATEGORY_ICONS[cat] : null;
            return (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{
                  padding: '10px 18px', borderRadius: '14px',
                  fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: active ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-surface)',
                  color: active ? '#fff' : 'var(--text-2)',
                  border: active ? 'none' : '1px solid var(--border)',
                  boxShadow: active ? '0 4px 16px rgba(16,185,129,0.3)' : 'none',
                  transform: active ? 'scale(1.03)' : 'scale(1)',
                }}>
                {Icon && <Icon style={{ width: '14px', height: '14px' }} />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
        <Filter style={{ width: '12px', height: '12px' }} />
        <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
        {skinType && <span style={{ color: '#4b5563' }}>· Sorted by relevance to {user?.skin_type} skin</span>}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div style={{
          borderRadius: '24px', padding: '60px 40px', textAlign: 'center',
          background: 'var(--bg-surface)', border: '1px solid rgba(16,185,129,0.18)',
        }}>
          <ShoppingBag style={{ width: '48px', height: '48px', color: '#374151', margin: '0 auto 16px' }} />
          <p className="text-gray-400" style={{ fontSize: '15px' }}>No products match your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
          {filtered.map((product) => {
            const grad = CATEGORY_GRADIENTS[product.category] || CATEGORY_GRADIENTS['Serum'];
            const Icon = CATEGORY_ICONS[product.category] || ShoppingBag;
            const isMatch = skinType && (product.suitable_for.toLowerCase().includes(skinType) || product.suitable_for === 'All');

            return (
              <div key={product.id}
                style={{
                  borderRadius: '20px', overflow: 'hidden',
                  border: `1px solid ${grad.accent}35`,
                  background: `linear-gradient(160deg, ${grad.from}40, ${grad.to})`,

                  display: 'flex', flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = `${grad.accent}55`;
                  e.currentTarget.style.boxShadow = `0 12px 32px ${grad.accent}20`;

                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = `${grad.accent}35`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                <div style={{
                  position: 'relative', height: '210px', overflow: 'hidden',
                  background: `linear-gradient(180deg, ${grad.from}60 0%, ${grad.to} 100%)`,
                }}>
                  <img src={product.image} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px', transition: 'transform 0.5s ease' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent, transparent)' }} />

                  {/* Category Badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-sm flex items-center gap-1 ${grad.badge}`}>
                    <Icon className="w-3 h-3" /> {product.category}
                  </span>

                  {/* Bestseller / Top Rated Badge */}
                  {product.badge && (
                    <span style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'rgba(16,185,129,0.85)', color: '#fff',
                      fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      padding: '5px 10px', borderRadius: '10px', backdropFilter: 'blur(4px)',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <Star style={{ width: '12px', height: '12px', fill: 'currentColor' }} /> {product.badge}
                    </span>
                  )}

                  {/* Skin Match */}
                  {isMatch && (
                    <span style={{
                      position: 'absolute', bottom: '12px', left: '12px',
                      background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                      color: '#6ee7b7', fontSize: '10px', fontWeight: 600,
                      padding: '5px 10px', borderRadius: '10px', backdropFilter: 'blur(4px)',
                    }}>
                      ✓ Matches your skin type
                    </span>
                  )}
                </div>

                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Name */}
                  <h3 className="text-white" style={{
                    fontSize: '15px', fontWeight: 700, lineHeight: 1.4,
                    marginBottom: '8px',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {product.name}
                  </h3>

                  {/* Rating Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} style={{
                          width: '13px', height: '13px',
                          color: i <= Math.round(product.rating) ? '#fbbf24' : '#374151',
                          fill:  i <= Math.round(product.rating) ? '#fbbf24' : 'none',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>{product.rating}</span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>({formatReviews(product.reviews)})</span>
                  </div>

                  {/* Description */}
                  <p style={{
                    color: '#9ca3af', fontSize: '13px', flex: 1,
                    marginBottom: '16px', lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{product.description}</p>

                  {/* Suitable for tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    {product.suitable_for.split(', ').map(s => (
                      <span key={s} style={{
                        fontSize: '10px', fontWeight: 600,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#9ca3af', padding: '4px 10px', borderRadius: '8px',
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <span className="text-white" style={{ fontSize: '22px', fontWeight: 800 }}>{product.price}</span>
                    <a href={product.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        padding: '10px 18px', borderRadius: '14px',
                        fontSize: '13px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.2s',
                        background: `${grad.accent}15`, border: `1px solid ${grad.accent}30`, color: grad.accent,
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${grad.accent}25`;
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = `${grad.accent}15`;
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      View <ExternalLink style={{ width: '14px', height: '14px' }} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
