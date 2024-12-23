function gettime() {
  const now = new Date();
  let time = new Date(now.getTime());
  const options = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  time = time.toLocaleTimeString("en-US", options);
  return time;
}

module.exports = gettime;
