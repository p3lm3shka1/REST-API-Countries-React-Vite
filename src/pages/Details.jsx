import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import countries from "../data/data.json";
import Header from "../components/Header";
import {
  formatPopulation,
  getCurrencies,
  getLanguages,
  getNativeName,
} from "../utils";
import { getBorderCountriesByCodes, getCountryByCode } from "../data/api";

export default function Details() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    let ignore = false;

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");

        const c = await getCountryByCode(code);
        if (!c) throw new Error("Not found");

        if (!ignore) setCountry(c);

        const borderList = await getBorderCountriesByCodes(c.borders || []);
        if (!ignore) setBorders(borderList);
      } catch (e) {
        console.error("Details load error:", e);
        if (!ignore) setError("Failed to load country details.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      ignore = true;
    };
  }, [code]);

  const normalized = useMemo(() => {
    if (!country) return null;
    return {
      name: country.name?.common || "Unknown",
      nativeName: getNativeName(country),
      population: country.population || 0,
      region: country.region || "—",
      subregion: country.subregion || "—",
      capital: country.capital?.[0] || "—",
      topLevelDomain: country.tld || [],
      currencies: getCurrencies(country),
      languages: getLanguages(country),
      flag: country.flags?.png || country.flags?.svg || "",
    };
  }, [country]);

  return (
    <div className="page">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((p) => (p === "dark" ? "light" : "dark"))}
      />

      <main className="container details">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {loading && <p>Loading country...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && normalized && (
          <section className="details__content">
            <img
              src={normalized.flag}
              alt={normalized.name}
              className="details__flag"
            />

            <div>
              <h2>{normalized.name}</h2>

              <div className="details__cols">
                <div>
                  <p>
                    <strong>Native Name:</strong> {normalized.nativeName}
                  </p>
                  <p>
                    <strong>Population:</strong>{" "}
                    {formatPopulation(normalized.population)}
                  </p>
                  <p>
                    <strong>Region:</strong> {normalized.region}
                  </p>
                  <p>
                    <strong>Sub Region:</strong> {normalized.subregion}
                  </p>
                  <p>
                    <strong>Capital:</strong> {normalized.capital}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Top Level Domain:</strong>{" "}
                    {normalized.topLevelDomain.join(", ") || "—"}
                  </p>
                  <p>
                    <strong>Currencies:</strong> {normalized.currencies}
                  </p>
                  <p>
                    <strong>Languages:</strong> {normalized.languages}
                  </p>
                </div>
              </div>

              <div className="borders">
                <strong>Border Countries:</strong>
                <div className="borders__list">
                  {borders.length ? (
                    borders.map((b) => (
                      <Link
                        key={b.cca3}
                        to={`/country/${b.cca3}`}
                        className="pill"
                      >
                        {b.name?.common}
                      </Link>
                    ))
                  ) : (
                    <span>None</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
