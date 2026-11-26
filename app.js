import { normalizeName, selectWinner } from "./raffle.js";

const participantForm = document.querySelector("#participantForm");
const participantName = document.querySelector("#participantName");
const participantList = document.querySelector("#participantList");
const participantTemplate = document.querySelector("#participantTemplate");
const participantCount = document.querySelector("#participantCount");
const participantLabel = document.querySelector("#participantLabel");
const clearButton = document.querySelector("#clearButton");
const emptyState = document.querySelector("#emptyState");
const formError = document.querySelector("#formError");
const drawButton = document.querySelector("#drawButton");
const drawPanel = document.querySelector(".draw-panel");
const winnerKicker = document.querySelector(".winner-kicker");
const winnerTitle = document.querySelector("#winnerTitle");
const winnerName = document.querySelector("#winnerName");

let participants = [];

function renderParticipants() {
  participantList.replaceChildren();

  participants.forEach((name, index) => {
    const item = participantTemplate.content.cloneNode(true);
    const avatar = item.querySelector(".participant-avatar");
    const nameElement = item.querySelector(".participant-name");
    const removeButton = item.querySelector(".remove-button");

    avatar.textContent = name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    nameElement.textContent = name;
    removeButton.setAttribute("aria-label", `Eliminar a ${name}`);
    removeButton.dataset.index = String(index);

    participantList.append(item);
  });

  const count = participants.length;
  participantCount.textContent = String(count);
  participantLabel.textContent = count === 1 ? "participante" : "participantes";
  emptyState.hidden = count > 0;
  clearButton.hidden = count === 0;
  drawButton.disabled = count < 2;

  if (count === 0) {
    resetWinner();
  }
}

function resetWinner() {
  drawPanel.classList.remove("is-winner");
  winnerKicker.textContent = "El sorteo está listo";
  winnerTitle.textContent = "¿Quién ganará?";
  winnerName.hidden = true;
  winnerName.textContent = "";
}

participantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = normalizeName(participantName.value);

  if (!name) {
    formError.textContent = "Escribe el nombre de un participante.";
    participantName.focus();
    return;
  }

  const alreadyExists = participants.some(
    (participant) => participant.toLocaleLowerCase("es") === name.toLocaleLowerCase("es"),
  );

  if (alreadyExists) {
    formError.textContent = "Ese participante ya está en la lista.";
    participantName.select();
    return;
  }

  participants.push(name);
  participantName.value = "";
  formError.textContent = "";
  resetWinner();
  renderParticipants();
  participantName.focus();
});

participantList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-button");
  if (!removeButton) return;

  participants.splice(Number(removeButton.dataset.index), 1);
  resetWinner();
  renderParticipants();
});

clearButton.addEventListener("click", () => {
  participants = [];
  renderParticipants();
  participantName.focus();
});

drawButton.addEventListener("click", () => {
  const winner = selectWinner(participants);
  if (!winner) return;

  drawPanel.classList.add("is-winner");
  winnerKicker.textContent = "¡Tenemos un ganador!";
  winnerTitle.textContent = "";
  winnerName.textContent = winner;
  winnerName.hidden = false;
});

renderParticipants();
