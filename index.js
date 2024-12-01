const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let gameOver = false;



canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: -451
  },
  imageSrc: 'img/background test.webp'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: '',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: 'img/FINAL AQUILES/Idle Aqui 1.png',
  framesMax: 8,
  scale: 2.0,
  offset: {
    x: 15,
    y: 27
  },
  sprites: {
    idle: {
      imageSrc: 'img/Idle aqui bien.png',
      framesMax: 8
    },
    run: {
      imageSrc: 'img/FINAL AQUILES/Run Aqui 1.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'img/FINAL AQUILES/Jump Aqui 1.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'img/FINAL AQUILES/Fall Aqui 1.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: 'img/FINAL AQUILES/Attack2 Aqui 1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: 'img/FINAL AQUILES/Take Hit - white silhouette Aqui 1.png',
      framesMax: 4
    },
    death: {
      imageSrc: 'img/FINAL AQUILES/Death Aqui 1.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 250,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 100
  },
  imageSrc: 'img/Idle Male 1 bien.png',
  framesMax: 4,
  scale: 1.8,
  offset: {
    x: 215,
    y: 22
  },
  sprites: {
    idle: {
      imageSrc: 'img/Idle Male 1 bien.png',
      framesMax: 4
    },
    run: {
      imageSrc: 'img/Run Male 9.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'img/Jump Male 9.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'img/Fall Male 9.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: 'img/Attack1 Male 9.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: 'img/Take hit Male 99.png',
      framesMax: 3
    },
    death: {
      imageSrc: 'img/Death Male 9.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -320,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  if (gameOver) return; // Detener la animación si el juego ha terminado

  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Movimiento del jugador
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // Salto del jugador
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Movimiento del enemigo
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // Salto del enemigo
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // Detectar colisión y manejar daño al enemigo
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  // Si el ataque del jugador falla
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // Detectar colisión y manejar daño al jugador
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  // Si el ataque del enemigo falla
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // Terminar el juego si un jugador pierde toda la salud
  if (enemy.health <= 0 || player.health <= 0) {
    console.log("Un jugador ha perdido toda la salud. Llamando a determineWinner...");
    determineWinner({ player, enemy, timerId });
    gameOver = true; // Marcar el juego como terminado
    return; // Detener la animación
  }
}





animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

// Cargar los sonidos
const backgroundSound = new Audio('Sound/AbandonedChurch_BW.11598.mp3');
const startGameSound = new Audio('Sound/start-game-sound.mp3');
const hoverTitleSound = new Audio('Sound/Hover-title.mp3');
const buttonHoverSound = new Audio('Sound/botton-hover-sound.mp3'); // Sonido para botones
const celestialAttack1 = new Audio('Sound/Celestial Trash/BRS_Sword_Schwing_Fast_Thin_3.mp3'); // Sonido de ataque
const xyammAttack1 = new Audio('Sound/Xyamm Angel/SwordScrapeRapier_BW.59452.mp3'); 
const celestialHitSound = new Audio('Sound/Celestial Trash/BRS_Flesh_Splat_Beefy_Hit.mp3'); // Sonido de impacto
const xyammHitSound = new Audio('Sound/Xyamm Angel/BRS_Flesh_Squish_Bloody_Juicy_1.mp3'); // Sonido de impacto
// Ajustar el volumen del sonido (rango de 0 a 1)
backgroundSound.volume = 0.2;
startGameSound.volume = 0.2;
hoverTitleSound.volume = 0.2;
buttonHoverSound.volume = 0.2;
celestialAttack1.volume = 0.1;
xyammAttack1.volume = 0.2;
celestialHitSound.volume = 0.1;
xyammHitSound.volume = 0.1

// Función para iniciar el juego y el sonido de fondo
function startGame() {
  document.getElementById('game-menu').style.display = 'none';
  document.getElementById('web-container').style.visibility = 'visible';

  backgroundSound.loop = true;

  backgroundSound.play().catch((error) => {
    console.error('Error al reproducir el sonido de fondo:', error);
  });

  startGameSound.play().catch((error) => {
    console.error('Error al reproducir el sonido de inicio:', error);
  });
}

// Escucha del evento de clic para comenzar el juego
document.getElementById('start-game').addEventListener('click', startGame);

// Función para reproducir sonido cuando el mouse pasa sobre el título
function hoverTitleSoundPlay() {
  const title = document.querySelector('h1');
  title.addEventListener('mouseenter', () => {
    hoverTitleSound.currentTime = 0;
    hoverTitleSound.play().catch((error) => {
      console.error('Error al reproducir el sonido de hover sobre el título:', error);
    });
  });
}

// Llamar a la función para agregar el evento hover al título
hoverTitleSoundPlay();

// Función para hacer sonar el audio al hacer hover sobre cualquier botón
function buttonHoverSoundPlay() {
  const buttons = document.querySelectorAll('.menu-item');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      buttonHoverSound.currentTime = 0;
      buttonHoverSound.play().catch((error) => {
        console.error('Error al reproducir el sonido de hover en el botón:', error);
      });
    });
  });
}

// Llamar a la función para agregar el evento hover a los botones
buttonHoverSoundPlay();

// Función para reproducir sonido de ataque celestial al presionar la barra espaciadora
function celestialAttackOnSpacebar() {
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') { // Verificar si la tecla es la barra espaciadora
      celestialAttack1.currentTime = 0; // Reiniciar el sonido al inicio
      celestialAttack1.play().catch((error) => {
        console.error('Error al reproducir el sonido de ataque celestial:', error);
      });
    }
  });
}

celestialAttackOnSpacebar();

// Función para reproducir sonido de ataque de xyamm al presionar la flecha abajo
function xyammAttackOnArrowDown() {
  document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowDown') { // Verificar si la tecla es la flecha abajo
      xyammAttack1.currentTime = 0; // Reiniciar el sonido al inicio
      xyammAttack1.play().catch((error) => {
        console.error('Error al reproducir el sonido de ataque xyamm:', error);
      });
    }
  });
}

// Llamar a la función para escuchar la flecha abajo
xyammAttackOnArrowDown();
