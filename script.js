var timeout;

const scroll = new LocomotiveScroll({
	el: document.querySelector(".main"),
	smooth: true,
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
   p5.js Falling Sand Simulation
   Note: requires a separate <div id="sand-canvas"></div>
   and p5.js library included in the HTML.
   ========================================================= */

function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
		for (let j = 0; j < arr[i].length; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
}

let grid;
let velocityGrid;
let w = 4;
let cols, rows;
let hueValue = 200;
let gravity = 0.1;

function withinCols(i) {
	return i >= 0 && i <= cols - 1;
}

function withinRows(j) {
	return j >= 0 && j <= rows - 1;
}

function setup() {
	let canvas = createCanvas(600, 500);
	canvas.parent("sand-canvas");
	colorMode(HSB, 360, 255, 255);
	cols = width / w;
	rows = height / w;
	grid = make2DArray(cols, rows);
	velocityGrid = make2DArray(cols, rows, 1);
}

function mouseDragged() {}

function draw() {
	background(0);

	if (mouseX !== pmouseX || mouseY !== pmouseY) {
		let mouseCol = floor(mouseX / w);
		let mouseRow = floor(mouseY / w);
		let matrix = 2;
		let extent = floor(matrix / 2);

		for (let i = -extent; i <= extent; i++) {
			for (let j = -extent; j <= extent; j++) {
				if (random(1) < 0.75) {
					let col = mouseCol + i;
					let row = mouseRow + j;
					if (withinCols(col) && withinRows(row)) {
						grid[col][row] = hueValue;
						velocityGrid[col][row] = 1;
					}
				}
			}
		}

		hueValue += 0.5;
		if (hueValue > 360) {
			hueValue = 1;
		}
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			noStroke();
			if (grid[i][j] > 0) {
				fill(grid[i][j], 110, 240);
				let x = i * w;
				let y = j * w;
				square(x, y, w);
			}
		}
	}

	let nextGrid = make2DArray(cols, rows);
	let nextVelocityGrid = make2DArray(cols, rows);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let state = grid[i][j];
			let velocity = velocityGrid[i][j];
			let moved = false;

			if (state > 0) {
				let newPos = int(j + velocity);

				for (let y = newPos; y > j; y--) {
					let below = grid[i][y];
					let dir = 1;
					if (random(1) < 0.5) {
						dir *= -1;
					}

					let belowA = -1;
					let belowB = -1;
					if (withinCols(i + dir)) belowA = grid[i + dir][y];
					if (withinCols(i - dir)) belowB = grid[i - dir][y];

					if (below === 0) {
						nextGrid[i][y] = state;
						nextVelocityGrid[i][y] = velocity + gravity;
						moved = true;
						break;
					} else if (belowA === 0) {
						nextGrid[i + dir][y] = state;
						nextVelocityGrid[i + dir][y] = velocity + gravity;
						moved = true;
						break;
					} else if (belowB === 0) {
						nextGrid[i - dir][y] = state;
						nextVelocityGrid[i - dir][y] = velocity + gravity;
						moved = true;
						break;
					}
				}
			}

			if (state > 0 && !moved) {
				nextGrid[i][j] = grid[i][j];
				nextVelocityGrid[i][j] = velocityGrid[i][j] + gravity;
			}
		}
	}

	grid = nextGrid;
	velocityGrid = nextVelocityGrid;
}
