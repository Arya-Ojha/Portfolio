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

```js
// p5.js Falling Sand Simulation — Optimized
let grid, nextGrid;
let velocityGrid, nextVelocityGrid;
const w = 8, gravity = 0.1;
let hueValue = 270;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sand-canvas");
  colorMode(HSB, 360, 255, 255);
  frameRate(30);
  initGrid();
}

function draw() {
  background(0);

  // spawn grains under cursor on mouse move
  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    const mouseCol = floor(mouseX / w);
    const mouseRow = floor(mouseY / w);
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (random(1) < 0.75 && withinCols(mouseCol + i) && withinRows(mouseRow + j)) {
          grid[idx(mouseCol + i, mouseRow + j)] = hueValue;
          velocityGrid[idx(mouseCol + i, mouseRow + j)] = 1;
        }
      }
    }
    hueValue += 0.5;
    if (hueValue > 360) hueValue = 1;
  }

  // physics: move grains down with diagonal slide
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const state = grid[idx(i, j)];
      if (state > 0) {
        const newPos = Math.min(int(j + velocityGrid[idx(i, j)]), rows - 1);
        for (let y = newPos; y > j; y--) {
          const below = grid[idx(i, y)];
          const dir = random(1) < 0.5 ? 1 : -1;
          const belowA = withinCols(i + dir) && withinRows(y) ? grid[idx(i + dir, y)] : -1;
          const belowB = withinCols(i - dir) && withinRows(y) ? grid[idx(i - dir, y)] : -1;

          if (below === 0) {
            nextGrid[idx(i, y)] = state;
            nextVelocityGrid[idx(i, y)] = velocityGrid[idx(i, j)] + gravity;
            break;
          } else if (belowA === 0) {
            nextGrid[idx(i + dir, y)] = state;
            nextVelocityGrid[idx(i + dir, y)] = velocityGrid[idx(i, j)] + gravity;
            break;
          } else if (belowB === 0) {
            nextGrid[idx(i - dir, y)] = state;
            nextVelocityGrid[idx(i - dir, y)] = velocityGrid[idx(i, j)] + gravity;
            break;
          }
        }
      }
    }
  }

  // render grains
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const hue = grid[idx(i, j)];
      if (hue > 0) {
        noStroke();
        fill(hue, 100, 210);
        square(i * w, j * w, w);
      }
    }
  }

  // swap buffers
  [grid, nextGrid] = [nextGrid, grid];
  [velocityGrid, nextVelocityGrid] = [nextVelocityGrid, velocityGrid];
  nextGrid.fill(0);
  nextVelocityGrid.fill(0);
}
```

## 📄 License

MIT — feel free to use and adapt.
