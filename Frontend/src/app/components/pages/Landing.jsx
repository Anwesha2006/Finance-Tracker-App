'use client';
import React, { useEffect, useState } from 'react';
import './landing.css';

export default function Landing({ onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Sticky nav shadow
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNav = (page) => {
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="spendly-landing-page">
      {/* ── NAVBAR ── */}
      <nav id="navbar" style={{ boxShadow: isScrolled ? '0 4px 40px rgba(0,0,0,0.5)' : 'none' }}>
        <a href="#" className="nav-logo">r4<span>rupee</span></a>
        
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`} id="nav-links">
          <li><a href="#features" onClick={() => setIsMenuOpen(false)}>Explore</a></li>
          <li>
            <button 
              onClick={() => handleNav('signIn')} 
              className="nav-cta"
              style={{ background: 'transparent', cursor: 'pointer' }}
            >
              Sign In
            </button>
          </li>
        </ul>
        
        <button 
          className="nav-mobile-toggle" 
          id="nav-toggle" 
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.8" strokeLinecap="round">
            <line stroke="currentColor" x1="3" y1="6"  x2="19" y2="6"/>
            <line stroke="currentColor" x1="3" y1="11" x2="19" y2="11"/>
            <line stroke="currentColor" x1="3" y1="16" x2="19" y2="16"/>
          </svg>
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow fade-up delay-1">AI-powered finance tracker</div>
          <h1 className="hero-headline fade-up delay-2">
            Know where<br/>your money<br/><em className="accent">actually</em> goes.
          </h1>
          <p className="hero-sub fade-up delay-3">
            AI-powered finance for students, hustlers &amp; first jobbers. Smart budgets, clear goals, no guilt.
          </p>
          <div className="hero-actions fade-up delay-4">
            <button onClick={() => handleNav('signIn')} className="btn-primary" style={{ border: 'none' }}>
              Start tracking free
            </button>
            <a href="#how" className="btn-ghost">Watch how it works →</a>
          </div>
        </div>

        <div className="hero-right fade-up delay-5">
          <div className="dashboard-card">
            <div className="card-header">
              <span className="card-label">Net worth</span>
              <span className="card-badge">This month</span>
            </div>
            <div className="card-balance">₹34,820</div>
            <div className="card-change">↑ ₹2,340 from last month</div>

            <div className="donut-wrap">
              <div className="donut"></div>
              <div className="donut-legend">
                <div className="legend-item"><span className="legend-dot" style={{ background: '#F5840C' }}></span> Food &amp; delivery</div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#5cc97e' }}></span> Savings</div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#4a9ddf' }}></span> Transport</div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#8b6cf5' }}></span> Others</div>
              </div>
            </div>

            <div className="txn-list">
              <div className="txn-row">
                <div className="txn-left">
                  <div className="txn-icon" style={{ background: 'rgba(245,132,12,0.15)' }}>🛵</div>
                  <div><div className="txn-name">Swiggy</div><div className="txn-cat">Food delivery</div></div>
                </div>
                <div className="txn-amount neg">−₹249</div>
              </div>
              <div className="txn-row">
                <div className="txn-left">
                  <div className="txn-icon" style={{ background: 'rgba(92,201,126,0.12)' }}>🎵</div>
                  <div><div className="txn-name">Spotify</div><div className="txn-cat">Entertainment</div></div>
                </div>
                <div className="txn-amount neg">−₹119</div>
              </div>
              <div className="txn-row">
                <div className="txn-left">
                  <div className="txn-icon" style={{ background: 'rgba(92,201,126,0.15)' }}>💼</div>
                  <div><div className="txn-name">Salary credit</div><div className="txn-cat">Income</div></div>
                </div>
                <div className="txn-amount pos">+₹18,000</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-inner" aria-hidden="true">
          <span className="ticker-item">IIT Delhi<span>✦</span></span>
          <span className="ticker-item">BITS Pilani<span>✦</span></span>
          <span className="ticker-item">Manipal<span>✦</span></span>
          <span className="ticker-item">VIT<span>✦</span></span>
          <span className="ticker-item">Christ University<span>✦</span></span>
          <span className="ticker-item">Delhi University<span>✦</span></span>
          <span className="ticker-item">Symbiosis<span>✦</span></span>
          <span className="ticker-item">NIT Trichy<span>✦</span></span>
          <span className="ticker-item">SRCC<span>✦</span></span>
          <span className="ticker-item">Jadavpur University<span>✦</span></span>
          
          <span className="ticker-item">IIT Delhi<span>✦</span></span>
          <span className="ticker-item">BITS Pilani<span>✦</span></span>
          <span className="ticker-item">Manipal<span>✦</span></span>
          <span className="ticker-item">VIT<span>✦</span></span>
          <span className="ticker-item">Christ University<span>✦</span></span>
          <span className="ticker-item">Delhi University<span>✦</span></span>
          <span className="ticker-item">Symbiosis<span>✦</span></span>
          <span className="ticker-item">NIT Trichy<span>✦</span></span>
          <span className="ticker-item">SRCC<span>✦</span></span>
          <span className="ticker-item">Jadavpur University<span>✦</span></span>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="features-header reveal">
          <div className="section-label">What you get</div>
          <h2 className="section-heading">Everything you need,<br/>nothing you don't.</h2>
          <p className="section-sub">Built for the way young India actually spends — UPI, Swiggy, Zepto, EMIs and all.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="feature-title">AI auto-categorises every spend</div>
            <p className="feature-desc">LangChain detects Swiggy, Zepto, UPI merchant names automatically. No manual tagging. Ever.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div className="feature-title">Budgets that don't nag you</div>
            <p className="feature-desc">Set once, get a gentle nudge only when it actually matters. No daily guilt trips in your notifications.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            </div>
            <div className="feature-title">Goals with a real coach</div>
            <p className="feature-desc">Tell the AI what you're saving for — trip, MacBook, emergency fund. It builds the plan and tracks your pace.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div className="feature-title">Ask it anything</div>
            <p className="feature-desc">"Where did my money go this month?" — get a real answer in plain language, not a chart you have to decode.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div className="feature-title">Irregular income? No problem</div>
            <p className="feature-desc">Freelance, stipend, part-time — Spendly adapts budgets to your actual income each month, not a fixed salary.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div className="feature-title">Private by design</div>
            <p className="feature-desc">Your data stays yours. No selling to advertisers, no bank integrations you didn't ask for. Zero-knowledge storage.</p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="how">
        <div className="reveal" style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <div className="section-label">The process</div>
          <h2 className="section-heading">Simple enough to actually stick to.</h2>
          <p className="section-sub">Three steps. No complicated setup. No linking bank accounts unless you want to.</p>
        </div>

        <div className="steps-wrap">
          <div className="step reveal">
            <div className="step-num">1</div>
            <div className="step-title">Add your transactions</div>
            <p className="step-desc">Manual entry or import from CSV. Takes 10 seconds per transaction with smart autofill. Voice input coming soon.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">2</div>
            <div className="step-title">AI makes sense of it</div>
            <p className="step-desc">LangChain automatically groups, tags, and finds patterns. Overspending in food this week? It noticed before you did.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">3</div>
            <div className="step-title">You make better decisions</div>
            <p className="step-desc">With real data and an AI coach in your corner, every rupee decision gets just a little bit easier. No guilt, just clarity.</p>
          </div>
        </div>
      </section>

      {/* ── AI SPOTLIGHT ── */}
      <section className="ai-spotlight">
        <div className="ai-grid">
          <div className="reveal">
            <div className="chat-ui">
              <div className="chat-header">
                <div className="chat-avatar">S</div>
                <div>
                  <div className="chat-name">Spendly AI</div>
                </div>
                <div className="chat-status">● Online</div>
              </div>

              <div className="msg user">
                <div className="bubble user">Where did most of my money go this month?</div>
              </div>

              <div className="msg ai">
                <div className="bubble ai">
                  <span className="ai-typing">You spent ₹4,200 on food delivery — 28% more than last month. Swiggy alone was ₹2,800. Want me to set a ₹3,000 food budget for next month?</span><span className="cursor">|</span>
                </div>
              </div>

              <div className="msg user">
                <div className="bubble user">Also, can I afford a trip to Goa in December?</div>
              </div>

              <div className="msg ai">
                <div className="bubble ai">Based on your savings rate of ₹4,500/month, you'd have ₹18,000 saved by December. A budget Goa trip is ₹12–15K. Yes, you can — and still keep your emergency fund growing. 🏖️</div>
              </div>

              <div className="ai-chips">
                <div className="ai-chip">Budget for next month</div>
                <div className="ai-chip">Save for Goa</div>
                <div className="ai-chip">Reduce food spend</div>
              </div>
            </div>
          </div>

          <div className="ai-right reveal">
            <div className="section-label">AI financial assistant</div>
            <h2 className="section-heading">Ask it anything.<br/>It knows your money.</h2>
            <p className="section-sub">
              Powered by LangChain with conversation memory — the AI actually remembers what you asked last week, your goals, your spending patterns. It's like a financial advisor who's always online.
            </p>
            <button onClick={() => handleNav('signIn')} className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', border: 'none' }}>Try the assistant free</button>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pricing" id="pricing">
        <div className="pricing-header reveal">
          <div className="section-label">Pricing</div>
          <h2 className="section-heading">Honest pricing for honest budgets.</h2>
          <p className="section-sub">No hidden charges. No "premium" features that should be basic. A plan that respects your rupee.</p>
        </div>

        <div className="pricing-grid">
          <div className="price-card reveal">
            <div className="price-plan">Free forever</div>
            <div className="price-amount"><sup>₹</sup>0<span className="period"> /month</span></div>
            <p className="price-desc">Everything you need to get started. No credit card required.</p>
            <div className="price-divider"></div>
            <ul className="price-features">
              <li>Up to 100 transactions/month</li>
              <li>3 budget categories</li>
              <li>2 savings goals</li>
              <li>Basic AI categorisation</li>
              <li>Monthly spend summary</li>
              <li className="dim">AI financial assistant</li>
              <li className="dim">Unlimited transactions</li>
              <li className="dim">Custom analytics</li>
            </ul>
            <button onClick={() => handleNav('dashboard')} className="price-cta outline" style={{ width: '100%', cursor: 'pointer' }}>Get started free</button>
          </div>

          <div className="price-card featured reveal">
            <div className="price-badge">Most popular</div>
            <div className="price-plan">Pro</div>
            <div className="price-amount"><sup>₹</sup>99<span className="period"> /month</span></div>
            <p className="price-desc">Full AI power. For people serious about their money.</p>
            <div className="price-divider"></div>
            <ul className="price-features">
              <li>Unlimited transactions</li>
              <li>Unlimited budget categories</li>
              <li>Unlimited savings goals</li>
              <li>AI auto-categorisation</li>
              <li>Full AI financial assistant</li>
              <li>Weekly + monthly AI reports</li>
              <li>Goal pace advisor</li>
              <li>CSV export &amp; data backup</li>
            </ul>
            <button onClick={() => handleNav('dashboard')} className="price-cta filled" style={{ width: '100%', cursor: 'pointer' }}>Start Pro free for 14 days</button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <div className="section-label reveal">Get started</div>
        <h2 className="section-heading reveal">Your money deserves clarity.</h2>
        <p className="section-sub reveal">Join thousands of students and young professionals who stopped wondering where their money went.</p>
        <button onClick={() => handleNav('dashboard')} className="btn-primary reveal" style={{ fontSize: '1rem', padding: '1rem 2.5rem', border: 'none', cursor: 'pointer' }}>
          Start tracking for free →
        </button>
        <div className="trust-line reveal">
          <span>No credit card</span>
          <span>Free forever plan</span>
          <span>Cancel anytime</span>
          <span>Your data is yours</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-top">
          <div>
            <a href="#" className="footer-logo">Spend<span>ly</span></a>
            <p className="footer-tagline">Know where your money actually goes.</p>
          </div>
         
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Spendly. All rights reserved.</p>
          <p className="footer-made">Made with <span>♥</span> for young India</p>
        </div>
      </footer>
    </div>
  );
}