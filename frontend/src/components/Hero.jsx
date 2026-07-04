function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-icon">⚡</span>
          <span>Built on Stellar Blockchain</span>
        </div>
        <h1 className="hero-title">
          Split Expenses,
          <span className="hero-title-gradient"> Not Friendships</span>
        </h1>
        <p className="hero-subtitle">
          A decentralized expense splitting platform that makes settling up 
          with friends simple, transparent, and instant using the power of Stellar.
        </p>
        <div className="hero-features">
          <div className="feature-badge">
            <span className="badge-emoji">🔒</span>
            <span>Secure & Decentralized</span>
          </div>
          <div className="feature-badge">
            <span className="badge-emoji">⚡</span>
            <span>Instant Settlements</span>
          </div>
          <div className="feature-badge">
            <span className="badge-emoji">💎</span>
            <span>Low Transaction Fees</span>
          </div>
        </div>
      </div>
      <div className="hero-illustration">
        <div className="floating-card card-1">💰</div>
        <div className="floating-card card-2">🤝</div>
        <div className="floating-card card-3">✨</div>
      </div>
    </div>
  );
}

export default Hero;
