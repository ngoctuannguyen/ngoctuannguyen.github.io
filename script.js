/* ============================================
   🌸 New Year Greeting - JavaScript
   ============================================ */

// =====================
// FIREWORKS ANIMATION
// =====================
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
let fireworks = [];
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.4 + 50;
        this.speed = 3 + Math.random() * 3;
        this.hue = Math.random() * 60 + 10; // Gold/Red range
        this.alive = true;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();

        this.y -= this.speed;

        if (this.y <= this.targetY) {
            this.explode();
            this.alive = false;
        }
    }

    explode() {
        const colors = [
            [255, 215, 0],   // Gold
            [255, 100, 100], // Red
            [255, 182, 193], // Pink
            [255, 255, 200], // Light yellow
            [255, 140, 0],   // Orange
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isMobile = window.innerWidth < 768;
        const count = isMobile ? 30 + Math.floor(Math.random() * 20) : 60 + Math.floor(Math.random() * 40);

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = 1 + Math.random() * 4;
            particles.push(new Particle(
                this.x,
                this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                color
            ));
        }
    }

    draw() {
        // Trail
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = i / this.trail.length * 0.5;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.fill();
        }

        // Head
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 200, 0.9)`;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.alpha = 1;
        this.decay = 0.008 + Math.random() * 0.015;
        this.gravity = 0.03;
        this.size = 1.5 + Math.random() * 1.5;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > 5) this.trail.shift();

        this.vx *= 0.99;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw() {
        // Trail
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const a = (i / this.trail.length) * t.alpha * 0.3;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${a})`;
            ctx.fill();
        }

        // Particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha})`;
        ctx.fill();

        // Glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

let lastFirework = 0;
const fireworkInterval = 1200;

function animateFireworks() {
    requestAnimationFrame(animateFireworks);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    const now = Date.now();
    if (now - lastFirework > fireworkInterval + Math.random() * 1500) {
        fireworks.push(new Firework());
        if (Math.random() > 0.5) {
            fireworks.push(new Firework());
        }
        lastFirework = now;
    }

    fireworks = fireworks.filter(fw => {
        fw.update();
        fw.draw();
        return fw.alive;
    });

    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.alpha > 0.01;
    });
}

animateFireworks();

// =====================
// FALLING PETALS
// =====================
const petalsContainer = document.getElementById('petals-container');
const petalEmojis = ['🌸', '🌺', '✿', '❀', '🏵️', '💮'];

function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.fontSize = (14 + Math.random() * 16) + 'px';
    petal.style.animationDuration = (6 + Math.random() * 8) + 's, ' + (3 + Math.random() * 4) + 's';
    petal.style.animationDelay = Math.random() * 5 + 's';
    petal.style.opacity = 0.4 + Math.random() * 0.5;
    petalsContainer.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 16000);
}

// Create petals periodically
setInterval(createPetal, 600);
// Initial batch
for (let i = 0; i < 12; i++) {
    setTimeout(createPetal, i * 200);
}

// =====================
// SCROLL ANIMATIONS
// =====================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// =====================
// ENVELOPE INTERACTION
// =====================
const luckyMessages = [
    "Năm mới bên nhau, hạnh phúc mãi mãi! 💕",
    "Tình yêu đôi ta vững bền như núi! 🏔️💖",
    "Năm mới thật nhiều niềm vui bên nhau! 🎊",
    "Yêu em/anh hơn cả ngàn lần! ❤️🔥",
    "Chúc mình mãi là đôi uyên ương! 🦢💗",
    "An khang thịnh vượng, tình yêu viên mãn! 🧧",
    "Cùng nhau đón trọn vạn mùa xuân! 🌸💑",
    "Bên nhau là Tết, xa nhau là nhớ! 💌",
    "Năm mới, tình cũ vẫn nồng nàn! 🔥❤️",
    "Chúc đôi ta luôn cười thật tươi! 😊💕"
];

let envelopeOpened = false;

