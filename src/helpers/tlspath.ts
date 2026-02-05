import { readFileSync } from "fs";
import os from "os";

const arch = os.arch();
const platform = os.platform();

const version = "1.7.2";

let filename!: string;
let extension!: string;
let distribution!: string;

if (platform === "win32") {
  filename = "tls-client-windows";
  extension = "dll";
  distribution = arch.includes("64") ? "64" : "32";
}

else if (platform === "darwin") {
  filename = "tls-client-darwin";
  extension = "dylib";
  distribution = arch === "arm64" ? "arm64" : "amd64";
}

else if (platform === "linux") {
  filename = "tls-client-linux";
  extension = "so";

  let release: Record<string, string> = {};

  try {
    const releaseDetails = readFileSync("/etc/os-release", "utf8");
    const lines = releaseDetails.split("\n");

    for (const line of lines) {
      if (!line || !line.includes("=")) continue;

      const [key, value] = line.split("=", 2);
      if (!key || !value) continue;

      release[key.trim().toLowerCase()] =
        value.replace(/"/g, "").trim();
    }
  } catch {
    // ignore — fallback below
  }

  const id = release.id ?? "";

  if (id.includes("ubuntu")) {
    distribution = "ubuntu-amd64";
  } else if (id.includes("alpine")) {
    distribution = "alpine-amd64";
  } else {
    distribution = arch === "arm64" ? "arm64" : "amd64";
  }
}

else {
  throw new Error(`Unsupported platform: ${platform}`);
}

const _filename = `${filename}-${distribution}-v${version}.${extension}`;

const url =
  `https://github.com/bogdanfinn/tls-client/releases/download/v${version}/${_filename}`;

const destination = `${os.tmpdir()}/${_filename}`;

export function getTLSDependencyPath() {
  return {
    DOWNLOAD_PATH: url,
    TLS_LIB_PATH: destination,
  };
}
