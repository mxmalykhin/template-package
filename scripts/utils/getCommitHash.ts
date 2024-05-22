import { execSync } from 'node:child_process';

export function getCommitHash(): string {
  try {
    return `${execSync('git rev-parse --abbrev-ref HEAD').toString().trim()}-${execSync('git rev-parse --short HEAD')
      .toString()
      .trim()}`;
  } catch (error) {
    console.error('Error getting git version:', error);
    return 'unknown';
  }
}
