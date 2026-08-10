var timeout;

if ("scrollRestoration" in history) {
	history.scrollRestoration = "manual";
}
window.addEventListener("load", function () {
	window.scrollTo(0, 0);
});

function firstPageAnim() {
	var tl = gsap.timeline();

	tl.from(".nav", {
		y: -10,
		opacity: 0,
		duration: 1.5,
		ease: "expo.inOut",
	})
		.to(".bounding-element", {
			y: 0,
			ease: "expo.inOut",
			duration: 2,
			delay: -1,
			stagger: 0.2,
		})
		.from(".herofooter", {
			y: -10,
			opacity: 0,
			duration: 1.5,
			delay: -1,
			ease: "expo.inOut",
		});
}

firstPageAnim();

// create splatter pieces and animate them outward
function createSplatter(x, y, count = 12) {
	for (let i = 0; i < count; i++) {
		const piece = document.createElement("div");
		piece.className = "splatter-piece";
		document.body.appendChild(piece);

		const size = Math.floor(Math.random() * 10) + 4;
		piece.style.width = size + "px";
		piece.style.height = size + "px";
		piece.style.left = x - size / 2 + "px";
		piece.style.top = y - size / 2 + "px";
		piece.style.opacity = 0;

		const angle = Math.random() * Math.PI * 2;
		const dist = Math.random() * 140 + 20;
		const tx = Math.cos(angle) * dist;
		// give slight upward bias so pieces arc and then fall
		const ty = Math.sin(angle) * dist - Math.random() * 30;
		const rot = (Math.random() - 0.5) * 720;

		// timeline: scatter outward, then fall down like sand with a bounce
		const tl = gsap.timeline({
			onComplete: function () {
				piece.remove();
			},
		});

		tl.to(piece, {
			duration: 0.45 + Math.random() * 0.45,
			x: tx,
			y: ty,
			opacity: 1,
			rotate: rot,
			scale: 1,
			ease: "power2.out",
		}).to(
			piece,
			{
				duration: 0.8 + Math.random() * 0.9,
				// drop further down (relative)
				y: "+=" + (window.innerHeight * 0.35 + Math.random() * 120),
				x: "+=" + (Math.random() * 40 - 20),
				opacity: 0,
				rotate: rot + (Math.random() * 200 - 100),
				ease: "bounce.out",
			},
			"+=0.05",
		);
	}
}

// clicking anywhere creates the splatter (mini cursor removed)
document.addEventListener("click", function (e) {
	createSplatter(e.clientX, e.clientY, 14);
});

// menu toggle
document.getElementById("menu-toggle").addEventListener("click", function () {
	document.getElementById("menu-overlay").classList.add("active");
});

document.getElementById("menu-close").addEventListener("click", function () {
	document.getElementById("menu-overlay").classList.remove("active");
});

document.querySelectorAll(".menu-links a").forEach(function (link) {
	link.addEventListener("click", function (e) {
		e.preventDefault();
		var target = document.querySelector(this.getAttribute("href"));
		if (target) {
			target.scrollIntoView({ behavior: "smooth" });
		}
		document.getElementById("menu-overlay").classList.remove("active");
	});
});

// teeno element ko sleect karo, uske baad teeno par ek mousemove lagao, jab mousemove ho to ye pata karo ki mouse kaha par hai, jiska matlab hai mouse ki x and y position pata karo, ab mouse ki x y position ke badle us image ko show karo and us image ko move karo, move karte waqt rotate karo, and jaise jaise mouse tez chale waise waise rotation bhi tez ho jaye

document.querySelectorAll(".elem").forEach(function (elem) {
	var rotate = 0;
	var diffrot = 0;

	elem.addEventListener("mouseleave", function (dets) {
		gsap.to(elem.querySelector("img"), {
			opacity: 0,
			ease: "power3.out",
			duration: 0.5,
		});
	});

	elem.addEventListener("mousemove", function (dets) {
		var diff = dets.clientY - elem.getBoundingClientRect().top;
		diffrot = dets.clientX - rotate;
		rotate = dets.clientX;
		gsap.to(elem.querySelector("img"), {
			opacity: 1,
			ease: "power3.out",
			top: diff,
			left: dets.clientX,
			rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
		});
	});
});

