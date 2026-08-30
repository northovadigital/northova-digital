import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDatabase(): CloudflareEnv["cakeybakey_db"] {
  const { env } = getCloudflareContext();

  return env.cakeybakey_db;
}

export async function getDatabaseAsync(): Promise<
  CloudflareEnv["cakeybakey_db"]
> {
  const { env } = await getCloudflareContext({
    async: true,
  });

  return env.cakeybakey_db;
}
