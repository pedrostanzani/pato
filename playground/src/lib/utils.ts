import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Plugin } from "prettier";
import * as prettier from "prettier/standalone";
import * as parserTypeScript from "prettier/parser-typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";

import { tailwindColors } from "@/static/tailwind-colors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function formatTypeScriptCode(code: string) {
  return await prettier.format(code, {
    parser: "typescript",
    plugins: [parserTypeScript, prettierPluginEstree as Plugin<any>],
    singleQuote: false,
    semi: true,
  });
}

export function isTruthy<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function getTextColorBasedOnBackground(background: string) {
  // Remove the "#" symbol from the HEX string
  const hex = background.replace("#", "");

  // Extract the RGB values from the HEX string
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the background color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Determine the text color based on the background brightness
  return brightness > 128 ? "#000000" : "#FFFFFF";
}

/**
 * Checks if a given hex color is "close enough" to white.
 *
 * The color can be provided with or without the leading "#".
 * Supports both 3-digit and 6-digit hex formats.
 *
 * @param color - The hex color string (e.g., "#fcfcfc" or "fcfcfc")
 * @param threshold - The maximum difference allowed for each color channel (default: 10)
 * @returns True if the color is within the threshold of white, otherwise false
 */
export function isCloseToWhite(color: string, threshold: number = 10) {
  // Remove the leading '#' if present.
  if (color[0] === "#") {
    color = color.slice(1);
  }

  // If using a 3-digit hex format, convert it to 6-digit.
  if (color.length === 3) {
    color = color
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }

  // Ensure we have a valid 6-digit hex color.
  if (color.length !== 6) {
    return false;
  }

  // Parse the RGB components.
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Check if each component is close enough to 255 (white).
  return 255 - r <= threshold && 255 - g <= threshold && 255 - b <= threshold;
}

export function getTailwindColorHex({
  color,
  shade,
}: {
  color: string;
  shade: number;
}): string {
  return tailwindColors[color][shade];
}

export function extractInitials(name: string): string {
  // Split the name by whitespace, filter out any empty strings,
  // then map each word to its first character (uppercased)
  return name
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .join("");
}
