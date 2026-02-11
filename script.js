// Variables globales
let currentScreen = 'heartRain';
let hearts = [];
let animationFrameId;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initHeartRain();
    setupEventListeners();
});

// Configurar listeners de eventos
function setupEventListeners() {
    // Tecla para comenzar
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleClick);
    
    // Botones
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    
    yesBtn.addEventListener('click', handleYesClick);
    
    // Detectar cuando el mouse se acerca al botón NO desde cualquier dirección
    noBtn.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        handleNoHover(e);
    });
    noBtn.addEventListener('mousemove', (e) => {
        e.stopPropagation();
        handleNoHover(e);
    });
    
    // Detectar movimiento del mouse cerca del botón (área más amplia)
    const questionContainer = document.querySelector('.question-container');
    questionContainer.addEventListener('mousemove', (e) => {
        // Solo procesar si no es el botón SÍ
        if (e.target.id === 'yesBtn' || e.target.closest('#yesBtn')) {
            return;
        }
        
        const noBtn = document.getElementById('noBtn');
        const rect = noBtn.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calcular distancia del mouse al centro del botón
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
            Math.pow(mouseX - btnCenterX, 2) + 
            Math.pow(mouseY - btnCenterY, 2)
        );
        
        // Si el mouse está a menos de 200px del botón, moverlo
        if (distance < 200) {
            handleNoHover(e);
        }
    });
    
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Intentar mover el botón cuando se hace click
        handleNoHover(e);
    });

    // Soporte para móviles: mover al tocar
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Evita que se genere el click
        if (e.touches && e.touches.length > 0) {
            handleNoHover(e.touches[0]);
        }
    });
}

// Manejar tecla presionada
function handleKeyPress(e) {
    if (currentScreen === 'heartRain') {
        transitionToFlowers();
    }
}

// Manejar click
function handleClick(e) {
    if (currentScreen === 'heartRain' && e.target.id !== 'yesBtn' && e.target.id !== 'noBtn') {
        transitionToFlowers();
    }
}

// Inicializar lluvia de flores
function initHeartRain() {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Emojis para la lluvia (flores, corazones, estrellas)
    const rainEmojis = ['🌸', '🌹', '🌷', '🌺', '💖', '💕', '💗', '❤️', '🌟', '✨'];
    
    // Crear elementos
    const itemCount = 100;
    // Reutilizamos la variable hearts como container
    hearts = []; 
    
    for (let i = 0; i < itemCount; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 20 + 20, // Un poco más grandes para que se vean bien
            speed: Math.random() * 2 + 1,
            text: rainEmojis[Math.floor(Math.random() * rainEmojis.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05
        });
    }
    
    // Animar flores
    function animateFlowers() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hearts.forEach(flower => {
            // Actualizar posición
            flower.y += flower.speed;
            flower.rotation += flower.rotationSpeed;
            
            // Reiniciar si sale de la pantalla
            if (flower.y > canvas.height + 50) {
                flower.y = -flower.size;
                flower.x = Math.random() * canvas.width;
            }
            
            // Dibujar flor
            drawFlower(ctx, flower.x, flower.y, flower.size, flower.text, flower.rotation);
        });
        
        if (currentScreen === 'heartRain') {
            animationFrameId = requestAnimationFrame(animateFlowers);
        }
    }
    
    animateFlowers();
}

// Dibujar flor (emoji) en Canvas
function drawFlower(ctx, x, y, size, text, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

// Transición a la escena de Flores
function transitionToFlowers() {
    if (currentScreen !== 'heartRain') return;
    
    // Cancelar animación del canvas para ahorrar recursos
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    currentScreen = 'flowerScene';
    switchScreen('heartRain', 'flowerScene');
    
    // Iniciar animación de flores
    animateFlowers();
}

// Animar flores y corazones cruzando la pantalla
function animateFlowers() {
    const container = document.getElementById('flowersContainer');
    // Emojis de flores y corazones
    const items = ['🌸', '🌹', '🌻', '🌷', '🌺', '💖', '💕', '💗', '🌼', '💐'];
    
    // Cantidad de elementos
    const totalItems = 40;
    let completedItems = 0;
    
    // Crear elementos progresivamente
    for (let i = 0; i < totalItems; i++) {
        setTimeout(() => {
            const item = document.createElement('div');
            item.classList.add('flowering-item');
            item.textContent = items[Math.floor(Math.random() * items.length)];
            
            // Posición vertical aleatoria (10% a 90% de la altura)
            item.style.top = Math.random() * 80 + 10 + '%';
            
            // Tamaño aleatorio
            const size = Math.random() * 2 + 1.5; // Entre 1.5rem y 3.5rem
            item.style.fontSize = `${size}rem`;
            
            // Animación
            const duration = Math.random() * 2 + 1.5; // Entre 1.5 y 3.5 segundos (Más rápido)
            item.style.animationName = 'floatAcross';
            item.style.animationDuration = `${duration}s`;
            
            container.appendChild(item);
            
            // Detectar fin de animación para contar y limpiar
            item.addEventListener('animationend', () => {
                item.remove();
                completedItems++;
                
                // Si la mayoría ya pasó, cambiamos de pantalla
                // No esperamos al 100% para que sea más fluido
                if (completedItems >= totalItems - 5) {
                   // Solo llamamos una vez a la transición
                   if (currentScreen === 'flowerScene') {
                       transitionToQuestion();
                   }
                }
            });
            
        }, i * 80); // Intervalo de aparición más rápido
    }
}

// Transición a la pantalla de pregunta
function transitionToQuestion() {
    currentScreen = 'questionScreen';
    switchScreen('flowerScene', 'questionScreen');
    createParticles();
    
    // Asegurar que los botones tengan posición inicial correcta
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    
    // Botón NO: posición relativa inicial
    noBtn.style.position = 'relative';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.transform = '';
    noBtn.classList.remove('absolute');
    
    // Eliminar placeholder si existe
    const placeholder = document.getElementById('noBtn-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    // Botón SÍ: siempre posición relativa (no se mueve)
    yesBtn.style.position = 'relative';
    yesBtn.style.left = '';
    yesBtn.style.top = '';
}

// Cambiar de pantalla
function switchScreen(from, to) {
    const fromScreen = document.getElementById(from);
    const toScreen = document.getElementById(to);
    
    // Efecto de fade out
    fromScreen.style.opacity = '0';
    fromScreen.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
        
        // Efecto de fade in
        setTimeout(() => {
            toScreen.style.opacity = '1';
            toScreen.style.transform = 'scale(1)';
        }, 50);
    }, 300);
}

