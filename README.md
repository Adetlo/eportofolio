# Tio Aldino · Professional ePortfolio

Source for [adetlo.github.io/eportofolio](https://adetlo.github.io/eportofolio/), the professional portfolio of
Tio Aldino, Banking Technology, Cloud & Reliability Engineering Leader (Core Banking · Payments · Data & AI · Production Systems).

Public engineering projects live on GitHub: [github.com/Adetlo](https://github.com/Adetlo).

## Structure

| Page | Content |
| --- | --- |
| `index.html` | Positioning, professional summary, domains, selected work, engineering portfolio, credentials |
| `experience.html` | Career timeline and progression |
| `projects.html` | Twenty-three banking case studies and the GitHub engineering portfolio roadmap |
| `skills.html` | Skills matrix by domain |
| `education.html` | Degrees, verified certifications and languages |
| `data-science.html` | MSc Data Science academic e-portfolio overview |
| `big-data*.html`, `machine-learning*.html`, `research-methods.html`, `RMPP_Final_Reflection.html` | MSc module e-portfolios and reflections |

## Stack

Static HTML with one shared stylesheet (`assets/css/portfolio.css`) and one script (`assets/js/portfolio.js`).
No build step, no framework. Fonts from Google Fonts (IBM Plex Sans, IBM Plex Mono, Manrope) and icons from Font Awesome 6 via cdnjs.

The stylesheet defines the design tokens (colour, type, spacing, radius, elevation, motion) for light and dark
themes; the theme follows the system preference and can be toggled from the header (persisted in `localStorage`).

## Local preview

Any static server works, for example:

```sh
npx serve .
# or
python3 -m http.server 8000
```

## Notes

- Navigation tabs: Home, Projects, Data Science, Skills, Experience, Education.
- `LICENSE.txt` is inherited from the HTML5 UP "Forty" template the site originally started from; no template code remains.
