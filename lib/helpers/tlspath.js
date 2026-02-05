"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTLSDependencyPath = getTLSDependencyPath;

const fs = require("fs");
const os = require("os");

const arch = os.arch();
const platform = os.platform();
const version = "1.7.2";

let filename, extension, distribution;

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

  let release = {};

  try {
    const content = fs.readFileSync("/etc/os-release", "utf8");
    const lines = content.split("\n");

    for (const line of lines) {
      if (!line || !line.includes("=")) continue;

      const parts = line.split("=", 2);
      if (!parts[0] || !parts[1]) continue;

      release[parts[0].trim().toLowerCase()] =
        parts[1].replace(/"/g, "").trim();
    }
  } catch (_) {}

  const id = release.id || "";

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

const filenameFull = `${filename}-${distribution}-v${version}.${extension}`;
const url = `https://github.com/bogdanfinn/tls-client/releases/download/v${version}/${filenameFull}`;
const destination = `${os.tmpdir()}/${filenameFull}`;

function getTLSDependencyPath() {
  return {
    DOWNLOAD_PATH: url,
    TLS_LIB_PATH: destination,
  };
}
