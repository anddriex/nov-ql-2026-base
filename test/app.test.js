import test from "node:test";
import assert from "node:assert/strict";
import { normalizeName, selectWinner } from "../raffle.js";

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
