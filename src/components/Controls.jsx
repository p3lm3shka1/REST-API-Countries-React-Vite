import { useEffect, useRef, useState } from "react";

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function Controls({
  searchTerm,
  setSearchTerm,
  region,
  setRegion,
}) {
  const [open, setOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!filterRef.current) return;

      const clickedInside = filterRef.current.contains(e.target);
      if (!clickedInside) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <section className="controls">
      <div className="search">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter" ref={filterRef}>
        <button
          type="button"
          className="filter__trigger"
          onClick={() => setOpen((s) => !s)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span>{region || "Filter by Region"}</span>
        </button>

        {open && (
          <ul className="filter__menu" role="listbox">
            {regions.map((r) => (
              <li key={r}>
                <button
                  type="button"
                  onClick={() => {
                    setRegion(r);
                    setOpen(false);
                  }}
                >
                  {r}
                </button>
              </li>
            ))}

            <li>
              <button
                type="button"
                onClick={() => {
                  setRegion("");
                  setOpen(false);
                }}
              >
                All regions
              </button>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}
