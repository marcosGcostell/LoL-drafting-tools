import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

// Log append to the existing file if --noreset
const noReset = args.includes('--noreset');
const logMode = noReset ? 'a' : 'w';

const logFile = path.resolve('./worker.log');
const logStream = fs.createWriteStream(logFile, { flags: logMode });

// Launch scheduler
const child = spawn('node', ['./models/utils/scheduler.js', ...args]);

child.stdout.pipe(logStream);
child.stderr.pipe(logStream);
