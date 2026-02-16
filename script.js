/* ============================================
   🌸 New Year Greeting - JavaScript
   ============================================ */

// =====================
// FIREWORKS ANIMATION (Enhanced)
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

// Bảng màu pháo hoa phong phú
const fireworkPalettes = [
    [[255, 215, 0], [255, 240, 100], [255, 180, 0]],
    [[255, 80, 80], [255, 120, 120], [200, 30, 30]],
    [[255, 182, 193], [255, 130, 170], [255, 200, 220]],
    [[100, 200, 255], [150, 220, 255], [80, 160, 255]],
    [[180, 130, 255], [200, 160, 255], [140, 100, 220]],
    [[100, 255, 180], [150, 255, 200], [80, 220, 150]],
    [[255, 255, 255], [255, 240, 220], [255, 200, 150]],
];

const EXPLOSION_TYPES = ['circle', 'ring', 'willow', 'sparkle', 'double'];

class Firework {
    constructor() {
        // Chỉ xuất hiện ở 2 bên (25% lề trái hoặc 25% lề phải)
        const isLeft = Math.random() > 0.5;
        this.x = isLeft
            ? Math.random() * (canvas.width * 0.05)
            : canvas.width * 0.75 + Math.random() * (canvas.width * 0.05);
        this.y = canvas.height;
        this.targetY = canvas.height * 0.08 + Math.random() * canvas.height * 0.05;
        this.speed = 4 + Math.random() * 3;
        this.alive = true;
        this.trail = [];
        this.brightness = 0.6 + Math.random() * 0.4;
    }

    update() {
        this.y -= this.speed;
        this.x += (Math.random() - 0.5) * 0.5;
        if (this.y <= this.targetY) {
            this.explode();
            this.alive = false;
        }
    }

    explode() {
        const palette = fireworkPalettes[Math.floor(Math.random() * fireworkPalettes.length)];
        const type = EXPLOSION_TYPES[Math.floor(Math.random() * EXPLOSION_TYPES.length)];
        const isMobile = window.innerWidth < 768;
        const m = isMobile ? 0.5 : 1; // Hệ số giảm cho mobile

        switch (type) {
            case 'circle': {
                const count = Math.floor(80 * m);
                for (let i = 0; i < count; i++) {
                    const angle = (Math.PI * 2 / count) * i;
                    const speed = 2 + Math.random() * 6; // Tăng từ 1.5 - 4
                    const color = palette[Math.floor(Math.random() * palette.length)];
                    particles.push(new EnhancedParticle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 'normal'));
                }
                break;
            }
            case 'ring': {
                const count = Math.floor(70 * m);
                const speed = 4 + Math.random() * 3; // Tăng từ 3 - 2
                for (let i = 0; i < count; i++) {
                    const angle = (Math.PI * 2 / count) * i;
                    const color = palette[Math.floor(Math.random() * palette.length)];
                    particles.push(new EnhancedParticle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 'ring'));
                }
                break;
            }
            case 'willow': {
                const count = Math.floor(60 * m);
                for (let i = 0; i < count; i++) {
                    const angle = (Math.PI * 2 / count) * i;
                    const speed = 1.5 + Math.random() * 4; // Tăng từ 1 - 3
                    particles.push(new EnhancedParticle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, palette[0], 'willow'));
                }
                break;
            }
            case 'sparkle': {
                const count = Math.floor(70 * m);
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 1 + Math.random() * 7; // Tăng từ 0.5 - 5
                    const color = palette[Math.floor(Math.random() * palette.length)];
                    particles.push(new EnhancedParticle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 'sparkle'));
                }
                break;
            }
            case 'double': {
                const innerC = Math.floor(40 * m);
                const outerC = Math.floor(70 * m);
                for (let i = 0; i < innerC; i++) {
                    const angle = (Math.PI * 2 / innerC) * i;
                    const speed = 2 + Math.random() * 2;
                    particles.push(new EnhancedParticle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, palette[0], 'normal'));
                }
                for (let i = 0; i < outerC; i++) {
                    const angle = (Math.PI * 2 / outerC) * i;
                    const speed = 4 + Math.random() * 4;
                    particles.push(new EnhancedParticle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, palette[1] || palette[0], 'normal'));
                }
                break;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 230, ${this.brightness * 0.8})`;
        ctx.fill();
    }
}

class EnhancedParticle {
    constructor(x, y, vx, vy, color, type) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.type = type;
        this.alpha = 1;
        this.trail = [];
        switch (type) {
            case 'willow':
                this.decay = 0.003 + Math.random() * 0.005;
                this.gravity = 0.04;
                this.size = 2 + Math.random() * 1.5;
                break;
            case 'ring':
                this.decay = 0.01 + Math.random() * 0.008;
                this.gravity = 0.015;
                this.size = 3 + Math.random() * 2;
                break;
            case 'sparkle':
                this.decay = 0.005 + Math.random() * 0.01;
                this.gravity = 0.015;
                this.size = 2 + Math.random() * 3;
                this.twinkle = Math.random() * Math.PI;
                break;
            default:
                this.decay = 0.006 + Math.random() * 0.01;
                this.gravity = 0.025;
                this.size = 2.5 + Math.random() * 2;
        }
    }

    update() {
        this.vx *= 0.985;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.type === 'sparkle') this.twinkle += 0.3;
    }

    draw() {
        let dAlpha = this.alpha * 0.6;
        if (this.type === 'sparkle') dAlpha *= 0.5 + 0.5 * Math.sin(this.twinkle);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${dAlpha})`;
        ctx.fill();
    }
}

