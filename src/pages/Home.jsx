import { useEffect, useMemo, useState } from "react";
// import countries from "../data/data.json";
import Header from "../components/Header";
import Controls from "../components/Controls";
import CountryCard from "../components/CountryCard";
import arrowIcon from "../assets/images/arrow-up.svg";
import { getAllCountries } from "../data/api";

const STEP = 8;

export default function Home() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [visibleCount, setVisibleCount] = useState(STEP);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getAllCountries();
        if (!ignore) setCountries(data);
      } catch {
        if (!ignore) setError("Failed to load countries. Please try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return countries
      .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((c) => (region ? c.region === region : true));
  }, [countries, searchTerm, region]);

  useEffect(() => {
    setVisibleCount(STEP);
  }, [searchTerm, region]);

  const visibleCountries = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="page">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((p) => (p === "dark" ? "light" : "dark"))}
      />

      <main className="container main">
        <Controls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          region={region}
          setRegion={setRegion}
        />

        {loading && <p>Loading countries...</p>}
        {error && <p className="empty">{error}</p>}

        {!loading && !error && filtered.length === 0 ? (
          <p className="empty">No results found.</p>
        ) : (
          !loading &&
          !error && (
            <>
              <section className="grid">
                {visibleCountries.map((country) => (
                  <CountryCard key={country.alpha3Code} country={country} />
                ))}
              </section>

              <div className="see-more-wrap">
                {hasMore ? (
                  <button
                    className="see-more-btn"
                    onClick={() => setVisibleCount((prev) => prev + STEP)}
                  >
                    See more
                  </button>
                ) : (
                  <p className="all-loaded">All countries are shown</p>
                )}
              </div>
            </>
          )
        )}
      </main>

      {showTopBtn && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <img
            src={arrowIcon}
            alt="arrow-icon"
            aria-hidden="true"
            className="scroll-top-btn__icon"
          />
        </button>
      )}
    </div>
  );
}