// Manejar hover del botón NO
function handleNoHover(e) {
    // Asegurar que solo trabajamos con el botón NO
    const noBtn = document.getElementById('noBtn');
    if (!noBtn) return;
    const rect = noBtn.getBoundingClientRect();
    const buttonsContainer = document.querySelector('.buttons-container');
    const containerRect = buttonsContainer.getBoundingClientRect();
    const questionBox = document.querySelector('.question-box');
    const boxRect = questionBox.getBoundingClientRect();
    
    // Obtener posición del mouse relativa a la ventana
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calcular centro del botón
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    // Calcular distancia y dirección desde el mouse al botón
    const deltaX = btnCenterX - mouseX;
    const deltaY = btnCenterY - mouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Si el mouse está muy cerca (menos de 150px), mover el botón MUY lejos
    if (distance < 150) {
        // Calcular dirección opuesta al mouse (normalizada)
        const dirX = deltaX / distance;
        const dirY = deltaY / distance;
        
        // Mover MUY lejos en dirección opuesta (300-500px)
        const moveDistance = 300 + Math.random() * 200;
        let newX = btnCenterX + dirX * moveDistance - rect.width / 2;
        let newY = btnCenterY + dirY * moveDistance - rect.height / 2;
        
        // Si se sale del contenedor, moverlo al lado opuesto de la pantalla
        const questionBoxRect = questionBox.getBoundingClientRect();
        const padding = 50;
        
        // Si se sale por la izquierda, ponerlo a la derecha
        if (newX < questionBoxRect.left + padding) {
            newX = questionBoxRect.right - rect.width - padding;
        }
        // Si se sale por la derecha, ponerlo a la izquierda
        else if (newX > questionBoxRect.right - rect.width - padding) {
            newX = questionBoxRect.left + padding;
        }
        
        // Si se sale por arriba, ponerlo abajo
        if (newY < questionBoxRect.top + padding) {
            newY = questionBoxRect.bottom - rect.height - padding;
        }
        // Si se sale por abajo, ponerlo arriba
        else if (newY > questionBoxRect.bottom - rect.height - padding) {
            newY = questionBoxRect.top + padding;
        }
        
        // Asegurar que esté dentro de los límites del question-box
        newX = Math.max(questionBoxRect.left + padding, 
                       Math.min(newX, questionBoxRect.right - rect.width - padding));
        newY = Math.max(questionBoxRect.top + padding, 
                       Math.min(newY, questionBoxRect.bottom - rect.height - padding));
        
        // Convertir a posición relativa al contenedor de botones
        const relativeX = newX - containerRect.left;
        const relativeY = newY - containerRect.top;
        
        // Crear un placeholder invisible para mantener el espacio en el layout
        let placeholder = document.getElementById('noBtn-placeholder');
        if (!placeholder) {
            placeholder = document.createElement('span');
            placeholder.id = 'noBtn-placeholder';
            placeholder.style.visibility = 'hidden';
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.display = 'inline-block';
            noBtn.parentNode.insertBefore(placeholder, noBtn);
        }
        
        // Aplicar transición rápida
        noBtn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        noBtn.classList.add('absolute');
        noBtn.style.position = 'absolute';
        noBtn.style.left = relativeX + 'px';
        noBtn.style.top = relativeY + 'px';
        
        // Efecto de rotación más pronunciado
        const rotation = (Math.random() - 0.5) * 30;
        noBtn.style.transform = `rotate(${rotation}deg) scale(0.9)`;
        
        // Efecto visual de "escape" más intenso
        noBtn.style.boxShadow = '0 15px 40px rgba(244, 67, 54, 0.7)';
        
        // Crear partículas de escape
        createEscapeParticles(btnCenterX, btnCenterY);
    } else if (distance < 200) {
        // Si el mouse está acercándose (200-150px), empezar a moverse
        const dirX = deltaX / distance;
        const dirY = deltaY / distance;
        const moveDistance = 150 + Math.random() * 100;
        
        let newX = btnCenterX + dirX * moveDistance - rect.width / 2;
        let newY = btnCenterY + dirY * moveDistance - rect.height / 2;
        
        const questionBoxRect = questionBox.getBoundingClientRect();
        const padding = 50;
        
        // Ajustar si se sale de los límites
        if (newX < questionBoxRect.left + padding) {
            newX = questionBoxRect.right - rect.width - padding;
        } else if (newX > questionBoxRect.right - rect.width - padding) {
            newX = questionBoxRect.left + padding;
        }
        
        if (newY < questionBoxRect.top + padding) {
            newY = questionBoxRect.bottom - rect.height - padding;
        } else if (newY > questionBoxRect.bottom - rect.height - padding) {
            newY = questionBoxRect.top + padding;
        }
        
        newX = Math.max(questionBoxRect.left + padding, 
                       Math.min(newX, questionBoxRect.right - rect.width - padding));
        newY = Math.max(questionBoxRect.top + padding, 
                       Math.min(newY, questionBoxRect.bottom - rect.height - padding));
        
        const relativeX = newX - containerRect.left;
        const relativeY = newY - containerRect.top;
        
        // Crear un placeholder invisible para mantener el espacio en el layout
        let placeholder = document.getElementById('noBtn-placeholder');
        if (!placeholder) {
            placeholder = document.createElement('span');
            placeholder.id = 'noBtn-placeholder';
            placeholder.style.visibility = 'hidden';
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.display = 'inline-block';
            noBtn.parentNode.insertBefore(placeholder, noBtn);
        }
        
        noBtn.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        noBtn.classList.add('absolute');
        noBtn.style.position = 'absolute';
        noBtn.style.left = relativeX + 'px';
        noBtn.style.top = relativeY + 'px';
    }
    
    // Resetear transformación después de un momento (pero mantener posición)
    setTimeout(() => {
        noBtn.style.transform = 'rotate(0deg) scale(1)';
        noBtn.style.boxShadow = '0 8px 0 #000, 0 12px 20px rgba(0, 0, 0, 0.3)';
    }, 400);
}

