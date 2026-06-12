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

function circleChaptaKaro() {
	// simple and robust mouse follower: compute scales from delta and update transform
	var xprev = 0;
	var yprev = 0;

	window.addEventListener("mousemove", function (dets) {
		clearTimeout(timeout);

		var dx = dets.clientX - xprev;
		var dy = dets.clientY - yprev;

		var xscale = gsap.utils.clamp(0.7, 1.3, 1 + dx / 100);
		var yscale = gsap.utils.clamp(0.7, 1.3, 1 + dy / 100);

		xprev = dets.clientX;
		yprev = dets.clientY;

		var mini = document.querySelector(".mini-circle");
		if (mini) {
			mini.style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale}, ${yscale})`;
			// enforce visible white fill (some browsers/styles may override via computed styles)
			mini.style.backgroundColor = "#fff";
			mini.style.backgroundImage = "none";
			mini.style.opacity = "1";
		}

		timeout = setTimeout(function () {
			if (mini) {
				mini.style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(1, 1)`;
				mini.style.backgroundColor = "#fff";
				mini.style.backgroundImage = "none";
			}
		}, 100);
	});
}

circleChaptaKaro();
firstPageAnim();

// create splatter pieces and animate them outward
function createSplatter(x, y, count = 12) {
	for (let i = 0; i < count; i++) {
		const piece = document.createElement("div");
		piece.className = "splatter-piece";
		document.body.appendChild(piece);

		const size = Math.floor(Math.random() * 12) + 6;
		piece.style.width = size + "px";
		piece.style.height = size + "px";
		piece.style.left = x - size / 2 + "px";
		piece.style.top = y - size / 2 + "px";

		const angle = Math.random() * Math.PI * 2;
		const dist = Math.random() * 140 + 40;
		const tx = Math.cos(angle) * dist;
		const ty = Math.sin(angle) * dist;
		const rot = (Math.random() - 0.5) * 720;

		gsap.to(piece, {
			duration: 0.8 + Math.random() * 0.6,
			x: tx,
			y: ty,
			opacity: 0,
			rotate: rot,
			scale: 0.1,
			ease: "power2.out",
			onComplete: function () {
				piece.remove();
			},
		});
	}
}

// when user clicks the mini cursor, splatter and make the circle uneven briefly
document.addEventListener("click", function (e) {
	const mini = document.querySelector(".mini-circle");
	if (!mini) return;

	// only trigger if click is on or very near the mini circle
	const rect = mini.getBoundingClientRect();
	const cx = rect.left + rect.width / 2;
	const cy = rect.top + rect.height / 2;
	const d = Math.hypot(e.clientX - cx, e.clientY - cy);
	if (d <= Math.max(rect.width, rect.height) * 1.2) {
		mini.classList.add("splattered");
		// ensure splattered appearance remains light
		mini.style.background = "linear-gradient(135deg, #ffffff, #f0f0f0)";
		createSplatter(e.clientX, e.clientY, 14);
		setTimeout(function () {
			mini.classList.remove("splattered");
			mini.style.background = "#fff";
		}, 700);
	}
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
