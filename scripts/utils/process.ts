import { exec, spawn } from 'node:child_process';
import chalk from 'chalk';

export const spawnProcess = (
  name: string,
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv,
  passedConditions: string[] = [],
) => {
  const conditions = ['rollup v', ...passedConditions];

  return new Promise<void>((resolve, reject) => {
    const proc = spawn(command, args, { env: { ...process.env, ...env }, stdio: 'pipe' });

    proc.stdout?.on('data', (data) => {
      const message = data.toString();
      if (!conditions.some((cond) => message.includes(cond))) {
        process.stdout.write(`${chalk.blue(`[${name}]`)} ${message}`);
      }
    });

    proc.stderr?.on('data', (data) => {
      const message = data.toString();
      if (!conditions.some((cond) => message.includes(cond))) {
        process.stderr.write(`${chalk.blue(`[${name}]`)} ${message}`);
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        //        console.log(`${chalk.blue(`[${name}]`)} ${chalk.green.bold('Done')}`);
        resolve();
      } else {
        console.error(`${chalk.red(`[${name}]`)} process exited with code ${code}`);
        reject(new Error(`[${name}] process failed`));
      }
    });
  });
};

export const execProcess = (
  name: string,
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv,
  onData: (data: string) => void,
) => {
  return new Promise<void>((resolve, reject) => {
    const proc = exec(`${command} ${args.join(' ')}`, { env: { ...process.env, ...env } });

    proc.stdout?.on('data', (data) => {
      const message = data.toString();
      onData(message);
    });

    proc.stderr?.on('data', (data) => {
      const message = data.toString();
      console.error(chalk.red(`[${name}] Error`), message);
      reject(new Error(message));
    });

    proc.on('close', (code) => {
      if (code === 0) {
        //        console.log(`${chalk.blue(`[${name}]`)} ${chalk.green.bold('Done')}`);
        resolve();
      } else {
        console.error(`${chalk.red(`[${name}]`)} process exited with code ${code}`);
        reject(new Error(`[${name}] process failed`));
      }
    });
  });
};
