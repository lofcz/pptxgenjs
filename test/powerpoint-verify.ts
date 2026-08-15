/**
 * Node wrapper around the hidden-desktop PowerPoint sidecar.
 * Builds tools/powerpoint-verify on demand, then returns ok | repair | reject.
 */
import { execFile as execFileCallback } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFile = promisify(execFileCallback)
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const sidecarDir = join(repoRoot, 'tools', 'powerpoint-verify')
const sidecarExe = join(sidecarDir, 'target', 'release', 'powerpoint-verify.exe')

export type PowerPointVerdict = 'ok' | 'repair' | 'reject' | 'timeout' | 'error'

export interface PowerPointPackageDiff {
	added: string[]
	removed: string[]
	changed: Array<{ part: string; hint: string }>
}

export interface PowerPointVerifyResult {
	file: string
	verdict: PowerPointVerdict
	opened: boolean
	name?: string | null
	fullName?: string | null
	saved?: number | null
	error?: string | null
	dialogText?: string | null
	repairSummary?: string | null
	followups?: string[]
	packageDiff?: PowerPointPackageDiff | null
	clicked?: string | null
	signals: string[]
	ms: number
}

function cargoPath (): string {
	const fromEnv = process.env.CARGO
	if (fromEnv && existsSync(fromEnv)) return fromEnv
	const home = join(homedir(), '.cargo', 'bin', process.platform === 'win32' ? 'cargo.exe' : 'cargo')
	if (existsSync(home)) return home
	return 'cargo'
}

export async function ensurePowerPointSidecar (): Promise<string> {
	if (existsSync(sidecarExe)) return sidecarExe
	await execFile(cargoPath(), ['build', '--release', '--manifest-path', join(sidecarDir, 'Cargo.toml')], {
		timeout: 180_000,
		windowsHide: true,
	})
	if (!existsSync(sidecarExe)) throw new Error('powerpoint-verify sidecar failed to build')
	return sidecarExe
}

export function isPowerPointSidecarAvailable (): boolean {
	return process.platform === 'win32' && existsSync('C:\\Program Files\\Microsoft Office\\root\\Office16\\POWERPNT.EXE')
}

let powerpointLock: Promise<unknown> = Promise.resolve()

export async function verifyPptxWithPowerPoint (
	files: string | string[],
	options: { timeoutMs?: number } = {},
): Promise<PowerPointVerifyResult[]> {
	const run = powerpointLock.then(() => verifyPptxWithPowerPointLocked(files, options), () => verifyPptxWithPowerPointLocked(files, options))
	powerpointLock = run
	return run
}

async function verifyPptxWithPowerPointLocked (
	files: string | string[],
	options: { timeoutMs?: number },
): Promise<PowerPointVerifyResult[]> {
	const exe = await ensurePowerPointSidecar()
	const paths = (Array.isArray(files) ? files : [files]).map(file => file)
	const args = ['--timeout-ms', String(options.timeoutMs ?? 25_000), ...paths]
	const timeout = (options.timeoutMs ?? 25_000) * paths.length + 20_000
	try {
		return await runSidecar(exe, args, timeout)
	} catch (err) {
		await killStrayPowerPoint()
		throw err
	}
}

async function runSidecar (exe: string, args: string[], timeout: number): Promise<PowerPointVerifyResult[]> {
	const { stdout } = await execFile(exe, args, { timeout, windowsHide: true })
	const parsed = JSON.parse(stdout.trim()) as PowerPointVerifyResult[]
	if (!Array.isArray(parsed)) throw new Error(`unexpected sidecar output: ${stdout}`)
	return parsed
}

async function killStrayPowerPoint (): Promise<void> {
	if (process.platform !== 'win32') return
	try {
		await execFile('taskkill', ['/IM', 'POWERPNT.EXE', '/F'], { windowsHide: true })
	} catch {
		return
	}
	await new Promise(resolve => setTimeout(resolve, 4000))
}

async function main (): Promise<void> {
	const files = process.argv.slice(2).filter(arg => !arg.startsWith('--'))
	if (files.length === 0) {
		console.error('usage: bun test/powerpoint-verify.ts <file.pptx>...')
		process.exit(2)
	}
	const results = await verifyPptxWithPowerPoint(files)
	console.log(JSON.stringify(results, null, 2))
	if (results.some(result => result.verdict !== 'ok')) process.exit(1)
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (invokedDirectly) void main()