/* =========================================================
   p5.js Falling Sand Simulation — Optimized
   w=8 | 1D Float32 grids | pre-allocated | 30fps
   ========================================================= */

let grid, nextGrid;
let velocityGrid, nextVelocityGrid;
const w = 8;
let cols, rows;
let hueValue = 270;
const gravity = 0.1;

function idx(i, j) {
	return i * rows + j;
}

function withinCols(i) {
	return i >= 0 && i < cols;
}

function withinRows(j) {
	return j >= 0 && j < rows;
}

function initGrid() {
	const oldGrid = grid;
	const oldCols = cols || 0;
	const oldRows = rows || 0;

	cols = floor(width / w);
	rows = floor(height / w);
	const total = cols * rows;

	grid      = new Float32Array(total);
	nextGrid  = new Float32Array(total);
	velocityGrid      = new Float32Array(total);
	nextVelocityGrid  = new Float32Array(total);

	// preserve grains across resize
	if (oldGrid && oldCols > 0) {
		const mc = min(cols, oldCols);
		const mr = min(rows, oldRows);
		for (let i = 0; i < mc; i++) {
			for (let j = 0; j < mr; j++) {
				const newI = idx(i, j);
				const oldI = i * oldRows + j;
				grid[newI]         = oldGrid[oldI];
				velocityGrid[newI] = oldVelocityGrid[oldI];
			}
		}
	}
}

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("sand-canvas");
	colorMode(HSB, 360, 255, 255);
	frameRate(30);
	initGrid();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	initGrid();
}

function draw() {
	background(0);

	// ---- spawn grains under cursor ----
	if (mouseX !== pmouseX || mouseY !== pmouseY) {
		const mouseCol = floor(mouseX / w);
		const mouseRow = floor(mouseY / w);
		const matrix = 2;
		const extent = floor(matrix / 2);

		for (let i = -extent; i <= extent; i++) {
			for (let j = -extent; j <= extent; j++) {
				if (random(1) < 0.75) {
					const col = mouseCol + i;
					const row = mouseRow + j;
					if (withinCols(col) && withinRows(row)) {
						const k = idx(col, row);
						grid[k]         = hueValue;
						velocityGrid[k] = 1;
					}
				}
			}
		}
		hueValue += 0.5;
		if (hueValue > 360) hueValue = 1;
	}

	// ---- render grains ----
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

	// ---- physics: move grains down ----
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			const state    = grid[idx(i, j)];
			const velocity = velocityGrid[idx(i, j)];
			let moved = false;

			if (state > 0) {
				const newPos = Math.min(int(j + velocity), rows - 1);

				for (let y = newPos; y > j; y--) {
					const below = grid[idx(i, y)];
					let dir = random(1) < 0.5 ? 1 : -1;

					const belowA = (withinCols(i + dir) && withinRows(y)) ? grid[idx(i + dir, y)] : -1;
					const belowB = (withinCols(i - dir) && withinRows(y)) ? grid[idx(i - dir, y)] : -1;

					if (below === 0) {
						nextGrid[idx(i, y)]         = state;
						nextVelocityGrid[idx(i, y)] = velocity + gravity;
						moved = true;
						break;
					} else if (belowA === 0) {
						nextGrid[idx(i + dir, y)]         = state;
						nextVelocityGrid[idx(i + dir, y)] = velocity + gravity;
						moved = true;
						break;
					} else if (belowB === 0) {
						nextGrid[idx(i - dir, y)]         = state;
						nextVelocityGrid[idx(i - dir, y)] = velocity + gravity;
						moved = true;
						break;
					}
				}
			}

			if (state > 0 && !moved) {
				const k = idx(i, j);
				nextGrid[k]         = grid[k];
				nextVelocityGrid[k] = Math.min(velocityGrid[k] + gravity, 5);
			}
		}
	}

	// ---- swap buffers & clear next ----
	[grid, nextGrid]                 = [nextGrid, grid];
	[velocityGrid, nextVelocityGrid] = [nextVelocityGrid, velocityGrid];
	nextGrid.fill(0);
	nextVelocityGrid.fill(0);
}
