import { logger } from "@/lib/logger";

type ReportContext = Record<string, unknown>;

/**
 * Single reporting seam. A project replaces this body to send errors to Sentry
 * or another service. Call sites stay the same.
 */
export function reportError(error: unknown, context?: ReportContext) {
  const message = error instanceof Error ? error.message : "Unknown error";

  logger.error(message, {
    name: error instanceof Error ? error.name : undefined,
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
}
