# Faaaaaah on Error 🔊

A VS Code extension that plays a **"faaaaaah"** sound whenever an error is detected in your terminal output.

## Features

- **Real-time terminal monitoring** — listens to all terminal output using the stable `onDidWriteTerminalData` API
- **Cross-platform** — Windows (PowerShell), macOS (`afplay`), Linux (`aplay`/`paplay`)
- **Toggle on/off** — via command palette or status bar click
- **Status bar indicator** — shows whether the sound is enabled or disabled
- **Configurable error patterns** — customize which patterns trigger the sound
- **Cooldown** — prevents sound spam with a configurable cooldown period
- **ANSI-safe** — strips escape codes before matching, so colored output won't cause false matches
- **Line-buffered** — reassembles chunked terminal data into complete lines before matching

## Setup

1. Run `npm install` to install dev dependencies
2. **Place your `faaaaaah.wav` file** in the `sounds/` directory  
   (The file must be named `faaaaaah.wav`)
3. Press **F5** to launch the Extension Development Host
4. Open a terminal in the dev host and trigger an error — you'll hear it!

## Usage

| Action | How |
|--------|-----|
| Toggle sound | Click the **$(unmute) Faaaaaah** button in the status bar, or run `Faaaaaah: Toggle Error Sound` from the command palette |
| Change error patterns | Open Settings → search for `faaaaaah.errorPatterns` |
| Adjust cooldown | Open Settings → search for `faaaaaah.cooldownMs` |

## Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `faaaaaah.enabled` | `boolean` | `true` | Enable/disable the error sound |
| `faaaaaah.cooldownMs` | `number` | `3000` | Min milliseconds between consecutive sound plays |
| `faaaaaah.errorPatterns` | `string[]` | `["\\berror[:\\s]", "\\bFAILED\\b", ...]` | Regex patterns (case-insensitive) matched against terminal lines |

### Default Error Patterns

```
\berror[:\s]    — matches "error:" or "error " (but not "error-handler")
\bFAILED\b      — matches "FAILED" as a whole word
\bfatal\b       — matches "fatal" as a whole word
\bERR!\b        — matches npm's "ERR!" prefix
\bException\b   — matches Java/Python/C# exceptions
\bFATAL\b       — matches "FATAL" as a whole word
\bERROR\b       — matches "ERROR" as a whole word
\bpanic\b       — matches Go/Rust panics
```

## Packaging

```bash
npm run compile
npx vsce package
```

This produces a `.vsix` file you can install via `Extensions: Install from VSIX...`.

## Requirements

- VS Code **1.93.0** or later
- A `.wav` audio file placed at `sounds/faaaaaah.wav`
- **Windows:** PowerShell (built-in)
- **macOS:** `afplay` (built-in)
- **Linux:** `aplay` or `paplay`
