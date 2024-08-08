import { config } from "dotenv";

config();

const runtimeConfig = {
  BASE_URL: process.env.BASE_URL || "error",
  ENV: process.env.ENV || "error",
  USER_EMAIL: process.env.TEST_USER_EMAIL || "error",
  USER_PASS: process.env.TEST_USER_PASS || "error",
  GMAIL_TESTER_CREDENTIALS: process.env.GMAIL_TESTER_CREDENTIALS || "error",
  GMAIL_TESTER_TOKEN: process.env.GMAIL_TESTER_TOKEN || "error",
};

export { runtimeConfig };
