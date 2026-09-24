import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  client: {},
  emptyStringAsUndefined: true,
  runtimeEnv: {
    // eslint-disable-next-line n/no-process-env -- validated here, nowhere else
    NODE_ENV: process.env.NODE_ENV,
  },
});
