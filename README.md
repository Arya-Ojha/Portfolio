# Arya Ojha — Portfolio

Personal portfolio website for **Arya Ojha**, an AI Engineer based in India. Features an interactive p5.js falling sand simulation as the background with a sleek dark glassmorphism design.

## 🚀 Features

- **Interactive Sand Simulation** — p5.js-powered falling sand particles that respond to mouse movement with cycling hues
- **Glassmorphism UI** — frosted glass effects with backdrop blur throughout the page
- **GSAP Animations** — smooth entrance animations on hero text and elements
- **Click Splatter Effect** — particles burst from click points
- **Project Showcase** — hover-to-reveal project previews (Pragyasetu, YT_Chat, Bithub)
- **Slide-in Menu** — minimal sidebar navigation with smooth scroll-to-section
- **Fully Responsive** — adapts from desktop to mobile with tailored breakpoints

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Canvas / Background | [p5.js](https://p5js.org/) 1.9 |
| Animations | [GSAP](https://greensock.com/gsap/) 3.12 + ScrollTrigger |
| Icons | [Remix Icon](https://remixicon.com/) 3.2 |
| Fonts | Poppins (Google Fonts) |
| Styling | Vanilla CSS (custom properties, glassmorphism, responsive) |

## 📁 Project Structure

```
├── index.html          # Main HTML structure
├── style.css           # All styles (glass effects, responsive, animations)
├── script.js           # p5.js sand sim, GSAP animations, menu, splatter
├── assets/             # Project images and SVG icons
├── dp.jpg              # Profile photo
└── README.md
```

## 🖥 Getting Started

Just open `index.html` in any modern browser — no build step required.

```
# Or serve locally
npx serve .
```

## ✨ Sand Simulation

The background sand is a custom optimized simulation:
- **1D Float32Array grids** for performance
- **30 fps** frame rate
- Grains spawn under the cursor and pile up naturally at the bottom
- Configurable via `hueValue`, `gravity`, and `fill()` saturation/brightness in `script.js`

## 📄 License

MIT — feel free to use and adapt.
