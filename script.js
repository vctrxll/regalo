const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const heartOutlines = [];
const orbitingHearts = [];
const heartSize = 12; // Tamaño de las partículas en forma de corazón
const centerX = canvas.width / 2;
const centerY = canvas.height / 2 - 50;
let heartFormed = false;

// Función para calcular puntos en el contorno de un corazón
function generateHeartPoints() {
    for (let t = 0; t < Math.PI * 2; t += 0.1) {
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        heartOutlines.push({
            x: centerX + x * heartSize,
            y: centerY - y * heartSize,
        });
    }
}

// Dibuja un pequeño corazón
function drawHeart(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size, y - size, x - size * 2, y + size / 2, x, y + size);
    ctx.bezierCurveTo(x + size * 2, y + size / 2, x + size, y - size, x, y);
    ctx.fill();
}

// Clase para las partículas en forma de corazón
class HeartParticle {
    constructor(x, y) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = x;
        this.targetY = y;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.alpha = 0;
    }

    update() {
        if (!heartFormed) {
            this.x += (this.targetX - this.x) * 0.02;
            this.y += (this.targetY - this.y) * 0.02;
            if (Math.abs(this.x - this.targetX) < 1 && Math.abs(this.y - this.targetY) < 1) {
                heartFormed = true;
                createOrbitingHearts();
            }
        }

        if (this.alpha < 1) {
            this.alpha += 0.02;
        }
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        drawHeart(this.x, this.y, 5, "white");
        ctx.globalAlpha = 1;
    }
}

// Corazones orbitando alrededor del contorno
class OrbitingHeart {
    constructor(angle) {
        this.angle = angle;
        this.radius = 20;
        this.speed = 0.02;
        this.index = Math.floor(Math.random() * heartOutlines.length);
    }

    update() {
        this.angle += this.speed;
        let point = heartOutlines[this.index];
        this.x = point.x + Math.cos(this.angle) * this.radius;
        this.y = point.y + Math.sin(this.angle) * this.radius;
    }

    draw() {
        drawHeart(this.x, this.y, 5, "red");
    }
}

// Inicializar partículas
function initParticles() {
    generateHeartPoints();
    heartOutlines.forEach((point) => {
        particles.push(new HeartParticle(point.x, point.y));
    });
}

// Crear corazones en órbita una vez que el corazón principal esté formado
function createOrbitingHearts() {
    for (let i = 0; i < 20; i++) {
        orbitingHearts.push(new OrbitingHeart(i * (Math.PI * 2 / 20)));
    }
}

// Animación de partículas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    if (heartFormed) {
        orbitingHearts.forEach((heart) => {
            heart.update();
            heart.draw();
        });
    }

    requestAnimationFrame(animate);
}

// Ajuste de tamaño del canvas en caso de cambio de ventana
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0;
    orbitingHearts.length = 0;
    heartFormed = false;
    initParticles();
});

// Iniciar animación
initParticles();
animate();
