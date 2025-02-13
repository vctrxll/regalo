const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const heartPoints = [];
const heartSize = 10; // Tamaño del corazón
const centerX = canvas.width / 2;
const centerY = canvas.height / 2 - 50;

// Función para calcular puntos en un corazón
function generateHeartPoints() {
    for (let t = 0; t < Math.PI * 2; t += 0.1) {
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        heartPoints.push({
            x: centerX + x * heartSize,
            y: centerY - y * heartSize,
        });
    }
}

// Clase para las partículas
class Particle {
    constructor(x, y) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = x;
        this.targetY = y;
        this.size = 3;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.alpha = 0;
    }

    update() {
        // Movimiento hacia el punto objetivo
        this.x += (this.targetX - this.x) * 0.02;
        this.y += (this.targetY - this.y) * 0.02;

        // Efecto de aparición
        if (this.alpha < 1) {
            this.alpha += 0.02;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inicializar partículas
function initParticles() {
    generateHeartPoints();
    heartPoints.forEach((point) => {
        particles.push(new Particle(point.x, point.y));
    });
}

// Animación de partículas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

// Ajuste de tamaño del canvas en caso de cambio de ventana
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0;
    initParticles();
});

// Iniciar animación
initParticles();
animate();
