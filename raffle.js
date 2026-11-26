export function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

export function selectWinner(names, random = Math.random) {
  if (!Array.isArray(names) || names.length === 0) {
    return null;
  }

  const index = Math.floor(random() * names.length);
  return names[Math.min(index, names.length - 1)];
}

export function createRaffle(random = Math.random) {
  let participants = [];
  let winner = null;

  return {
    getParticipants() {
      return [...participants];
    },

    addParticipant(value) {
      if (typeof value !== "string") {
        return { ok: false, reason: "invalid" };
      }

      const name = normalizeName(value);
      if (!name) {
        return { ok: false, reason: "empty" };
      }

      const exists = participants.some(
        (participant) => participant.toLocaleLowerCase("es") === name.toLocaleLowerCase("es"),
      );
      if (exists) {
        return { ok: false, reason: "duplicate" };
      }

      participants.push(name);
      winner = null;
      return { ok: true, name };
    },

    removeParticipant(index) {
      if (!Number.isInteger(index) || index < 0 || index >= participants.length) {
        return false;
      }

      participants.splice(index, 1);
      winner = null;
      return true;
    },

    clear() {
      participants = [];
      winner = null;
    },

    draw() {
      winner = selectWinner(participants, random);
      return winner;
    },

    getWinner() {
      return winner;
    },
  };
}
