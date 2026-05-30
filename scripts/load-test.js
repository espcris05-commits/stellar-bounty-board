const autocannon = require("autocannon");
const instance = autocannon({ url: "http://localhost:3001/api/bounties", connections: 10, duration: 10 });
autocannon.track(instance);
process.on("exit", () => console.log("Load test complete"));
