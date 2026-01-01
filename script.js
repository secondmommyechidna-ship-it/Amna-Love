// Shared interactions for every page

document.addEventListener('DOMContentLoaded', () => {
    handleCreatorOverlay();
    setupNavigation();
    setActiveNav();
    setupRevealAnimations();
    setupFloatingHearts();
    setupSparkles();
    setupTypingEffect();
    setupReadMore();
    setupLightbox();
    setupProposalPage();
    setupSongAudio();
    setupAnchorScroll();
    setupSoloSong();
});

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

function setActiveNav() {
    const links = document.querySelectorAll('.nav-links a');
    if (!links.length) return;
    const path = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === path) {
            link.classList.add('active');
        }
    });
}

function setupAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href').slice(1);
            const el = document.getElementById(targetId);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupRevealAnimations() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
}

function setupFloatingHearts() {
    if (!document.body.classList.contains('has-hearts')) return;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    container.style.zIndex = '0';
    document.body.appendChild(container);

    setInterval(() => {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${16 + Math.random() * 12}px`;
        heart.style.animationDuration = `${5 + Math.random() * 4}s`;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 9000);
    }, 1200);
}

function setupSparkles() {
    if (document.querySelector('.sparkle-field')) return;
    const field = document.createElement('div');
    field.className = 'sparkle-field';
    const count = 28;
    for (let i = 0; i < count; i++) {
        const spark = document.createElement('span');
        repositionSparkle(spark);
        spark.style.animationDelay = `${Math.random() * 6}s`;
        spark.style.animationDuration = `${6 + Math.random() * 4}s`;
        spark.addEventListener('animationiteration', () => repositionSparkle(spark));
        field.appendChild(spark);
    }
    document.body.appendChild(field);
}

function repositionSparkle(el) {
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
}

function setupTypingEffect() {
    const typingEl = document.querySelector('[data-typing]');
    if (!typingEl) return;

    const text = typingEl.dataset.typing || typingEl.textContent.trim();
    typingEl.textContent = '';
    let index = 0;

    const type = () => {
        if (index <= text.length) {
            typingEl.textContent = text.slice(0, index);
            index++;
            setTimeout(type, 38);
        }
    };

    type();
}

function setupReadMore() {
    const expandable = document.querySelector('.expandable');
    const toggleBtn = document.querySelector('.read-more');
    if (!expandable || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = expandable.classList.toggle('open');
        toggleBtn.textContent = isOpen ? 'Show Less' : 'Read More';
    });
}

function setupLightbox() {
    const images = Array.from(document.querySelectorAll('[data-gallery]'));
    if (!images.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img alt="memory" />
            <button class="prev" aria-label="Previous">‹</button>
            <button class="next" aria-label="Next">›</button>
            <button class="close" aria-label="Close">×</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector('img');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    const closeBtn = lightbox.querySelector('.close');
    let current = 0;

    const openLightbox = index => {
        current = index;
        imgEl.src = images[current].src;
        lightbox.classList.add('active');
    };

    const showNext = dir => {
        current = (current + dir + images.length) % images.length;
        imgEl.src = images[current].src;
    };

    images.forEach((img, idx) => {
        img.dataset.index = idx;
        img.addEventListener('click', () => openLightbox(idx));
    });

    prevBtn.addEventListener('click', () => showNext(-1));
    nextBtn.addEventListener('click', () => showNext(1));
    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowRight') showNext(1);
        if (e.key === 'ArrowLeft') showNext(-1);
    });
}

function setupSongAudio() {
    const audioEls = Array.from(document.querySelectorAll('.song-card audio, .solo-song audio'));
    if (!audioEls.length) return;

    audioEls.forEach(audio => {
        audio.addEventListener('play', () => {
            audioEls.forEach(other => {
                if (other !== audio) other.pause();
            });
        });
    });
}

function setupSoloSong() {
    const btn = document.getElementById('playDieSong');
    const audio = document.getElementById('dieSongAudio');
    if (!btn || !audio) return;

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.currentTime = 0;
            audio.play();
            btn.textContent = 'Pause Die With A Smile';
        } else {
            audio.pause();
            btn.textContent = 'Play Die With A Smile';
        }
    });

    audio.addEventListener('ended', () => {
        btn.textContent = 'Play Die With A Smile';
    });
}

function handleCreatorOverlay() {
    const overlay = document.getElementById('creator-overlay');
    const btn = document.getElementById('creator-continue');
    if (!overlay || !btn) return;

    const dismiss = () => {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        setTimeout(() => overlay.remove(), 400);
    };

    if (localStorage.getItem('creatorSeen')) {
        dismiss();
        return;
    }

    btn.addEventListener('click', () => {
        localStorage.setItem('creatorSeen', 'true');
        dismiss();
    });
}

function setupProposalPage() {
    const yesBtn = document.getElementById('yesButton');
    const thinkBtn = document.getElementById('thinkButton');
    const messageBox = document.querySelector('.message-box');

    if (yesBtn && messageBox) {
        yesBtn.addEventListener('click', () => {
            messageBox.textContent = 'You just made me the happiest person alive.';
            launchCelebration();
        });
    }

    if (thinkBtn && messageBox) {
        thinkBtn.addEventListener('click', () => {
            messageBox.textContent = 'No matter what, you will always be special to me.';
        });
    }

}

function launchCelebration() {
    const burst = document.createElement('div');
    burst.style.position = 'fixed';
    burst.style.inset = '0';
    burst.style.pointerEvents = 'none';
    burst.style.overflow = 'hidden';
    burst.style.zIndex = '30';
    document.body.appendChild(burst);

    for (let i = 0; i < 28; i++) {
        setTimeout(() => createConfettiHeart(burst), i * 120);
    }

    setTimeout(() => burst.remove(), 4500);
}

function createConfettiHeart(container) {
    const heart = document.createElement('span');
    heart.textContent = ['❤', '♡', '❥'][Math.floor(Math.random() * 3)];
    heart.style.position = 'absolute';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 20}%`;
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heart.style.color = ['#e26a8b', '#f59ab2', '#c94f73'][Math.floor(Math.random() * 3)];
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = 'floatUp 3.2s ease forwards';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 3500);
}
