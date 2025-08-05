// --- Efeito de Digitação na Seção Hero ---
const typingTextElement = document.getElementById('typing-text');
const phrases = [
    "Fullstack Developer.",
    "Web Solutions.",
    "Digital Experiences.",
    "Clean and Efficient Code."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100; // Velocidade de digitação (ms por caractere)
let deletingSpeed = 50; // Velocidade de exclusão
let pauseTime = 1500; // Tempo de pausa antes de digitar/excluir (ms)

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    let displayText = '';

    if (isDeleting) {
        displayText = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        displayText = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    typingTextElement.textContent = displayText;

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
        currentSpeed = pauseTime;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        currentSpeed = 500; // Pequena pausa antes de começar a próxima frase
    }

    setTimeout(typeWriter, currentSpeed);
}

// --- Animação de Naves Espaciais no Canvas ---
const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

let ships = [];
const numShips = 10; // Número de naves
const shipSize = 10; // Tamanho base da nave
const shipColors = ['#00ff00', '#00ffff', '#ff00ff']; // Cores neon para as naves

// Função para redimensionar o canvas para preencher a tela
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recriar as naves para se ajustarem ao novo tamanho, se necessário
    if (ships.length === 0) { // Apenas na primeira vez
        initShips();
    }
}

// Objeto Nave Espacial
function Spaceship() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = shipSize + Math.random() * 5; // Variação de tamanho
    this.speedX = (Math.random() - 0.5) * 2; // Movimento horizontal sutil
    this.speedY = 1 + Math.random() * 2; // Velocidade de queda
    this.color = shipColors[Math.floor(Math.random() * shipColors.length)];

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10; // Efeito de brilho neon

        // Desenha um triângulo (simulando uma nave simples)
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size); // Ponta superior
        ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2); // Canto inferior esquerdo
        ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2); // Canto inferior direito
        ctx.closePath();
        ctx.fill();

        // Desenha um pequeno rastro de luz atrás
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.x - 1, this.y + this.size / 2, 2, this.size);
    };

    this.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Se a nave sair da tela, reposiciona-a no topo
        if (this.y > canvas.height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = 1 + Math.random() * 2;
            this.size = shipSize + Math.random() * 5;
            this.color = shipColors[Math.floor(Math.random() * shipColors.length)];
        }
        // Se a nave sair pelas laterais, reposiciona-a
        if (this.x < -this.size || this.x > canvas.width + this.size) {
             this.x = (this.x < -this.size) ? canvas.width + this.size : -this.size;
             this.y = Math.random() * canvas.height; // Pode aparecer em qualquer altura
        }
    };
}

// Inicializa as naves
function initShips() {
    ships = []; // Limpa array existente
    for (let i = 0; i < numShips; i++) {
        ships.push(new Spaceship());
    }
}

// Loop principal de animação
function animateGalaxy() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada frame

    // Desenha estrelas de fundo (efeito sutil)
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.random() + ')';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    ships.forEach(ship => {
        ship.update();
        ship.draw();
    });

    requestAnimationFrame(animateGalaxy); // Loop contínuo
}
// --- Formulário de Contato (simulado) ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    formStatus.textContent = 'Enviando...';
    formStatus.className = 'mt-4 text-center text-lg text-yellow-400';

    // Simula um envio assíncrono
    setTimeout(() => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            formStatus.textContent = 'Mensagem enviada com sucesso! Em breve entrarei em contato.';
            formStatus.className = 'mt-4 text-center text-lg text-green-400';
            contactForm.reset(); // Limpa o formulário
        } else {
            formStatus.textContent = 'Por favor, preencha todos os campos.';
            formStatus.className = 'mt-4 text-center text-lg text-red-400';
        }
    }, 2000); // Simula um atraso de 2 segundos
});

// --- Atualiza o ano no footer ---
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- Inicia as animações e efeitos quando a página carrega ---
window.onload = function() {
    typeWriter(); // Inicia o efeito de digitação
    resizeCanvas(); // Ajusta o canvas ao tamanho da janela
    initShips(); // Inicializa as naves
    animateGalaxy(); // Inicia o loop de animação das naves
};

// Ajusta o canvas ao redimensionar a janela
window.addEventListener('resize', resizeCanvas);
