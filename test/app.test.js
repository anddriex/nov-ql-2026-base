import test from "node:test";
import assert from "node:assert/strict";
import { createRaffle, normalizeName, selectWinner } from "../raffle.js";

test("normalizeName trims and collapses whitespace", () => {
  assert.equal(normalizeName("  María   López  "), "María López");
});

test("selectWinner returns null for an empty list", () => {
  assert.equal(selectWinner([]), null);
});

test("selectWinner selects an existing participant", () => {
  const participants = ["Ana", "Pedro", "María", "Luis", "Sofía"];
  const winner = selectWinner(participants, () => 0.5);

  assert.equal(participants.includes(winner), true);
});

test("selectWinner uses the first participant for a zero random value", () => {
  assert.equal(selectWinner(["Ana", "Pedro"], () => 0), "Ana");
});

test("raffle normalizes participants and rejects case-insensitive duplicates", () => {
  const raffle = createRaffle();

  assert.deepEqual(raffle.addParticipant("  María   López "), { ok: true, name: "María López" });
  assert.deepEqual(raffle.addParticipant("maría lópez"), { ok: false, reason: "duplicate" });
  assert.deepEqual(raffle.getParticipants(), ["María López"]);
});

test("raffle rejects blank names and invalid participant removals", () => {
  const raffle = createRaffle();

  assert.deepEqual(raffle.addParticipant("   "), { ok: false, reason: "empty" });
  assert.deepEqual(raffle.addParticipant(null), { ok: false, reason: "invalid" });
  assert.equal(raffle.removeParticipant(-1), false);
  assert.equal(raffle.removeParticipant(0), false);
  assert.deepEqual(raffle.getParticipants(), []);
});

test("raffle returns a copy of the participant list", () => {
  const raffle = createRaffle();
  raffle.addParticipant("Ana");

  const participants = raffle.getParticipants();
  participants.push("Intruso");

  assert.deepEqual(raffle.getParticipants(), ["Ana"]);
});

test("raffle clears the previous winner when its participants change", () => {
  const raffle = createRaffle(() => 0);
  raffle.addParticipant("Ana");
  raffle.addParticipant("Pedro");

  assert.equal(raffle.draw(), "Ana");
  assert.equal(raffle.getWinner(), "Ana");
  assert.equal(raffle.removeParticipant(0), true);
  assert.equal(raffle.getWinner(), null);
  assert.deepEqual(raffle.getParticipants(), ["Pedro"]);
});

test("raffle clear removes participants and winner", () => {
  const raffle = createRaffle();
  raffle.addParticipant("Ana");
  raffle.addParticipant("Pedro");
  raffle.draw();

  raffle.clear();

  assert.deepEqual(raffle.getParticipants(), []);
  assert.equal(raffle.getWinner(), null);
  assert.equal(raffle.draw(), null);
});