// Manejar click en SÍ
function handleYesClick() {
    createSuccessParticles();
    setTimeout(() => {
        transitionToSuccess();
    }, 500);
}

// Crear partículas de celebración
function createSuccessParticles() {
    const yesBtn = document.getElementById('yesBtn');
    const rect = yesBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const emojis = ['💖', '💕', '💗', '💓', '💝', '❤️', '💟', '❣️'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.animationDelay = (i * 0.05) + 's';
        particle.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100 + Math.random() * 50;
        particle.style.setProperty('--end-x', (Math.cos(angle) * distance) + 'px');
        particle.style.setProperty('--end-y', (Math.sin(angle) * distance) + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

// Crear partículas al aparecer la pregunta
function createParticles() {
    const questionBox = document.querySelector('.question-box');
    const rect = questionBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const emojis = ['💖', '💕', '💗'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.animationDelay = '0s';
            particle.style.animationDuration = '2s';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            particle.style.setProperty('--end-x', (Math.cos(angle) * distance) + 'px');
            particle.style.setProperty('--end-y', (Math.sin(angle) * distance) + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }, i * 50);
    }
}

// Transición a la pantalla de éxito
function transitionToSuccess() {
    currentScreen = 'successScreen';
    switchScreen('questionScreen', 'successScreen');
    
    // Animación continua de corazones flotantes
    setInterval(() => {
        createFloatingHeart();
    }, 500);
}

// Crear corazón flotante
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'particle';
    heart.textContent = '💖';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Crear partículas de "escape" (ahora solo visuales) del botón NO
function createEscapeParticles(x, y) {
    const symbols = ['💔', '🚫', '😢', '❌'];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        // Ajuste un poco aleatorio para que no salgan todos del mismo punto exacto
        const randomOffsetX = (Math.random() - 0.5) * 20;
        const randomOffsetY = (Math.random() - 0.5) * 20;

        particle.style.left = (x + randomOffsetX) + 'px';
        particle.style.top = (y + randomOffsetY) + 'px';
        particle.style.fontSize = '1.5rem';
        particle.style.zIndex = '100'; // Asegurar que se vean encima de todo
        particle.style.animationDuration = '1s';
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 40 + Math.random() * 30; // Distancia de dispersión
        particle.style.setProperty('--end-x', (Math.cos(angle) * distance) + 'px');
        particle.style.setProperty('--end-y', (Math.sin(angle) * distance - 50) + 'px'); // -50 para que suban
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Mejorar animaciÃ³n de partÃ­culas con CSS custom
const style = document.createElement('style');
style.textContent = `
    .particle {
        --end-x: 0px;
        --end-y: -100px;
    }
    
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translate(var(--end-x), var(--end-y)) scale(1.5) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

