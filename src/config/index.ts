import { config } from "dotenv";
import path from "node:path";
config({ path: path.join(process.cwd(), ".env") });

export default {
  database_url: process.env.DATABASE_URL,
  common: {
    port: process.env.PORT,
    client_app_url: process.env.CLIENT_APP_URL,
  },
};
