import React from 'react';

const Home = () => {
  return (
    <div className="container page-wrapper">
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>
          Welcome to <span className="gradient-text">SnacksCart</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>
          Your premium destination for authentic namkeens, sweets, and traditional snacks delivered straight to your door.
        </p>
        <button className="btn-primary">Explore Menu</button>
      </div>
    </div>
  );
};

export default Home;