let lastFirework = 0;
const fireworkInterval = 800;

function animateFireworks() {
    requestAnimationFrame(animateFireworks);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    const now = Date.now();
    if (now - lastFirework > fireworkInterval + Math.random() * 1200) {
        fireworks.push(new Firework());
        if (Math.random() > 0.4) fireworks.push(new Firework());
        if (Math.random() > 0.75) fireworks.push(new Firework());
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

// Hàm trigger pháo hoa tại vị trí cụ thể (cho Lì Xì)
function triggerFireworkAt(x, y) {
    const fw = new Firework();
    fw.x = x;
    fw.y = canvas.height; // Bắn từ dưới lên
    fw.targetY = y;
    fw.speed = 12; // Bay nhanh hơn cho hiệu ứng tức thì
    fireworks.push(fw);
}

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
setInterval(createPetal, 1000);
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
    "Yêu em hơn cả ngàn lần! ❤️🔥",
    "Chúc mình mãi là đôi uyên ương! 🦢💗",
    "An khang thịnh vượng, tình yêu viên mãn! 🧧",
    "Cùng nhau đón trọn vạn mùa xuân! 🌸💑",
    "Bên nhau là Tết, xa nhau là nhớ! 💌",
    "Năm mới, tình cũ vẫn nồng nàn! 🔥❤️",
    "Chúc đôi ta luôn cười thật tươi! 😊💕",
    "Woa, chúc mừng bé đã được lì xì của anh. Ting ting!"
];

let envelopeOpened = false;
let currentLuckyIdx = 0;
let canClickEnvelope = true;

function openEnvelope() {
    if (!canClickEnvelope) return;

    canClickEnvelope = false;
    const envelope = document.getElementById('envelope');
    const messageEl = document.getElementById('lucky-message');

    if (envelopeOpened) {
        // Đóng lại trước, rồi mở ra với lời chúc mới
        envelope.classList.remove('opened');
        envelopeOpened = false;

        setTimeout(() => {
            const nextMsg = luckyMessages[currentLuckyIdx];
            messageEl.textContent = nextMsg;
            currentLuckyIdx = (currentLuckyIdx + 1) % luckyMessages.length;

            envelope.classList.add('opened');
            envelopeOpened = true;
            createCelebration(envelope);

            // Cho phép click lại sau khi hiệu ứng mở hoàn tất
            setTimeout(() => {
                canClickEnvelope = true;
            }, 1000);
        }, 600);
    } else {
        const nextMsg = luckyMessages[currentLuckyIdx];
        messageEl.textContent = nextMsg;
        currentLuckyIdx = (currentLuckyIdx + 1) % luckyMessages.length;

        envelope.classList.add('opened');
        envelopeOpened = true;
        createCelebration(envelope);

        // Cho phép click lại sau khi hiệu ứng mở hoàn tất
        setTimeout(() => {
            canClickEnvelope = true;
        }, 1000);
    }
}

function createCelebration(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const celebrationEmojis = ['✨', '🌟', '💫', '⭐', '🎊', '❤️', '💖', '🧧'];

    // 1. Pháo hoa Canvas
    // Bắn 3 quả pháo hoa xung quanh vị trí bao lì xì
    triggerFireworkAt(centerX, centerY - 50);
    setTimeout(() => triggerFireworkAt(centerX - 80, centerY - 100), 200);
    setTimeout(() => triggerFireworkAt(centerX + 80, centerY - 100), 400);

    // 2. Sparkle Emojis (giữ nguyên)
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
            const angle = (Math.PI * 2 / 15) * i;
            const distance = 80 + Math.random() * 100;
            sparkle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
            sparkle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
            sparkle.style.fontSize = (14 + Math.random() * 20) + 'px';
            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 1200);
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

            // Hiệu ứng pháo hoa chào mừng
            launchIntroFireworks();

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

// Hàm bắn pháo hoa chào mừng rực rỡ (chỉ ở 2 bên)
function launchIntroFireworks() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const isLeft = Math.random() > 0.5;
            const x = isLeft
                ? Math.random() * (width * 0.25)
                : width * 0.75 + Math.random() * (width * 0.25);

            const y = height * 0.05 + Math.random() * height * 0.5;
            triggerFireworkAt(x, y);

            if (i % 3 === 0) {
                setTimeout(() => {
                    const sideX = isLeft
                        ? Math.random() * (width * 0.25)
                        : width * 0.75 + Math.random() * (width * 0.25);
                    triggerFireworkAt(sideX, height * 0.2 + Math.random() * height * 0.3);
                }, 150);
            }
        }, i * 250);
    }
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
// PARALLAX & BOTTOM SCROLL FIREWORKS
// =====================
let reachedBottom = false;
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 600;
    }

    // Kiểm tra nếu cuộn xuống dưới cùng
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
        if (!reachedBottom) {
            launchSmallFooterFireworks();
            reachedBottom = true;
        }
    } else {
        reachedBottom = false;
    }
});

function launchSmallFooterFireworks() {
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            const isLeft = Math.random() > 0.5;
            const x = isLeft
                ? Math.random() * (window.innerWidth * 0.25)
                : window.innerWidth * 0.75 + Math.random() * (window.innerWidth * 0.25);

            const y = 100 + Math.random() * (window.innerHeight * 0.4);
            triggerFireworkAt(x, y);
        }, i * 500);
    }
}

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
