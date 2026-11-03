import { spawn } from "child_process";
import fs from "fs";
import path from "path";

console.log("==================================================");
console.log("       FASHNOVA UNIFIED PLATFORM RUNNER           ");
console.log("==================================================");

function run(command, args, cwd, name) {
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: "inherit",
    env: { ...process.env, FORCE_COLOR: "1" },
  });

  proc.on("error", (err) => {
    console.error(`[${name}] Failed to start:`, err.message);
  });

  proc.on("exit", (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  return proc;
}

const rootDir = process.cwd();

// Auto-detect virtualenv Python executable with installed ML dependencies
const venvPy = path.join(rootDir, "ml", ".venv", "Scripts", "python.exe");
const pythonCmd = fs.existsSync(venvPy) ? venvPy : "python";

console.log(`[FASHNOVA] Using Python executable: ${pythonCmd}`);

// 1. Start ML Microservices
const mlProc = run(pythonCmd, ["ml/run_all_services.py"], rootDir, "ML-SERVICES");

// 2. Start Backend
const backendProc = run("npm", ["run", "dev"], path.join(rootDir, "backend"), "BACKEND");

// 3. Start Frontend
const frontendProc = run("npm", ["run", "dev"], path.join(rootDir, "frontend"), "FRONTEND");

process.on("SIGINT", () => {
  console.log("\n[FASHNOVA] Shutting down all processes...");
  try { mlProc.kill(); } catch (e) {}
  try { backendProc.kill(); } catch (e) {}
  try { frontendProc.kill(); } catch (e) {}
  process.exit(0);
});
