import { world } from "@minecraft/server";
import { Game } from "../module";

class Waypoint {
  getData() {
    return new Game().getData("waypoints", []);
  }
  setData(obj) {
    new Game().setData("waypoints", obj);
  }

  // Main Method
  getPlayerWaypoints(player) {
    return getData.filter(e => {
      if(e.isGlobal) return e;
      if(e.ownerId == player.id) return e;
    })
  }
  addWaypoint(name, block, owner, isGlobal) {
    const data = this.getData();
    if(data.find(e => e.location == block.location)) return;

    data.push({
      name,
      block: {
        id: block.id,
        location: block.location
      },
      ownerId: owner.id,
      isGlobal
    })
    this.setData(data);
  }
  updateWaypoint(block, newObj) {
    let data = this.getData, findIndex = data.findIndex(e => e.location == block.location);

    if(findIndex == -1) return;
    data.splice(findIndex, 1, newObj);
    this.setData(data);
  }
  deleteWaypointByLocation(location) {
    const data = this.getData(), findIndex = data.findIndex(e => e.location == location);

    if(findIndex == -1) return;
    data.splice(findIndex, 1);
    this.setData(data);
  }
  deleteWaypointById(id) {
    const data = this.getData(), findIndex = data.findIndex(e => e.id == id);

    if(findIndex == -1) return;
    data.splice(findIndex, 1);
    this.setData(data);
  }
}

export { Waypoint };
