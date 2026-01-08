#!/usr/bin/env bun
/**
 * Notifications
 * Reads notification queue for injection into Claude context
 * Wraps @voidwire/llm-notify library functions
 */

import { list, ack, type Notification, type Tier } from "@voidwire/llm-notify";
import { debugLog } from "./debug-log.ts";

export type { Notification, Tier };

/**
 * Get unacked notifications filtered by tier
 * Returns empty array on any error (never throws)
 *
 * @param tiers - Tiers to include (default: urgent, indicator)
 * @returns Array of notifications matching the specified tiers
 */
export function getUnackedNotifications(
  tiers: Tier[] = ["urgent", "indicator"],
): Notification[] {
  try {
    const all = list(true); // unacked only
    const filtered = all.filter((n) => tiers.includes(n.tier));
    debugLog("Notifications", "Queue read", {
      total: all.length,
      filtered: filtered.length,
      tiers,
    });
    return filtered;
  } catch (error) {
    debugLog("Notifications", "Failed to read queue", { error: String(error) });
    return [];
  }
}

/**
 * Acknowledge a notification by ID
 * Silent on failure (never throws)
 *
 * @param id - Notification ID to acknowledge
 * @returns true if successful, false otherwise
 */
export function ackNotification(id: string): boolean {
  try {
    const result = ack(id);
    if (result.success) {
      debugLog("Notifications", "Acked notification", { id });
    } else {
      debugLog("Notifications", "Failed to ack", { id, error: result.error });
    }
    return result.success;
  } catch (error) {
    debugLog("Notifications", "Ack error", { id, error: String(error) });
    return false;
  }
}

/**
 * Format notifications for context injection
 * Returns empty string if no notifications
 *
 * @param notifications - Array of notifications to format
 * @returns Formatted string for injection, or empty string
 */
export function formatNotificationsForContext(
  notifications: Notification[],
): string {
  if (notifications.length === 0) {
    return "";
  }

  const lines: string[] = [];
  lines.push("<notifications>");

  for (const n of notifications) {
    lines.push(
      `  <notification tier="${n.tier}" source="${n.source}">${n.message}</notification>`,
    );
  }

  lines.push("</notifications>");
  return lines.join("\n");
}
