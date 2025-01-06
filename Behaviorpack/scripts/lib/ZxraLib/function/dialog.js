import { world, system } from "@minecraft/server";

const runDialog = async (arr) => {
  await handleDialog(arr, 0)
}

const runPlayerDialog = async (player, arr) => {
  await handlePlayerDialog(player, arr, 0)
}

async function handleDialog(arr, i) {
  if(arr[i] === undefined || i >= arr.length) return
  
  if(arr[i].sound) world.getPlayers().forEach(player => {
    player.runCommand(`playsound ${arr[i].sound} @s`)
  })

  if(!arr[i].delay) arr[i].delay = 1

  const interval = system.runInterval(() => {
    world.getPlayers().forEach(player => {
      player.onScreenDisplay.setActionBar({ translate: arr[i].text })
    })
  }, 4)
  system.runTimeout(() => {
    system.clearRun(interval)
    system.runTimeout(() => {
      handleDialog(arr, i+1)
    }, arr[i].delay * 20)
  }, arr[i].time * 20)
}

async function handlePlayerDialog(player, arr, i) {
  if(arr[i] === undefined || i >= arr.length) return
  
  if(arr[i].sound) player.runCommand(`playsound ${arr[i].sound} @s`)

  if(!arr[i].delay) arr[i].delay = 1

  const interval = system.runInterval(() => {
    player.onScreenDisplay.setActionBar({ translate: arr[i].text })
  }, 4)
  system.runTimeout(() => {
    system.clearRun(interval)
    system.runTimeout(() => {
      handleDialog(arr, i+1)
    }, arr[i].delay * 20)
  }, arr[i].time * 20)
}

export { runDialog, runPlayerDialog }