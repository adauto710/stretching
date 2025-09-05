// Timer de Exercícios - SESC Campo Mourão

class ExerciseTimer {
    constructor() {
        this.totalTime = 5 * 60; // 5 minutos em segundos
        this.currentTime = this.totalTime;
        this.isRunning = false;
        this.isPaused = false;
        this.interval = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.minutesDisplay = document.getElementById('timer-minutes');
        this.secondsDisplay = document.getElementById('timer-seconds');
        this.progressBar = document.getElementById('progress-bar');
        this.startButton = document.getElementById('start-timer');
        this.pauseButton = document.getElementById('pause-timer');
        this.resetButton = document.getElementById('reset-timer');
    }
    
    setupEventListeners() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.start());
        }
        
        if (this.pauseButton) {
            this.pauseButton.addEventListener('click', () => this.pause());
        }
        
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.reset());
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            
            this.interval = setInterval(() => {
                this.tick();
            }, 1000);
            
            this.updateButtonStates();
            this.showNotification('Timer iniciado! 🤖', 'success');
            
            // Efeito visual no botão
            this.startButton.classList.add('active');
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            
            clearInterval(this.interval);
            this.updateButtonStates();
            this.showNotification('Timer pausado ⏸️', 'info');
            
            // Efeito visual no botão
            this.startButton.classList.remove('active');
            this.pauseButton.classList.add('active');
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = this.totalTime;
        
        clearInterval(this.interval);
        this.updateDisplay();
        this.updateButtonStates();
        this.showNotification('Timer reiniciado 🔄', 'info');
        
        // Remover efeitos visuais dos botões
        this.startButton.classList.remove('active');
        this.pauseButton.classList.remove('active');
        this.resetButton.classList.add('pulse');
        
        setTimeout(() => {
            this.resetButton.classList.remove('pulse');
        }, 500);
    }
    
    tick() {
        if (this.currentTime > 0) {
            this.currentTime--;
            this.updateDisplay();
            this.updateProgress();
            
            // Avisos em momentos específicos
            if (this.currentTime === 60) {
                this.showNotification('Último minuto! Continue se alongando 💪', 'warning');
            } else if (this.currentTime === 30) {
                this.showNotification('30 segundos restantes! 🔥', 'warning');
            } else if (this.currentTime === 10) {
                this.showNotification('10 segundos! Finalizando... ⏰', 'warning');
            }
        } else {
            this.complete();
        }
    }
    
    complete() {
        this.isRunning = false;
        clearInterval(this.interval);
        
        this.showNotification('Parabéns! Sessão de alongamento concluída! 🎉', 'success');
        this.updateButtonStates();
        
        // Efeito de conclusão
        this.progressBar.classList.add('completed');
        this.playCompletionAnimation();
        
        // Resetar após 3 segundos
        setTimeout(() => {
            this.reset();
            this.progressBar.classList.remove('completed');
        }, 3000);
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        
        if (this.minutesDisplay) {
            this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        }
        
        if (this.secondsDisplay) {
            this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Efeito de pulsação quando restam poucos segundos
        if (this.currentTime <= 10 && this.currentTime > 0) {
            this.minutesDisplay?.classList.add('pulse');
            this.secondsDisplay?.classList.add('pulse');
        } else {
            this.minutesDisplay?.classList.remove('pulse');
            this.secondsDisplay?.classList.remove('pulse');
        }
    }
    
    updateProgress() {
        const progressPercentage = ((this.totalTime - this.currentTime) / this.totalTime) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = `${progressPercentage}%`;
            
            // Mudança de cor baseada no progresso
            if (progressPercentage >= 80) {
                this.progressBar.style.background = 'var(--neon-green)';
            } else if (progressPercentage >= 50) {
                this.progressBar.style.background = 'var(--neon-yellow)';
            } else {
                this.progressBar.style.background = 'var(--gradient-primary)';
            }
        }
    }
    
    updateButtonStates() {
        if (this.startButton && this.pauseButton && this.resetButton) {
            if (this.isRunning) {
                this.startButton.disabled = true;
                this.pauseButton.disabled = false;
                this.resetButton.disabled = false;
                
                this.startButton.textContent = 'Executando...';
                this.pauseButton.textContent = 'Pausar';
            } else if (this.isPaused) {
                this.startButton.disabled = false;
                this.pauseButton.disabled = true;
                this.resetButton.disabled = false;
                
                this.startButton.textContent = 'Continuar';
                this.pauseButton.textContent = 'Pausado';
            } else {
                this.startButton.disabled = false;
                this.pauseButton.disabled = true;
                this.resetButton.disabled = false;
                
                this.startButton.textContent = 'Iniciar';
                this.pauseButton.textContent = 'Pausar';
            }
        }
    }
    
    playCompletionAnimation() {
        // Animação de fogos de artifício (simulada)
        const timerContainer = document.querySelector('.timer-container');
        
        if (timerContainer) {
            // Criar elementos de celebração
            for (let i = 0; i < 10; i++) {
                const celebration = document.createElement('div');
                celebration.className = 'celebration-particle';
                celebration.style.cssText = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: var(--neon-cyan);
                    border-radius: 50%;
                    pointer-events: none;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    animation: celebration-burst 1s ease-out forwards;
                    animation-delay: ${i * 0.1}s;
                `;
                
                timerContainer.appendChild(celebration);
                
                // Remover após animação
                setTimeout(() => {
                    if (celebration.parentNode) {
                        celebration.parentNode.removeChild(celebration);
                    }
                }, 1000 + (i * 100));
            }
        }
        
        // Efeito de brilho no display
        const timerDisplay = document.querySelector('.timer-display');
        if (timerDisplay) {
            timerDisplay.classList.add('neon-glow');
            setTimeout(() => {
                timerDisplay.classList.remove('neon-glow');
            }, 2000);
        }
    }
    
    showNotification(message, type = 'info') {
        // Usar a função global de notificação se disponível
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`Timer: ${message}`);
        }
    }
    
    // Método para definir tempo customizado
    setCustomTime(minutes) {
        if (!this.isRunning) {
            this.totalTime = minutes * 60;
            this.currentTime = this.totalTime;
            this.updateDisplay();
            this.updateProgress();
        }
    }
    
    // Método para obter tempo restante
    getTimeRemaining() {
        return {
            minutes: Math.floor(this.currentTime / 60),
            seconds: this.currentTime % 60,
            total: this.currentTime
        };
    }
    
    // Método para verificar se está rodando
    isTimerRunning() {
        return this.isRunning;
    }
}

// Adicionar estilos CSS para animações do timer
function addTimerStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebration-burst {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            50% {
                transform: translate(-50%, -50%) scale(1) translateX(${Math.random() * 200 - 100}px) translateY(${Math.random() * 200 - 100}px);
                opacity: 0.8;
            }
            100% {
                transform: translate(-50%, -50%) scale(0) translateX(${Math.random() * 300 - 150}px) translateY(${Math.random() * 300 - 150}px);
                opacity: 0;
            }
        }
        
        .timer-display.neon-glow {
            animation: neon-glow 0.5s ease-in-out 4;
        }
        
        .progress-bar.completed {
            background: var(--neon-green) !important;
            box-shadow: 0 0 20px var(--neon-green);
            animation: pulse 0.5s ease-in-out 3;
        }
        
        .btn-timer.active {
            background: var(--neon-cyan) !important;
            color: var(--dark-bg) !important;
            box-shadow: 0 0 20px var(--neon-cyan);
        }
        
        .btn-timer:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .celebration-particle {
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar timer quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    addTimerStyles();
    
    // Aguardar um pouco para garantir que todos os elementos estejam carregados
    setTimeout(() => {
        window.exerciseTimer = new ExerciseTimer();
        console.log('🤖 Timer de Exercícios Inicializado');
    }, 500);
});

// Função para uso externo
function getTimer() {
    return window.exerciseTimer;
}

// Exportar para uso global
window.getTimer = getTimer;

