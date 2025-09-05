// JavaScript Principal - SESC Campo Mourão Alongamentos

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização
    initializeApp();
    setupNavigation();
    setupAnimations();
    setupScrollEffects();
    setupInteractiveElements();
});

// Inicialização da aplicação
function initializeApp() {
    console.log('🤖 SESC Alongamentos - Sistema Futurístico Iniciado');
    
    // Adicionar classes de animação aos elementos
    addAnimationClasses();
    
    // Configurar elementos interativos
    setupHoverEffects();
    
    // Inicializar contadores
    initializeCounters();
}

// Configuração da navegação
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle do menu mobile
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Navegação suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Fechar menu mobile se estiver aberto
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Destacar link ativo na navegação
    window.addEventListener('scroll', highlightActiveNavLink);
}

// Função para scroll suave
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Destacar link ativo na navegação
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Configuração de animações
function setupAnimations() {
    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animação escalonada para grids
                if (entry.target.classList.contains('benefits-grid') || 
                    entry.target.classList.contains('exercises-grid')) {
                    animateGridItems(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const elementsToAnimate = document.querySelectorAll(
        '.benefit-card, .exercise-card, .robot-item, .tech-stats, .benefits-grid, .exercises-grid'
    );
    
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Animação escalonada para itens de grid
function animateGridItems(gridContainer) {
    const items = gridContainer.children;
    Array.from(items).forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('slide-up');
        }, index * 100);
    });
}

// Configuração de efeitos de scroll
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        // Efeito parallax nos elementos geométricos
        const geometricElements = document.querySelectorAll('.geometric-elements > *');
        geometricElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Efeito no header
        const header = document.querySelector('.header');
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Configuração de elementos interativos
function setupInteractiveElements() {
    // Efeitos hover nos cards
    const cards = document.querySelectorAll('.benefit-card, .exercise-card, .robot-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
            
            // Adicionar efeito de brilho
            const glowEffect = document.createElement('div');
            glowEffect.className = 'glow-effect';
            this.appendChild(glowEffect);
            
            setTimeout(() => {
                if (glowEffect.parentNode) {
                    glowEffect.parentNode.removeChild(glowEffect);
                }
            }, 500);
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });
    
    // Efeito de clique nos botões
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Efeito ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Adicionar classes de animação
function addAnimationClasses() {
    // Adicionar animação flutuante aos robôs
    const robots = document.querySelectorAll('.hero-robot, .robot-img');
    robots.forEach((robot, index) => {
        robot.classList.add('floating');
        robot.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Adicionar animação de pulso aos ícones
    const icons = document.querySelectorAll('.benefit-icon');
    icons.forEach((icon, index) => {
        icon.classList.add('pulse');
        icon.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Adicionar animação aos elementos geométricos
    const circles = document.querySelectorAll('.circle');
    const triangles = document.querySelectorAll('.triangle');
    
    circles.forEach(circle => circle.classList.add('rotate'));
    triangles.forEach(triangle => triangle.classList.add('pulse'));
}

// Configurar efeitos hover
function setupHoverEffects() {
    // Efeito hover nos links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.classList.add('neon-glow');
        });
        
        link.addEventListener('mouseleave', function() {
            this.classList.remove('neon-glow');
        });
    });
    
    // Efeito hover nos botões principais
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        });
    });
}

// Inicializar contadores animados
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Animar contador
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
    }, 16);
    
    element.classList.add('count-animation');
}

// Função para mostrar notificação temporária
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-popup ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🤖</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para otimizar animações em dispositivos móveis
function optimizeForMobile() {
    if (isMobile()) {
        // Reduzir animações em dispositivos móveis
        const animatedElements = document.querySelectorAll('.floating, .pulse, .rotate');
        animatedElements.forEach(element => {
            element.style.animationDuration = '4s';
        });
    }
}

// Função para adicionar partículas de fundo (opcional)
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--neon-cyan);
            border-radius: 50%;
            opacity: 0.7;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 6}s;
        `;
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
}

// Função para modo escuro/claro (futura implementação)
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
}

// Carregar tema salvo
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Função para debug (desenvolvimento)
function debugMode() {
    console.log('🔧 Modo Debug Ativado');
    console.log('📱 Dispositivo móvel:', isMobile());
    console.log('🎨 Tema atual:', document.body.classList.contains('light-theme') ? 'Claro' : 'Escuro');
    console.log('🤖 Elementos animados:', document.querySelectorAll('.floating, .pulse, .rotate').length);
}

// Executar otimizações quando a página carregar
window.addEventListener('load', function() {
    optimizeForMobile();
    loadSavedTheme();
    
    // Criar partículas se não for dispositivo móvel
    if (!isMobile()) {
        createParticles();
    }
    
    // Mostrar notificação de boas-vindas
    setTimeout(() => {
        showNotification('Bem-vindo ao futuro dos alongamentos! 🤖', 'success');
    }, 1000);
});

// Redimensionamento da janela
window.addEventListener('resize', function() {
    optimizeForMobile();
});

// Exportar funções para uso global
window.scrollToSection = scrollToSection;
window.showNotification = showNotification;
window.toggleTheme = toggleTheme;
window.debugMode = debugMode;

