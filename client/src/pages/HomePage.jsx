// src/pages/HomePage.jsx
import HeroSection from "../components/layout/HeroSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
};

export default HomePage;
