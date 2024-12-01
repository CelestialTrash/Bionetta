function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId); // Detener el temporizador

  const displayText = document.querySelector("#displayText");
  if (!displayText) {
    console.error('Elemento "displayText" no encontrado');
    return;
  }

  displayText.style.display = "flex";

  // Mostrar el mensaje del ganador
  if (player.health === enemy.health) {
    displayText.innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    displayText.innerHTML = "Player 1 Wins!";
  } else {
    displayText.innerHTML = "Player 2 Wins!";
  }

  // Crear botón "Play Again"
  const playAgainLink = document.createElement("a");
  playAgainLink.href = "/"; // Cambiar por la URL del menú principal si es diferente
  playAgainLink.innerText = "Play Again";
  playAgainLink.style.color = "#818cf8";
  playAgainLink.style.textDecoration = "none";
  playAgainLink.style.marginTop = "20px";
  playAgainLink.style.fontSize = "18px";

  // Crear enlace adicional
  const additionalLink = document.createElement("a");
  additionalLink.href = "https://example.com"; // Cambia la URL por la que necesites
  additionalLink.innerText = "Bionetta Stems";
  additionalLink.style.color = "#818cf8";
  additionalLink.style.textDecoration = "none";
  additionalLink.style.marginTop = "10px";
  additionalLink.style.fontSize = "16px";

  // Limpiar contenido anterior y agregar enlaces
  displayText.innerHTML = "";
  displayText.appendChild(playAgainLink);
  displayText.appendChild(additionalLink);
}



let timer = 60; // Temporizador global
let timerId;

function decreaseTimer() {
  if (timer > 0) {
    timer--;
    timerId = setTimeout(decreaseTimer, 1000);

    const timerElement = document.querySelector("#timer");
    if (timerElement) {
      timerElement.innerHTML = timer;
    } else {
      console.error('Elemento "timer" no encontrado en el DOM.');
    }
  } else {
    determineWinner({ player, enemy, timerId }); // Llamar a determineWinner al finalizar
  }
}
