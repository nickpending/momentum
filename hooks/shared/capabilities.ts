/**
 * Capability detection for CLI tools
 * Checks both command availability and config where required
 */

import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { debugLog } from "./debug-log.ts";

interface Capability {
  command: string;
  configPath?: string; // Required config file (relative to home or absolute)
  description?: string; // For debug output
}

const CAPABILITIES: Record<string, Capability> = {
  lore: {
    command: "lore",
    configPath: ".config/lore/config",
    description: "Personal knowledge capture",
  },
  "prismis-cli": {
    command: "prismis-cli",
    configPath: ".config/prismis/config.toml",
    description: "Content database queries",
  },
  setupd: {
    command: "setupd",
    description: "Project setup",
  },
  "gitignore-check": {
    command: "gitignore-check",
    description: "Gitignore compliance",
  },
  "llm-notify": {
    command: "llm-notify",
    description: "External notifications",
  },
};

function commandExists(command: string): boolean {
  try {
    const result = Bun.spawnSync(["which", command]);
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

function configExists(configPath: string): boolean {
  const fullPath = configPath.startsWith("/")
    ? configPath
    : join(homedir(), configPath);
  return existsSync(fullPath);
}

export interface CapabilityResult {
  name: string;
  ready: boolean;
  commandFound: boolean;
  configFound: boolean | null; // null if no config required
}

export function checkCapabilities(): CapabilityResult[] {
  const results: CapabilityResult[] = [];

  debugLog(
    "Capabilities",
    `Checking ${Object.keys(CAPABILITIES).length} tools`,
  );

  for (const [name, cap] of Object.entries(CAPABILITIES)) {
    const commandFound = commandExists(cap.command);
    const configRequired = !!cap.configPath;
    const configFound = configRequired ? configExists(cap.configPath!) : null;

    const ready =
      commandFound && (configFound === null || configFound === true);

    results.push({
      name,
      ready,
      commandFound,
      configFound,
    });

    const cmdStatus = commandFound ? "✓" : "✗";
    const cfgStatus = configFound === null ? "n/a" : configFound ? "✓" : "✗";
    const readyStatus = ready ? "ready" : "not ready";

    debugLog(
      "Capabilities",
      `  ${name}: command=${cmdStatus} config=${cfgStatus} → ${readyStatus}`,
    );
  }

  const readyCount = results.filter((r) => r.ready).length;
  const readyNames = results
    .filter((r) => r.ready)
    .map((r) => r.name)
    .join(", ");

  debugLog("Capabilities", `${readyCount} ready [${readyNames}]`);

  return results;
}

export function getReadyCapabilities(): string[] {
  return checkCapabilities()
    .filter((r) => r.ready)
    .map((r) => r.name);
}

export function getCapabilitiesString(): string {
  const ready = getReadyCapabilities();
  return ready.length > 0 ? ready.join(", ") : "none";
}

export function hasCapability(name: string): boolean {
  const results = checkCapabilities();
  const cap = results.find((r) => r.name === name);
  return cap?.ready ?? false;
}
