import { config } from "dotenv";
import path from "node:path";
config({ path: path.join(process.cwd(), ".env") });

export default {
  database_url: process.env.DATABASE_URL,
  common: {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    client_app_url: process.env.CLIENT_APP_URL,
  },
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  },
};