function openEnvelope() {
    const envelope = document.getElementById('envelope');
    const messageEl = document.getElementById('lucky-message');

    if (envelopeOpened) {
        // Reset and show new message
        envelope.classList.remove('opened');
        envelopeOpened = false;
        setTimeout(() => {
            const randomMsg = luckyMessages[Math.floor(Math.random() * luckyMessages.length)];
            messageEl.textContent = randomMsg;
            envelope.classList.add('opened');
            envelopeOpened = true;
            createCelebration(envelope);
        }, 600);
    } else {
        const randomMsg = luckyMessages[Math.floor(Math.random() * luckyMessages.length)];
        messageEl.textContent = randomMsg;
        envelope.classList.add('opened');
        envelopeOpened = true;
        createCelebration(envelope);
    }
}

function createCelebration(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const celebrationEmojis = ['✨', '🌟', '💫', '⭐', '🎊', '❤️', '💖', '🧧'];

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
            const angle = (Math.PI * 2 / 15) * i;
            const distance = 60 + Math.random() * 80;
            sparkle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
            sparkle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
            sparkle.style.fontSize = (12 + Math.random() * 16) + 'px';
            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 1000);
        }, i * 50);
    }
}

// =====================
// MUSIC TOGGLE
// =====================
let musicPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

function toggleMusic() {
    const musicDisc = document.getElementById('rotating-disc');

    if (musicPlaying) {
        bgMusic.pause();
        musicToggle.querySelector('.music-icon').textContent = '🔇';
        musicPlaying = false;
        if (musicDisc) musicDisc.classList.remove('playing');
    } else {
        bgMusic.volume = 0.5;
        bgMusic.play()
            .then(() => {
                musicToggle.querySelector('.music-icon').textContent = '🔊'; // Unmuted speaker
                musicPlaying = true;
                if (musicDisc) musicDisc.classList.add('playing');
            })
            .catch((error) => {
                console.error('Music playback failed:', error);
                musicPlaying = false;
                if (musicDisc) musicDisc.classList.remove('playing');
                musicToggle.querySelector('.music-icon').textContent = '🔇';
            });
    }
}

// Tự động phát nhạc hoặc chờ tương tác từ Welcome Overlay
function initMusicAndOverlay() {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const startBtn = document.getElementById('start-btn');

    // Thiết lập nhạc ban đầu
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.5;

    // Khi người dùng bấm nút "Khám phá"
    if (startBtn && welcomeOverlay) {
        startBtn.addEventListener('click', () => {
            // Phát nhạc ngay lập tức (Trình duyệt sẽ cho phép vì có sự kiện click)
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.querySelector('.music-icon').textContent = '🔊';
                const musicDisc = document.getElementById('rotating-disc');
                if (musicDisc) musicDisc.classList.add('playing');
            }).catch(err => console.error("Playback failed:", err));

            // Ẩn màn hình chào
            welcomeOverlay.classList.add('hidden');
        });
    }

    // Logic dự phòng nếu người dùng cuộn hoặc tương tác khác
    const attemptPlay = () => {
        if (!musicPlaying) {
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.querySelector('.music-icon').textContent = '🔊';
                document.removeEventListener('scroll', attemptPlay);
                document.removeEventListener('touchstart', attemptPlay);
            }).catch(err => { });
        }
    };

    document.addEventListener('scroll', attemptPlay);
    document.addEventListener('touchstart', attemptPlay);
}

// Gọi hàm khởi tạo khi trang web tải xong
window.addEventListener('load', initMusicAndOverlay);

// =====================
// SPARKLE ON CLICK (and Touch)
// =====================
function createSparkles(x, y) {
    const sparkles = ['✨', '🌟', '💫', '💖', '🌸'];
    const count = window.innerWidth < 768 ? 3 : 5;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.left = (x + (Math.random() - 0.5) * 60) + 'px';
            sparkle.style.top = (y + (Math.random() - 0.5) * 60) + 'px';
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 900);
        }, i * 80);
    }
}

document.addEventListener('click', (e) => {
    createSparkles(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
        createSparkles(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

// =====================
// PARALLAX ON SCROLL
// =====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 600;
    }
});

// =====================
// TYPING EFFECT FOR TITLE (optional enhancement)
// =====================
document.addEventListener('DOMContentLoaded', () => {
    // Add staggered animations to wish items
    document.querySelectorAll('.wish-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });

    // Add staggered animations to highlight cards
    document.querySelectorAll('.highlight-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
});
