---
name: codex
description: Run tasks, code reviews, and pair-programming in unison with OpenAI Codex CLI connected to AgentRouter API. Use when delegating code generation, second-opinion analysis, or automated code review to Codex.
---

# Codex CLI & Antigravity Collaboration Guide

This skill governs collaboration between Antigravity and the local **Codex CLI** (`@openai/codex`) configured via the **AgentRouter** gateway.

## Configuration & Environment

- **Config file**: `~/.codex/config.toml`
- **Gateway Provider**: `AgentRouter` (`https://agentrouter.org/v1`)
- **API Key Environment Variable**: `CODEX_GATEWAY_API_KEY` (configured in `.env`, `~/.config/fish/config.fish`, `~/.bashrc`, and `~/.zshrc`).

## Model Strategy

| Model | Identifier | Status | Usage Guidelines |
| :--- | :--- | :--- | :--- |
| **GPT-5.6 Sol** | `gpt-5.6-sol` | **Default** | Primary model for all general coding, reviews, refactoring, and pair-programming. Use this to avoid hitting tight rate limits. |
| **GPT-6.1 Sol** | `gpt-6.1-sol` | **Restricted / On-Demand** | Available for complex reasoning tasks or when explicitly requested. Has strict rate limits. |

## Collaboration Workflows

Antigravity and Codex can collaborate in several ways:

### 1. Delegated Execution via Subagent
Antigravity can invoke the `codex` subagent:
```json
{
  "TypeName": "codex",
  "Role": "Codex Pair Programmer",
  "Prompt": "Review the implementation in src/ and suggest optimizations."
}
```

### 2. Direct Command Execution
Antigravity can execute non-interactive Codex tasks via `run_command`:
```bash
# Default model (gpt-5.6-sol)
codex exec --skip-git-repo-check "Implement helper function for data normalization"

# Explicit model selection
codex exec -m "gpt-5.6-sol" --skip-git-repo-check "Task description"
codex exec -m "gpt-6.1-sol" --skip-git-repo-check "Complex reasoning task"

# Non-interactive code review
codex review
```

### 3. Helper Script (`scripts/codex_runner.py`)
To capture only the clean response or save it directly to a file:
```bash
python3 scripts/codex_runner.py "Write a python function to calculate Fibonacci numbers"
python3 scripts/codex_runner.py --model gpt-6.1-sol "Optimize this algorithm"
```

