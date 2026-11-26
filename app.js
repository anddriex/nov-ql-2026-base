import { createRaffle } from "./raffle.js";

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

const raffle = createRaffle();

function renderParticipants() {
  participantList.replaceChildren();
  const participants = raffle.getParticipants();

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
}

function renderWinner() {
  const winner = raffle.getWinner();
  const hasWinner = winner !== null;

  drawPanel.classList.toggle("is-winner", hasWinner);
  winnerKicker.textContent = hasWinner ? "¡Tenemos un ganador!" : "El sorteo está listo";
  winnerTitle.textContent = hasWinner ? "" : "¿Quién ganará?";
  winnerName.textContent = winner ?? "";
  winnerName.hidden = !hasWinner;
}

participantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = raffle.addParticipant(participantName.value);
  if (!result.ok) {
    formError.textContent =
      result.reason === "duplicate"
        ? "Ese participante ya está en la lista."
        : "Escribe el nombre de un participante.";
    if (result.reason === "duplicate") participantName.select();
    else participantName.focus();
    return;
  }

  participantName.value = "";
  formError.textContent = "";
  renderWinner();
  renderParticipants();
  participantName.focus();
});

participantList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-button");
  if (!removeButton) return;

  const removed = raffle.removeParticipant(Number(removeButton.dataset.index));
  if (!removed) return;

  renderWinner();
  renderParticipants();
});

clearButton.addEventListener("click", () => {
  raffle.clear();
  renderWinner();
  renderParticipants();
  participantName.focus();
});

drawButton.addEventListener("click", () => {
  const winner = raffle.draw();
  if (!winner) return;

  renderWinner();
});

renderWinner();
renderParticipants();
