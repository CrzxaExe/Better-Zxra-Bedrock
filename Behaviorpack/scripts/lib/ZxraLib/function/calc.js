const getMaxHealthPercentage = (target, percentage = 1) => {
  if(!target) return;
  return target.getComponent("health").defaultValue * Math.abs(percentage);
}

const vector2Distance = (firstLocation, secondLocation) => {
  if(!firstLocation || !secondLocation) return;
  return Math.sqrt((secondLocation.x - firstLocation.x) ** 2 + (secondLocation.z - firstLocation.z) ** 2);
}

export { getMaxHealthPercentage, vector2Distance };