const BASE_URL = "https://restcountries.com/v3.1";

async function request(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${url}`);
  }
  return res.json();
}

export function normalizeCountryForCard(c) {
  return {
    name: c.name?.common || "Unknown",
    alpha3Code: c.cca3,
    flags: { png: c.flags?.png || c.flags?.svg || "" },
    population: c.population || 0,
    region: c.region || "—",
    capital: c.capital?.[0] || "—",
  };
}

export async function getAllCountries() {
  const data = await request(
    `${BASE_URL}/all?fields=name,cca3,flags,population,region,capital`,
  );

  return data
    .map(normalizeCountryForCard)
    .filter((c) => c.alpha3Code)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCountryByCode(code) {
  try {
    const data = await request(
      `${BASE_URL}/alpha/${code}?fields=name,cca3,flags,population,region,subregion,capital,tld,currencies,languages,borders`,
    );
    return Array.isArray(data) ? data[0] : data;
  } catch {
    const data = await request(
      `${BASE_URL}/alpha?codes=${code}&fields=name,cca3,flags,population,region,subregion,capital,tld,currencies,languages,borders`,
    );
    return Array.isArray(data) ? data[0] : data;
  }
}

export async function getBorderCountriesByCodes(codes = []) {
  if (!codes.length) return [];
  const data = await request(
    `${BASE_URL}/alpha?codes=${codes.join(",")}&fields=name,cca3`,
  );
  return Array.isArray(data) ? data : [];
}
