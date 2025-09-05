// Sistema de Notificações - SESC Campo Mourão

class NotificationSystem {
    constructor() {
        this.isEnabled = false;
        this.scheduledTime = '08:00'; // 8h da manhã
        this.permission = 'default';
        this.intervalId = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.checkPermissionStatus();
        this.loadSettings();
    }
    
    initializeElements() {
        this.enableButton = document.getElementById('enable-notifications');
        this.statusText = document.querySelector('.status-text');
        this.statusIndicator = document.querySelector('.status-indicator');
    }
    
    setupEventListeners() {
        if (this.enableButton) {
            this.enableButton.addEventListener('click', () => this.toggleNotifications());
        }
        
        // Verificar permissões quando a página ganha foco
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkPermissionStatus();
            }
        });
    }
    
    async toggleNotifications() {
        if (!this.isEnabled) {
            await this.enableNotifications();
        } else {
            this.disableNotifications();
        }
    }
    
    async enableNotifications() {
        try {
            // Verificar se o navegador suporta notificações
            if (!('Notification' in window)) {
                this.showError('Seu navegador não suporta notificações');
                return;
            }
            
            // Solicitar permissão
            const permission = await Notification.requestPermission();
            this.permission = permission;
            
            if (permission === 'granted') {
                this.isEnabled = true;
                this.startNotificationScheduler();
                this.updateUI();
                this.saveSettings();
                
                // Mostrar notificação de teste
                this.showTestNotification();
                
                this.showSuccess('Notificações ativadas com sucesso! 🤖');
            } else if (permission === 'denied') {
                this.showError('Permissão negada. Ative as notificações nas configurações do navegador.');
            } else {
                this.showError('Permissão não concedida. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao ativar notificações:', error);
            this.showError('Erro ao ativar notificações. Tente novamente.');
        }
    }
    
    disableNotifications() {
        this.isEnabled = false;
        this.stopNotificationScheduler();
        this.updateUI();
        this.saveSettings();
        
        this.showInfo('Notificações desativadas');
    }
    
    startNotificationScheduler() {
        // Limpar scheduler anterior se existir
        this.stopNotificationScheduler();
        
        // Verificar a cada minuto se é hora de enviar notificação
        this.intervalId = setInterval(() => {
            this.checkTimeForNotification();
        }, 60000); // 1 minuto
        
        console.log('🤖 Scheduler de notificações iniciado');
    }
    
    stopNotificationScheduler() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('🤖 Scheduler de notificações parado');
        }
    }
    
    checkTimeForNotification() {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                           now.getMinutes().toString().padStart(2, '0');
        
        if (currentTime === this.scheduledTime && this.isEnabled) {
            this.sendDailyNotification();
        }
    }
    
    sendDailyNotification() {
        const title = '🤖 SESC - Hora do Alongamento!';
        const options = {
            body: 'É hora de cuidar da sua saúde com 5 minutos de alongamento futurístico!',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2300FFFF"/><text x="50" y="60" text-anchor="middle" font-size="40">🤖</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%230066CC"/></svg>',
            tag: 'sesc-alongamento-diario',
            requireInteraction: true,
            actions: [
                {
                    action: 'start-exercise',
                    title: 'Começar Agora'
                },
                {
                    action: 'remind-later',
                    title: 'Lembrar em 30min'
                }
            ],
            data: {
                url: window.location.href + '#exercicios',
                timestamp: Date.now()
            }
        };
        
        const notification = new Notification(title, options);
        
        // Configurar eventos da notificação
        notification.onclick = (event) => {
            event.preventDefault();
            window.focus();
            
            // Navegar para seção de exercícios
            if (typeof window.scrollToSection === 'function') {
                window.scrollToSection('exercicios');
            }
            
            notification.close();
        };
        
        notification.onshow = () => {
            console.log('🤖 Notificação diária enviada');
            this.logNotificationSent();
        };
        
        notification.onerror = (error) => {
            console.error('Erro na notificação:', error);
        };
        
        // Fechar automaticamente após 10 segundos
        setTimeout(() => {
            notification.close();
        }, 10000);
    }
    
    showTestNotification() {
        const title = '🤖 SESC - Teste de Notificação';
        const options = {
            body: 'Notificações configuradas com sucesso! Você receberá lembretes diários às 8h.',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2300FF00"/><text x="50" y="60" text-anchor="middle" font-size="40">✅</text></svg>',
            tag: 'sesc-test-notification'
        };
        
        const notification = new Notification(title, options);
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        // Fechar automaticamente após 5 segundos
        setTimeout(() => {
            notification.close();
        }, 5000);
    }
    
    checkPermissionStatus() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
            
            // Se tinha permissão mas agora não tem mais
            if (this.isEnabled && this.permission !== 'granted') {
                this.isEnabled = false;
                this.stopNotificationScheduler();
                this.updateUI();
                this.saveSettings();
            }
        }
    }
    
    updateUI() {
        if (this.statusText && this.statusIndicator && this.enableButton) {
            if (this.isEnabled && this.permission === 'granted') {
                this.statusText.textContent = `Status: Ativo (${this.scheduledTime})`;
                this.statusIndicator.classList.add('active');
                this.enableButton.textContent = 'Desativar Notificações';
                this.enableButton.classList.remove('btn-primary');
                this.enableButton.classList.add('btn-secondary');
            } else {
                this.statusText.textContent = 'Status: Desativado';
                this.statusIndicator.classList.remove('active');
                this.enableButton.textContent = 'Ativar Notificações';
                this.enableButton.classList.remove('btn-secondary');
                this.enableButton.classList.add('btn-primary');
            }
        }
    }
    
    saveSettings() {
        const settings = {
            isEnabled: this.isEnabled,
            scheduledTime: this.scheduledTime,
            permission: this.permission,
            lastSaved: Date.now()
        };
        
        localStorage.setItem('sesc-notification-settings', JSON.stringify(settings));
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('sesc-notification-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.isEnabled = settings.isEnabled || false;
                this.scheduledTime = settings.scheduledTime || '08:00';
                
                // Verificar se ainda tem permissão
                if (this.isEnabled && this.permission === 'granted') {
                    this.startNotificationScheduler();
                } else if (this.isEnabled && this.permission !== 'granted') {
                    this.isEnabled = false;
                }
                
                this.updateUI();
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    }
    
    logNotificationSent() {
        const logs = this.getNotificationLogs();
        logs.push({
            timestamp: Date.now(),
            date: new Date().toISOString(),
            type: 'daily-reminder'
        });
        
        // Manter apenas os últimos 30 logs
        if (logs.length > 30) {
            logs.splice(0, logs.length - 30);
        }
        
        localStorage.setItem('sesc-notification-logs', JSON.stringify(logs));
    }
    
    getNotificationLogs() {
        try {
            const logs = localStorage.getItem('sesc-notification-logs');
            return logs ? JSON.parse(logs) : [];
        } catch (error) {
            console.error('Erro ao carregar logs:', error);
            return [];
        }
    }
    
    // Métodos para mostrar mensagens
    showSuccess(message) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, 'success');
        } else {
            console.log(`✅ ${message}`);
        }
    }
    
    showError(message) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, 'error');
        } else {
            console.error(`❌ ${message}`);
        }
    }
    
    showInfo(message) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, 'info');
        } else {
            console.log(`ℹ️ ${message}`);
        }
    }
    
    // Método para personalizar horário
    setScheduledTime(time) {
        if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            this.scheduledTime = time;
            this.saveSettings();
            this.updateUI();
            
            if (this.isEnabled) {
                this.showSuccess(`Horário atualizado para ${time}`);
            }
        } else {
            this.showError('Formato de horário inválido. Use HH:MM');
        }
    }
    
    // Método para obter estatísticas
    getStats() {
        const logs = this.getNotificationLogs();
        const today = new Date().toDateString();
        const thisWeek = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            const daysDiff = (Date.now() - log.timestamp) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
        });
        
        return {
            totalNotifications: logs.length,
            thisWeekNotifications: thisWeek.length,
            isEnabled: this.isEnabled,
            scheduledTime: this.scheduledTime,
            permission: this.permission
        };
    }
}

