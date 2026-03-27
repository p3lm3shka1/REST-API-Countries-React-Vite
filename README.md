# Frontend Mentor - REST Countries API with Color Theme Switcher Solution

This is my solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca).

Frontend Mentor challenges help improve coding skills by building realistic projects.

In this version, I use real **GET requests** to the Rest Countries API (instead of local `data.json`) and **React Router** for page navigation.

---

## Features

- **Light / Dark theme switcher**
  - Theme is saved in `localStorage`
  - Theme is applied via `data-theme` on the root element

- **Countries list page**
  - Country cards with:
    - flag
    - name
    - population
    - region
    - capital

- **Search by country name**
- **Filter by region**
- **"See more" pagination**
- **Scroll-to-top button**
- **Country details page**
- **Border countries navigation**
- **Responsive layout**

---

## API Usage

The app fetches live data from [https://restcountries.com](https://restcountries.com):

- `GET /v3.1/all` — load all countries for the home page
- `GET /v3.1/alpha/{code}` (or `GET /v3.1/alpha?codes=`) — load details for a selected country
- Border countries are resolved using country codes from API response

---

## Routing

I used **react-router-dom** for navigation:

- `/` → Home page (countries list)
- `/country/:code` → Details page for selected country

---

## Tech Stack

- **React** (Vite)
- **React Router DOM**
- **SCSS (Sass)**
- **REST Countries API** (live GET requests)

---

## Project Structure

```bash
src/
  assets/
    images/
      arrow-up.svg
      moon.svg
      sun-2.svg

  components/
    Header.jsx
    Controls.jsx
    CountryCard.jsx
    Footer.jsx

  pages/
    Home.jsx
    Details.jsx

  styles/
    _variables.scss
    _theme.scss
    _base.scss
    _home.scss
    _details.scss
    _footer.scss
    styles.scss

  api.js
  utils.js
  App.jsx
  main.jsx
```

---

## Author

- GitHub: [p3lm3shka1](https://github.com/p3lm3shka1)
- Frontend Mentor: [p3lm3shka1](https://www.frontendmentor.io/profile/p3lm3shka1)
- REST Counties: [RESTCount](https://restcountries.com/)
