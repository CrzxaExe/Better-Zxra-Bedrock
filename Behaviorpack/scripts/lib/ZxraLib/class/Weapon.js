class Weapon {
  // Weapon Skill
  static Skill = [];
  // Pasif
  static Pasif = {
    hit: [], // Do when actor hit
    hited: [], // Do when actor was been hited
    run: [],
    kill: [] // Do when actor kill entity
  };

  // Method Skill
  static registerSkill(weaponName, callback) {
    this.Skill.push({ weaponName, callback })
  }

  // Method Pasif
  static addHitPasif(type, callback) {
		this.Pasif.hit.push({ type, callback })
    }
    static addHitedPasif(type, callback) {
		this.Pasif.hited.push({ type, callback })
    }
    static addRunPasif(type, callback) {
		this.Pasif.hit.push({ type, callback })
    }
    static addKillPasif(type, callback) {
		this.Pasif.kill.push({ type, callback })
    }
}

export { Weapon };