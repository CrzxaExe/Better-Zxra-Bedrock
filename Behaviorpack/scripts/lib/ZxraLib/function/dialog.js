import { world, system } from "@minecraft/server";

const runDialog = async (arr) => {
  await handleDialog(arr, 0)
}

async function handleDialog(arr, i) {
  if(arr[i] === undefined || i >= arr.length) return

  const interval = system.runInterval(() => {
    world.getPlayers().forEach(player => {
      player.onScreenDisplay.setActionBar({ translate: arr[i].text })
    })
  }, 5)
  system.runTimeout(() => {
    system.runTimeout(() => {
      system.clearRun(interval)
      handleDialog(arr, i+1)
    }, 40)
  }, (arr[i].time - 1) * 20)
}

export { runDialog }