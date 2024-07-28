const uniqueId = (length = 10) => {
  let chars = "1234567890", result = '';
  for(let i = 0;i < length;i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  };
  return result;
}

export { uniqueId };