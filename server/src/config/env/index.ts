import dotenv from "dotenv";
import path from "path";

export function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.log("ENV load error:", result.error);
  }
}
