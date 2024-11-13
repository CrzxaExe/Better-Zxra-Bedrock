import { world, system } from "@minecraft/server";

const runDialog = (arr) => {
  const players = world.getPlayers()
  let i = 0

    const inv = system.runInterval(() => {
      console.warn(arr[i])
    }, 10)
    system.setTimeout(() => system.clearRun(inv), (arr[i]).length*8+12)
}

function handleDialog(text, i)

export { runDialog }