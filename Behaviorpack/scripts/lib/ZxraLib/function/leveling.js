const leveling = (xp, lvl, formula) => {
  let xpNeeded = formula(lvl);

  while (xp >= xpNeeded) {
    xp -= xpNeeded
    lvl += 1
    xpNeeded = formula(lvl)
  }
  return { xp: xp, lvl: lvl }
};

export { leveling };