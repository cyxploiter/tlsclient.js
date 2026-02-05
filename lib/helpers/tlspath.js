"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTLSDependencyPath = getTLSDependencyPath;
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
const arch = os_1.default.arch();
const platform = os_1.default.platform();
const version = "1.7.2";
let filename;
let extension;
let distribution;
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
        const releaseDetails = (0, fs_1.readFileSync)("/etc/os-release", "utf8");
        const lines = releaseDetails.split("\n");
        for (const line of lines) {
            if (!line || !line.includes("="))
                continue;
            const [key, value] = line.split("=", 2);
            if (!key || !value)
                continue;
            release[key.trim().toLowerCase()] =
                value.replace(/"/g, "").trim();
        }
    }
    catch (_b) {
        // ignore — fallback below
    }
    const id = (_a = release.id) !== null && _a !== void 0 ? _a : "";
    if (id.includes("ubuntu")) {
        distribution = "ubuntu-amd64";
    }
    else if (id.includes("alpine")) {
        distribution = "alpine-amd64";
    }
    else {
        distribution = arch === "arm64" ? "arm64" : "amd64";
    }
}
else {
    throw new Error(`Unsupported platform: ${platform}`);
}
const _filename = `${filename}-${distribution}-v${version}.${extension}`;
const url = `https://github.com/bogdanfinn/tls-client/releases/download/v${version}/${_filename}`;
const destination = `${os_1.default.tmpdir()}/${_filename}`;
function getTLSDependencyPath() {
    return {
        DOWNLOAD_PATH: url,
        TLS_LIB_PATH: destination,
    };
}
