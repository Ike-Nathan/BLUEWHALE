import { detect } from "./detect";

export function validate(
  address: string,
  options?: { strict?: boolean },
): boolean {
  const kind = detect(address);
  if (kind === "invalid") return false;
  if (options?.strict && address !== address.toUpperCase()) return false;
  return true;
}
