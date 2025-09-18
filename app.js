(() => {
  const state = {
    players: [],
    range: 0,
    amount: 0,
    getLimit: false,
    prize: 0,
  };

  function init() {
    loadInitialData();
    listeners();
    render();
  }

  function loadInitialData() {
    const storedPlayers = JSON.parse(localStorage.getItem("players"));
    if (storedPlayers) {
      state.players = storedPlayers;
    }
  }

  function listeners() {
    const buttonSetRange = document.getElementById("set_range");
    if (buttonSetRange) {
      buttonSetRange.addEventListener("click", (e) => {
        e.preventDefault();

        getRangeAndAmount();
      });
    }

    const buttonAddPlayer = document.getElementById("add");
    if (buttonAddPlayer) {
      buttonAddPlayer.type = "button";
      buttonAddPlayer.addEventListener("click", (e) => {
        e.preventDefault();
        addPlayer();
      });
    }
  }

  function getRangeAndAmount() {
    const inputRange = document.getElementById("input_range");
    const inputAmount = document.getElementById("input_amount");
    const sectionPlayer = document.getElementById("add_player");
    const addPlayerForm = document.getElementById("add_player_form"); //!cambio Agregado

    if (inputRange && inputAmount) {
      const range = parseInt(inputRange.value);
      const amount = parseInt(inputAmount.value);
      if (range !== 0 && amount !== 0) {
        sectionPlayer.style.display = "flex";
      }

      if (!isNaN(range) && !isNaN(amount)) {
        if (range > 1 && range <= 100) {
          state.range = range;
          state.amount = amount;
          state.prize = range * amount * 0.8;
          setMessageRange(state.range, state.amount, state.prize);

          // 👇 Forzamos a mostrar la sección de jugadores en cada ronda
          sectionPlayer.style.display = "flex";
          if (addPlayerForm) addPlayerForm.style.display = "block";

          render();
        } else {
          alert(
            "El número está fuera de rango, debe ser mayor que 2 y no pasar el número 100!"
          );
        }

        inputRange.value = "";
        inputAmount.value = "";
      } else {
        alert(
          "Ambos campos requieren ser llenados con un dato de tipo número. Ingresa un número y una apuesta valida, por favor!"
        );
        inputRange.value = "";
        inputAmount.value = "";
      }
    }
  }

  function setMessageRange(range, amount, prize) {
    const sectionRange = document.getElementById("range");
    const divRangeField = document.getElementById("range_field");
    divRangeField.style.display = "none";

    const divMessage = document.createElement("div");
    divMessage.id = "message";
    divMessage.innerHTML = `<p>El número de participantes para este sorteo es de ${range} posiciones y la apuesta es de ${amount} pesos, por cada jugador. El ganador se lleva ${prize}!!!`;
    sectionRange.appendChild(divMessage);
  }

  function displayOptions() {
    const selectOptions = document.getElementById("numbers");

    if (selectOptions) {
      selectOptions.innerHTML = "";
      for (let i = 1; i <= state.range; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;

        const isTaken = state.players.some(
          (player) => parseInt(player.number) === i
        );

        if (isTaken) {
          option.disabled = true;
          option.style.color = "red";
        }
        selectOptions.appendChild(option);
      }
    }
  }

  function addPlayer() {
    const inputName = document.getElementById("name");
    const optionSelect = document.getElementById("numbers");
    const name = inputName.value;
    const number = optionSelect.value;

    if (name && number) {
      // ✅ Validamos si ya existe un jugador con ese nombre
      const exists = state.players.some((p) => p.name === name);
      if (exists) {
        alert("Ese nombre ya está en uso, elige otro.");
        return;
      }

      const player = { name, number };
      state.players.push(player);
      reachLimit();
      addLocalStoragePlayers();
      render();
      inputName.value = "";
    } else {
      alert("Agrega nombre y selecciona un número para participar.");
    }
  }

  function reachLimit() {
    if (state.players.length === state.range) {
      state.getLimit = true;
      if (state.getLimit === true) {
        const sectionAddPlayer = document.getElementById("add_player");
        const divAddPlayerForm = document.getElementById("add_player_form");
        if (divAddPlayerForm) {
          divAddPlayerForm.style.display = "none";
          const h2 = document.createElement("h2");
          h2.id = "message_title";
          h2.textContent =
            "El cupo de jugadores está completo. Ahora JUGEMOS!!!";
          sectionAddPlayer.appendChild(h2);
        }
      }
    }
  }

  function addLocalStoragePlayers() {
    localStorage.setItem("players", JSON.stringify(state.players));
  }

  function displayPlayers() {
    const playersSection = document.getElementById("display_players");
    if (!playersSection) return;
    playersSection.innerHTML = "";

    if (state.players.length > 0) {
      playersSection.style.display = "flex";
      playersSection.className = "display_players";

      const h2 = document.createElement("h2");
      h2.id = "players_title";
      h2.innerHTML = "Participantes";

      const buttonDeleteAll = document.createElement("button");
      buttonDeleteAll.textContent = "Borrar todos";
      buttonDeleteAll.id = "delete_all_players";
      buttonDeleteAll.addEventListener("click", () => deleteAllPlayers());

      const buttonPlay = document.createElement("button");
      buttonPlay.textContent = "Jugar";
      buttonPlay.id = "play";
      buttonPlay.addEventListener("click", () => play());

      const divAllPlayers = document.createElement("div");
      divAllPlayers.id = "section_div_player";

      for (let i = 0; i < state.players.length; i++) {
        const divPlayer = document.createElement("div");
        divPlayer.className = "info_player";
        const buttonDeletePlayer = document.createElement("button");
        buttonDeletePlayer.textContent = "Borrar";
        buttonDeletePlayer.className = "delete_player";
        buttonDeletePlayer.id = `delete_player_${state.players[i].number}`;
        buttonDeletePlayer.addEventListener("click", () => {
          deletePlayer(state.players[i].number);
        });

        divPlayer.innerHTML = `<h4>Nombre de jugador: ${state.players[i].name}.</h4> <h4>Número: ${state.players[i].number}.</h4>`;
        divPlayer.appendChild(buttonDeletePlayer);
        divAllPlayers.appendChild(divPlayer);
      }

      playersSection.appendChild(h2);
      playersSection.appendChild(buttonDeleteAll);
      playersSection.appendChild(divAllPlayers);
      playersSection.appendChild(buttonPlay);
    }
  }

  function deleteAllPlayers() {
    state.getLimit = false;

    const divAddPlayerForm = document.getElementById("add_player_form");
    const messageTitle = document.getElementById("message_title");
    if (divAddPlayerForm && messageTitle) {
      divAddPlayerForm.style.display = "block";
      messageTitle.style.display = "none";
    }
    state.players = [];
    if (state.players.length === 0) {
      document.getElementById("display_players").style.display = "none";
    }
    localStorage.removeItem("players");
    render();
  }

  function deletePlayer(number) {
    state.getLimit = false;

    const divAddPlayerForm = document.getElementById("add_player_form");
    const messageTitle = document.getElementById("message_title");
    if (divAddPlayerForm && messageTitle && !state.getLimit) {
      divAddPlayerForm.style.display = "block";
      messageTitle.style.display = "none";
    }
    // ✅ Se trabaja directamente con el estado para eliminar el jugador
    state.players = state.players.filter((player) => player.number !== number);

    if (state.players.length === 0) {
      document.getElementById("display_players").style.display = "none";
    }
    addLocalStoragePlayers();
    render();
  }

  function play() {
    // 1️⃣ Eliminar mensajes previos (mensaje inicial y cupo lleno)
    const divMessage = document.getElementById("message");
    if (divMessage) divMessage.remove();
    const messageTitle = document.getElementById("message_title");
    if (messageTitle) messageTitle.remove();

    if (state.players.length > 0) {
      state.getLimit = false;

      // 2️⃣ Crear overlay para bloquear la pantalla durante la "ruleta"
      const overlay = document.createElement("div");
      overlay.id = "roulette_overlay";

      // Número grande en el centro
      const numberDisplay = document.createElement("h1");
      numberDisplay.id = "roulette_number";
      numberDisplay.classList.add("winner-highlight"); //!Ojo agrego esta línea

      overlay.appendChild(numberDisplay);
      document.body.appendChild(overlay);

      // 3️⃣ Preparar el sonido tipo "tick"
      const tickSound = new Audio("audioGame.m4a");

      // 4️⃣ Configuración de la animación de la ruleta
      let rounds = 30; // cuántos cambios de número habrá
      let delay = 150; // velocidad inicial (ms) - más lento que antes

      const spin = () => {
        const randomIndex = Math.floor(Math.random() * state.players.length);
        const randomNumber = state.players[randomIndex].number;

        numberDisplay.textContent = randomNumber;

        // Reproducir sonido (reinicia el audio cada vez)
        tickSound.currentTime = 0;
        tickSound.play();

        rounds--;

        // Desacelerar gradualmente en las últimas rondas
        if (rounds < 5) {
          delay += 120;
        }

        if (rounds > 0) {
          setTimeout(spin, delay); // seguir girando
        } else {
          // 5️⃣ Cuando termina: elegir el número ganador real
          const winnerIndex = Math.floor(Math.random() * state.players.length);
          const winner = state.players[winnerIndex];
          numberDisplay.textContent = winner.number;

          // Agregar efecto especial al número ganador
          numberDisplay.classList.add("winner-highlight");

          // 6️⃣ Después de unos segundos, mostrar el mensaje oficial
          setTimeout(() => {
            document.body.removeChild(overlay);

            document.getElementById("range").style.display = "none";
            document.getElementById("add_player").style.display = "none";
            const playersSection = document.getElementById("display_players");
            if (playersSection) {
              playersSection.innerHTML = `
              <div class="winner-info">
                <h1>¡El ganador es: ${winner.name.toUpperCase()}!</h1>
                <h2>Con el número <strong>${winner.number}</strong></h2>
              </div>
            `;

              // Botón para iniciar nuevo juego
              const buttonReset = document.createElement("button");
              buttonReset.innerHTML = "<h3>Nuevo Juego</h3>";
              buttonReset.id = "reset";
              buttonReset.addEventListener("click", () => {
                newGame();
              });

              playersSection.appendChild(buttonReset);
            }
          }, 2500); // ganador se queda fijo 2.5 segundos antes del mensaje
        }
      };

      // 🔄 Arrancar la "ruleta"
      setTimeout(spin, delay);
    }
  }

  function newGame() {
    localStorage.removeItem("players");
    state.players = [];
    state.range = 0;
    state.amount = 0;
    state.getLimit = false;
    document.getElementById("range").style.display = "flex";
    document.getElementById("display_players").style.display = "none";

    const divMessage = document.getElementById("message");
    if (divMessage) divMessage.remove();

    const divRangeField = document.getElementById("range_field");
    divRangeField.style.display = "block";

    const addPlayerSection = document.getElementById("add_player");
    if (addPlayerSection) {
      addPlayerSection.style.display = "none";
    }

    render();
  }

  function render() {
    displayOptions();
    displayPlayers();
    console.log("DESDE EL RWNDER", state);
  }

  init();
})();
