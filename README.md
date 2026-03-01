# Faaaaaah on Error 🔊

A VS Code extension that plays a **"faaaaaah"** sound whenever an error is detected in your terminal output.

## Features

- **Real-time terminal monitoring** 
- **Exit-code detection** — also triggers on any command that exits with a non-zero code, even if the output contains no error text
- **Cross-platform** — Windows (PowerShell), macOS (`afplay`), Linux (`aplay`/`paplay`)
- **Toggle on/off** — via command palette or status bar click
- **Status bar indicator** — shows whether the sound is enabled or disabled
- **Configurable error patterns** — customize which patterns trigger the sound
- **Cooldown** — prevents sound spam with a configurable cooldown period
- **ANSI-safe** — strips escape codes before matching, so colored output won't cause false matches
- **Line-buffered** — reassembles chunked terminal data into complete lines before matching

## Installation

### Option 1 — Open VSX Registry (recommended)

> 🔗 **Extension page:** [https://open-vsx.org/extension/AbhishekChamp879/faaaaaah-on-error](https://open-vsx.org/extension/AbhishekChamp879/faaaaaah-on-error)

**Install directly inside VS Code (VSCodium / any OpenVSX-connected editor):**

1. Press `Ctrl+Shift+X` to open the Extensions panel
2. Search for **Faaaaaah on Error** or **AbhishekChamp879.faaaaaah-on-error**
3. Click **Install**
4. Click **Reload Window** when prompted

**Or install via terminal:**

```bash
code --install-extension AbhishekChamp879.faaaaaah-on-error
```

---

### Option 2 — Download & Install VSIX manually

1. Go to [https://open-vsx.org/extension/AbhishekChamp879/faaaaaah-on-error](https://open-vsx.org/extension/AbhishekChamp879/faaaaaah-on-error)
2. Click the **Download** button on the right side of the page
3. Save the `.vsix` file to your computer
4. Open VS Code
5. Press `Ctrl+Shift+P` and run **Extensions: Install from VSIX...**
6. Browse to and select the downloaded `.vsix` file
7. Click **Reload Window** when prompted

---

After installation, the **🔊 Faaaaaah** button will appear in the bottom-left status bar.

## Requirements

- VS Code **1.93.0** or later
- **Shell integration must be enabled** (it is on by default for PowerShell, bash, zsh, and fish — does **not** work with plain `cmd.exe`)
- **Windows:** PowerShell — built-in, no extra install needed
- **macOS:** `afplay` — built-in
- **Linux:** `aplay` or `paplay` — install via `sudo apt install alsa-utils` or `pulseaudio-utils`

> **Note for Windows users:** Make sure you are using **PowerShell** (not Command Prompt) as your default terminal in VS Code. Go to `Settings` → search `terminal.integrated.defaultProfile.windows` → set it to **PowerShell**.

## Usage

| Action | How |
|--------|-----|
| Toggle sound on/off | Click the **🔊 Faaaaaah** button in the status bar, or run `Faaaaaah: Toggle Error Sound` from the command palette (`Ctrl+Shift+P`) |
| Change error patterns | Open Settings (`Ctrl+,`) → search for `faaaaaah.errorPatterns` |
| Adjust cooldown | Open Settings → search for `faaaaaah.cooldownMs` |

## Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `faaaaaah.enabled` | `boolean` | `true` | Enable/disable the error sound |
| `faaaaaah.cooldownMs` | `number` | `3000` | Min milliseconds between consecutive sound plays |
| `faaaaaah.errorPatterns` | `string[]` | see below | Regex patterns (case-insensitive) matched against terminal lines |

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

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No status bar button after install | Press `Ctrl+Shift+P` → **Developer: Reload Window** |
| Sound doesn't play on errors | Make sure you're using **PowerShell** (not cmd.exe) — shell integration is required |
| Sound plays too often | Increase `faaaaaah.cooldownMs` in Settings (default: 3000 ms) |
| Sound never plays | Check `faaaaaah.enabled` is `true` in Settings, and confirm the status bar shows 🔊 (not 🔇) |
| VS Code version too old | Requires VS Code ≥ 1.93.0 — go to `Help → Check for Updates` |

## Development

```bash
git clone https://github.com/AbhishekChamp879/faaah_extension
cd faaah_extension
npm install
```

Press **F5** to launch the Extension Development Host and test live.

To package a new `.vsix`:

```bash
npm run compile
npx vsce package
```
