#!/usr/bin/env bun
/**
 * Stdin Reader
 * Shared utility for reading stdin with timeout across all hooks
 */

/**
 * Read stdin with timeout, returning empty JSON object on timeout/error
 */
export async function readStdinWithTimeout(
  timeout: number = 3000,
): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    let resolved = false;

    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        process.stdin.removeListener("data", dataHandler);
        process.stdin.removeListener("end", endHandler);
        process.stdin.removeListener("error", errorHandler);
      }
    };

    const dataHandler = (chunk: Buffer) => {
      data += chunk.toString();
    };

    const endHandler = () => {
      cleanup();
      clearTimeout(timer);
      resolve(data);
    };

    const errorHandler = () => {
      cleanup();
      clearTimeout(timer);
      resolve("{}");
    };

    const timer = setTimeout(() => {
      cleanup();
      resolve("{}");
    }, timeout);

    process.stdin.on("data", dataHandler);
    process.stdin.on("end", endHandler);
    process.stdin.on("error", errorHandler);
  });
}
