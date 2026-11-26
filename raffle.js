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