// Função para criar interface de personalização de horário
function createTimeCustomizer() {
    const customizer = document.createElement('div');
    customizer.className = 'time-customizer';
    customizer.innerHTML = `
        <div class="customizer-content">
            <h4>Personalizar Horário</h4>
            <input type="time" id="custom-time" value="08:00">
            <button class="btn btn-small" onclick="updateNotificationTime()">Atualizar</button>
        </div>
    `;
    
    const notificationSection = document.querySelector('.notification-content');
    if (notificationSection) {
        notificationSection.appendChild(customizer);
    }
}

// Função para atualizar horário da notificação
function updateNotificationTime() {
    const timeInput = document.getElementById('custom-time');
    if (timeInput && window.notificationSystem) {
        window.notificationSystem.setScheduledTime(timeInput.value);
    }
}

// Adicionar estilos CSS para o sistema de notificações
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .time-customizer {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            border: 1px solid rgba(0, 255, 255, 0.2);
        }
        
        .customizer-content h4 {
            color: var(--neon-cyan);
            margin-bottom: 1rem;
        }
        
        .customizer-content input[type="time"] {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--neon-cyan);
            border-radius: 8px;
            padding: 0.5rem;
            color: var(--white);
            margin-right: 1rem;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }
        
        .status-indicator {
            transition: all 0.3s ease;
        }
        
        .status-indicator.active {
            animation: pulse 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar sistema de notificações
document.addEventListener('DOMContentLoaded', function() {
    addNotificationStyles();
    
    // Aguardar um pouco para garantir que todos os elementos estejam carregados
    setTimeout(() => {
        window.notificationSystem = new NotificationSystem();
        createTimeCustomizer();
        console.log('🤖 Sistema de Notificações Inicializado');
    }, 500);
});

// Função para uso externo
function getNotificationSystem() {
    return window.notificationSystem;
}

// Exportar para uso global
window.getNotificationSystem = getNotificationSystem;
window.updateNotificationTime = updateNotificationTime;

