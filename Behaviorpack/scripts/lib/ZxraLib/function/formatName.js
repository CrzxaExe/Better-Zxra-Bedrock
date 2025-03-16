const formatName = (names) => {
  if(!names) return "";
  
  if(Array.isArray(names)) {
    return names.map(e => 
      e.split("_").map(r =>
        r.charAt(0).toUpperCase() + r.slice(1)
      ).join(" ")
    ).join(", ");
  }

  if(typeof names !== "string") return "";
  return names.split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
}

export { formatName }