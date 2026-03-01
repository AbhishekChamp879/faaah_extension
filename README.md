# Faaaaaah on Error 🔊

## About

**Faaaaaah on Error** is a VS Code extension that plays a **"faaaaaah"** sound whenever an error is detected in your terminal output — so you know instantly when something goes wrong, without staring at the screen.

It works in two ways:
- Scans live terminal output for error keywords (e.g. `error:`, `FAILED`, `Exception`, `panic`)
- Also fires when any terminal command exits with a **non-zero exit code**, even if the output is silent

---

## Features

- 🔊 **Instant audio feedback** — hear errors the moment they happen
- 📺 **Real-time terminal monitoring** — streams live output via VS Code's shell integration API
- ❌ **Exit-code detection** — triggers on any non-zero exit code, even with no error text
- 🖥️ **Cross-platform** — Windows (PowerShell), macOS (`afplay`), Linux (`aplay`/`paplay`)
- 🔘 **Toggle on/off** — via status bar click or command palette
- 📊 **Status bar indicator** — always shows whether sound is enabled or muted
- 🎛️ **Configurable error patterns** — add your own regex patterns
- ⏱️ **Cooldown** — prevents sound spam, configurable delay between plays
- 🎨 **ANSI-safe** — strips terminal color codes before matching

---

## Installation

### ✅ Option 1 — Download from Open VSX Website (Recommended for users)

> 🔗 **Extension page:** [https://open-vsx.org/extension/AbhishekChamp879/faaaaaah-on-error](https://open-vsx.org/extension/AbhishekChamp879/faaaaaah-on-error)

**Steps:**

1. Visit the link above in your browser
2. Click the **Download** button on the right side of the page
3. A `.vsix` file will be saved to your computer
4. Open **VS Code**
5. Press `Ctrl+Shift+P` to open the Command Palette
6. Type and run: **Extensions: Install from VSIX...**
7. Browse to the downloaded `.vsix` file and select it
8. VS Code will install the extension — click **Reload Window** when prompted

✔️ Once installed, the **🔊 Faaaaaah** button will appear in the **bottom-left status bar**.  
✔️ Open a terminal, run a command that fails — and you'll hear it!

---

### 🛠️ Option 2 — For Development / Contributors

> Use this if you want to modify, debug, or contribute to the extension source code.

**Prerequisites:** Node.js installed, Git installed

```bash
git clone https://github.com/AbhishekChamp879/faaah_extension
cd faaah_extension
npm install
```

Then press **F5** in VS Code to launch the Extension Development Host and test changes live.

To build and package a new `.vsix`:

```bash
npm run compile
npx vsce package
```

---

## Requirements

- VS Code **1.93.0** or later
- **Shell integration enabled** — works with PowerShell, bash, zsh, fish (does **not** work with plain `cmd.exe`)
- **Windows:** PowerShell — built-in
- **macOS:** `afplay` — built-in
- **Linux:** `aplay` or `paplay` — install via `sudo apt install alsa-utils`

> **Windows tip:** Make sure PowerShell is your default terminal.  
> Go to `Settings` → search `terminal.integrated.defaultProfile.windows` → set to **PowerShell**.

---

## Usage

| Action | How |
|--------|-----|
| Toggle sound on/off | Click **🔊 Faaaaaah** in the status bar, or press `Ctrl+Shift+P` → `Faaaaaah: Toggle Error Sound` |
| Change error patterns | `Ctrl+,` → search `faaaaaah.errorPatterns` |
| Adjust cooldown | `Ctrl+,` → search `faaaaaah.cooldownMs` |

---

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

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No status bar button after install | Press `Ctrl+Shift+P` → **Developer: Reload Window** |
| Sound doesn't play on errors | Switch terminal to **PowerShell** — `cmd.exe` does not support shell integration |
| Sound plays too often | Increase `faaaaaah.cooldownMs` in Settings (default: 3000 ms) |
| Sound never plays | Check `faaaaaah.enabled` is `true` and status bar shows 🔊 not 🔇 |
| VS Code version too old | Requires VS Code ≥ 1.93.0 — go to `Help → Check for Updates` |
