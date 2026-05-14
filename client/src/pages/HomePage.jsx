// src/pages/HomePage.jsx
import HeroSection from "../components/layout/HeroSection";
import SEO from "../components/SEO";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <SEO
        title={null}
        description="Unilancer is the ultimate freelance marketplace for university students and alumni. Find gigs, post jobs, hire student developers, and build your career on campus."
        path="/"
        breadcrumbs={[{ name: "Home", path: "/" }]}
      />
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
};

export default HomePage;
