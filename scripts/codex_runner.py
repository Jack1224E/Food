#!/usr/bin/env python3
"""
Codex Runner Utility
Enables running Codex CLI seamlessly with AgentRouter API.
Defaults to gpt-5.6-sol to avoid tight rate limits on gpt-6.1-sol.
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

# Auto-load API key from .env if not present in environment
def ensure_env():
    if "CODEX_GATEWAY_API_KEY" not in os.environ:
        env_path = Path(__file__).resolve().parent.parent / ".env"
        if env_path.exists():
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if line.startswith("CODEX_GATEWAY_API_KEY="):
                        os.environ["CODEX_GATEWAY_API_KEY"] = line.split("=", 1)[1].strip().strip('"').strip("'")
                    elif line.startswith("api_key:"):
                        os.environ["CODEX_GATEWAY_API_KEY"] = line.split(":", 1)[1].strip().strip('"').strip("'")
                    elif line.startswith("api_key="):
                        os.environ["CODEX_GATEWAY_API_KEY"] = line.split("=", 1)[1].strip().strip('"').strip("'")

def run_codex(prompt: str, model: str = "gpt-5.6-sol", output_file: str = None, sandbox: str = "read-only", workdir: str = None):
    ensure_env()
    cmd = [
        "codex", "exec",
        "-m", model,
        "--sandbox", sandbox,
        "--skip-git-repo-check",
    ]
    if output_file:
        cmd.extend(["-o", output_file])
    
    cmd.append(prompt)
    
    cwd = workdir or os.getcwd()
    result = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)
    return result

def main():
    parser = argparse.ArgumentParser(description="Run Codex CLI via AgentRouter API")
    parser.add_argument("prompt", help="Instructions/prompt for Codex")
    parser.add_argument(
        "--model", "-m",
        default="gpt-5.6-sol",
        choices=["gpt-5.6-sol", "gpt-6.1-sol"],
        help="Model to use (default: gpt-5.6-sol)"
    )
    parser.add_argument("--output", "-o", help="File to write the final response to")
    parser.add_argument(
        "--sandbox", "-s",
        default="read-only",
        choices=["read-only", "workspace-write", "danger-full-access"],
        help="Sandbox policy (default: read-only)"
    )
    parser.add_argument("--workdir", "-d", help="Working directory for Codex")

    args = parser.parse_args()
    res = run_codex(
        prompt=args.prompt,
        model=args.model,
        output_file=args.output,
        sandbox=args.sandbox,
        workdir=args.workdir
    )
    
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print(res.stderr, file=sys.stderr)
        
    sys.exit(res.returncode)

if __name__ == "__main__":
    main()

