import * as vscode from 'vscode';
import * as path from 'path';
import { execFile } from 'child_process';
import * as fs from 'fs';

// ── ANSI escape code stripper ────────────────────────────────────────
const ANSI_RE = /\x1B(?:\[[0-9;]*[a-zA-Z]|\][^\x07]*\x07|\].*?(?:\x07|\x1B\\)|\(B)/g;

function stripAnsi(text: string): string {
    return text.replace(ANSI_RE, '');
}

// ── Error pattern matching ───────────────────────────────────────────
function buildErrorRegexes(): RegExp[] {
    const config = vscode.workspace.getConfiguration('faaaaaah');
    const patterns: string[] = config.get('errorPatterns', [
        '\\berror[:\\s]',
        '\\bFAILED\\b',
        '\\bfatal\\b',
        '\\bERR!\\b',
        '\\bException\\b',
        '\\bFATAL\\b',
        '\\bERROR\\b',
        '\\bpanic\\b',
    ]);
    return patterns.reduce<RegExp[]>((acc, p) => {
        try {
            acc.push(new RegExp(p, 'i'));
        } catch (e) {
            console.warn(`[faaaaaah] Invalid regex pattern skipped: ${p}`);
        }
        return acc;
    }, []);
}

let errorRegexes: RegExp[] = [];

function matchesError(line: string): boolean {
    return errorRegexes.some((re) => re.test(line));
}

// ── Cross-platform audio playback ────────────────────────────────────
function playSound(extensionPath: string): void {
    const soundFile = path.join(extensionPath, 'sounds', 'faaaaaah.wav');

    if (!fs.existsSync(soundFile)) {
        console.error('[faaaaaah] Sound file not found:', soundFile);
        return;
    }

    switch (process.platform) {
        case 'win32': {
            const escapedPath = soundFile.replace(/'/g, "''");
            execFile('powershell.exe', [
                '-NoProfile',
                '-WindowStyle', 'Hidden',
                '-Command',
                `(New-Object System.Media.SoundPlayer '${escapedPath}').PlaySync()`,
            ], (err) => {
                if (err) {
                    console.error('[faaaaaah] Windows playback failed:', err.message);
                }
            });
            break;
        }

        case 'darwin':
            execFile('afplay', [soundFile], (err) => {
                if (err) {
                    console.error('[faaaaaah] macOS playback failed:', err.message);
                }
            });
            break;

        case 'linux':
            execFile('aplay', [soundFile], (err) => {
                if (err) {
                    execFile('paplay', [soundFile], (err2) => {
                        if (err2) {
                            console.error('[faaaaaah] Linux playback failed:', err2.message);
                        }
                    });
                }
            });
            break;

        default:
            console.warn(`[faaaaaah] Unsupported platform: ${process.platform}`);
    }
}

// ── Cooldown logic ───────────────────────────────────────────────────
let lastPlayedAt = 0;

function getCooldown(): number {
    return vscode.workspace.getConfiguration('faaaaaah').get('cooldownMs', 3000);
}

function tryPlaySound(extensionPath: string): void {
    const now = Date.now();
    if (now - lastPlayedAt < getCooldown()) {
        return;
    }
    lastPlayedAt = now;
    playSound(extensionPath);
}

// ── Process streamed data for error patterns ─────────────────────────
function processChunkedData(
    rawData: string,
    onLine: (line: string) => void,
): void {
    const clean = stripAnsi(rawData);
    const lines = clean.split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 0) {
            onLine(trimmed);
        }
    }
}

// ── Status bar ───────────────────────────────────────────────────────
let statusBarItem: vscode.StatusBarItem;
let enabled = true;

function updateStatusBar(): void {
    if (enabled) {
        statusBarItem.text = '$(unmute) Faaaaaah';
        statusBarItem.tooltip = 'Faaaaaah error sound is ON — click to toggle';
        statusBarItem.color = undefined;
    } else {
        statusBarItem.text = '$(mute) Faaaaaah';
        statusBarItem.tooltip = 'Faaaaaah error sound is OFF — click to toggle';
        statusBarItem.color = new vscode.ThemeColor('disabledForeground');
    }
}

// ── Watch a shell execution's output for error patterns ──────────────
async function watchExecution(
    execution: vscode.TerminalShellExecution,
    extensionPath: string,
): Promise<void> {
    try {
        const stream = execution.read();
        for await (const data of stream) {
            if (!enabled) {
                continue;
            }
            processChunkedData(data, (line) => {
                if (matchesError(line)) {
                    tryPlaySound(extensionPath);
                }
            });
        }
    } catch {
        // Stream ended or terminal closed — ignore
    }
}

// ── Activation ───────────────────────────────────────────────────────
export function activate(context: vscode.ExtensionContext): void {
    const extensionPath = context.extensionPath;

    // Initialize from settings
    enabled = vscode.workspace.getConfiguration('faaaaaah').get('enabled', true);
    errorRegexes = buildErrorRegexes();

    // Verify sound file exists
    const soundFile = path.join(extensionPath, 'sounds', 'faaaaaah.wav');
    if (!fs.existsSync(soundFile)) {
        vscode.window.showWarningMessage(
            'Faaaaaah: No sound file found! Place a faaaaaah.wav in the sounds/ folder.',
        );
    }

    // Status bar
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        0,
    );
    statusBarItem.command = 'faaaaaah.toggle';
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Toggle command
    const toggleCmd = vscode.commands.registerCommand('faaaaaah.toggle', () => {
        enabled = !enabled;
        vscode.workspace
            .getConfiguration('faaaaaah')
            .update('enabled', enabled, vscode.ConfigurationTarget.Global);
        updateStatusBar();
        vscode.window.showInformationMessage(
            `Faaaaaah error sound ${enabled ? 'enabled 🔊' : 'disabled 🔇'}`,
        );
    });
    context.subscriptions.push(toggleCmd);

    // React to config changes
    const configChange = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('faaaaaah')) {
            enabled = vscode.workspace.getConfiguration('faaaaaah').get('enabled', true);
            errorRegexes = buildErrorRegexes();
            updateStatusBar();
        }
    });
    context.subscriptions.push(configChange);

    // ══════════════════════════════════════════════════════════════════
    // DETECTION METHOD 1: Real-time output scanning via shell
    // integration. When a command starts executing, we stream its
    // output and match each line against error patterns.
    // ══════════════════════════════════════════════════════════════════
    const startListener = vscode.window.onDidStartTerminalShellExecution(
        (event) => {
            if (!enabled) {
                return;
            }
            watchExecution(event.execution, extensionPath);
        },
    );
    context.subscriptions.push(startListener);

    // ══════════════════════════════════════════════════════════════════
    // DETECTION METHOD 2: Exit code detection. When any command
    // finishes with a non-zero exit code, play the sound. This
    // catches errors even when the output doesn't contain error text.
    // ══════════════════════════════════════════════════════════════════
    const endListener = vscode.window.onDidEndTerminalShellExecution(
        (event) => {
            if (!enabled) {
                return;
            }
            if (event.exitCode !== undefined && event.exitCode !== 0) {
                tryPlaySound(extensionPath);
            }
        },
    );
    context.subscriptions.push(endListener);

    console.log('[faaaaaah] Extension activated — listening for terminal errors via shell integration');
}

// ── Deactivation ─────────────────────────────────────────────────────
export function deactivate(): void {
    // VS Code disposes subscriptions automatically
}
