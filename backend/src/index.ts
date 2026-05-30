import "dotenv/config";
import { app } from "./app";
import { logStructured } from "./logger";

const port = Number(process.env.PORT ?? 3001);

// Validate required environment variables on startup
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
if (!GITHUB_WEBHOOK_SECRET) {
  logStructured("warn", "missing_required_env", {
    variable: "GITHUB_WEBHOOK_SECRET",
    hint: "GitHub webhook signature verification will be disabled. Set this in production.",
  });
}

app.listen(port, () => {
  logStructured("info", "server_listen", { port });
});
