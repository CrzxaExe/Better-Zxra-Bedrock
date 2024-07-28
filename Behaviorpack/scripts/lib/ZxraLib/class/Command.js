class Command {
  static cmd = [];

  static add(name, call, opt = {}) {
    this.cmd.push({ cmd: name, callback: call, type: "none" });
  }
  static addCmd(name, call, opt = {}) {
    let admin = opt.admin || false,
      description = opt.des || "";
    this.cmd.push({
      cmd: name,
      callback: call,
      admin,
      description,
      type: "cmd",
      err: opt.err || false
    });
  }

  static getAll() {
    return this.cmd;
  }
  static getN() {
    return this.cmd.filter(e => e.type !== "cmd");
  }
  static getCmd() {
    return this.cmd.filter(e => e.type == "cmd");
  }
}

export { Command };
