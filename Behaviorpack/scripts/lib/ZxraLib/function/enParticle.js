export const enParticle = (user, particle, pos) => {
  if (!user || !particle) return;
  let { x = 0, y = 0, z = 0 } = pos;

  user.runCommand(`particle ${particle} ~${pos.x}~${pos.y}~${pos.z}`);
};
