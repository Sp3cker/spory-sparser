#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ExplanationMapping {
  script: string;
  explanation: string;
}

function runCommand(command: string): { stdout: string; stderr: string } {
  try {
    const result = execSync(command, { encoding: 'utf8' });
    return { stdout: result, stderr: '' };
  } catch (error: any) {
    return { stdout: '', stderr: error.stderr || error.message };
  }
}

function getOriginalExplanations(filePath: string): ExplanationMapping[] {
  const { stdout } = runCommand(`git show HEAD:"${filePath}"`);
  const lines = stdout.split('\n');

  const explanations: ExplanationMapping[] = [];
  let currentScript = '';

  for (const line of lines) {
    if (line.trim().endsWith('::')) {
      currentScript = line.trim();
    } else if (line.trim().startsWith('@explanation')) {
      if (currentScript) {
        explanations.push({
          script: currentScript,
          explanation: line.trim()
        });
      }
    }
  }

  return explanations;
}

function fixFile(filePath: string): void {
  console.log(`Processing: ${filePath}`);

  // Get the original @explanation mappings
  const originalExplanations = getOriginalExplanations(filePath);

  if (originalExplanations.length === 0) {
    console.log('  No @explanation lines found in original');
    return;
  }

  // Read the current file content
  const currentContent = readFileSync(filePath, 'utf8').split('\n');

  console.log(`  Found ${originalExplanations.length} @explanation lines in original to restore`);

  // Create new content with @explanation lines in correct positions
  const newContent: string[] = [];
  let explanationIndex = 0;

  for (const line of currentContent) {
    newContent.push(line);

    // Check if this line contains a script name that should have an @explanation
    const lineTrimmed = line.trim();
    if (explanationIndex < originalExplanations.length) {
      const exp = originalExplanations[explanationIndex];
      if (exp.script === lineTrimmed) {
        // Insert the corresponding @explanation line
        newContent.push(exp.explanation);
        explanationIndex++;
        console.log(`    Inserted @explanation after ${exp.script}`);
      }
    }
  }

  // If we still have explanations left to place, add them at the end
  while (explanationIndex < originalExplanations.length) {
    const exp = originalExplanations[explanationIndex];
    newContent.push('');
    newContent.push(exp.explanation);
    console.log(`    Added ${exp.explanation} at end of file`);
    explanationIndex++;
  }

  // Write the new content
  writeFileSync(filePath, newContent.join('\n'), 'utf8');

  // Stage the changes
  runCommand(`git add "${filePath}"`);

  console.log(`  Restored @explanation lines for ${filePath}`);
}

function main(): void {
  console.log('Fixing @explanation line positions...');

  // Get all .inc files with staged changes
  const { stdout } = runCommand('git diff --cached --name-only | grep "\\.inc$"');

  if (!stdout.trim()) {
    console.log('No .inc files with staged changes found');
    return;
  }

  const files = stdout.trim().split('\n');

  for (const filePath of files) {
    if (filePath.trim()) {
      try {
        fixFile(filePath.trim());
      } catch (error) {
        console.log(`  Error processing ${filePath}: ${error}`);
      }
    }
  }

  console.log('Done! Fixed @explanation positions for all files.');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
