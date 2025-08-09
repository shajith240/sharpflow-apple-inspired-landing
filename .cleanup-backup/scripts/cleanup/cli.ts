#!/usr/bin/env node

import { ProjectAnalyzer } from './project-analyzer.js';
import { UnusedFileDetector } from './unused-file-detector.js';
import * as fs from 'fs';

/**
 * CLI interface for project analysis and cleanup
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'analyze';

  switch (command) {
    case 'analyze':
      await runAnalysis();
      break;
    case 'detect':
      await runDetection();
      break;
    case 'remove':
      await runRemoval(args.slice(1));
      break;
    case 'rollback':
      await runRollback();
      break;
    case 'help':
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

async function runAnalysis() {
  try {
    const analyzer = new ProjectAnalyzer();
    const result = await analyzer.analyzeProject();

    // Display results
    console.log('\n📊 PROJECT ANALYSIS RESULTS');
    console.log('=' .repeat(50));
    
    console.log(`\n📁 Files Overview:`);
    console.log(`   Total files: ${result.totalFiles}`);
    console.log(`   Total size: ${formatBytes(result.totalSize)}`);
    console.log(`   Used files: ${result.files.filter(f => f.isUsed).length}`);
    console.log(`   Unused files: ${result.unusedFiles.length}`);

    if (result.unusedFiles.length > 0) {
      console.log(`\n🗑️  Unused Files (${result.unusedFiles.length}):`);
      result.unusedFiles.forEach(file => {
        const fileReport = result.files.find(f => f.filePath === file);
        const size = fileReport ? formatBytes(fileReport.size) : 'unknown';
        console.log(`   - ${file} (${size})`);
      });
    }

    console.log(`\n📦 Dependencies Overview:`);
    console.log(`   Total dependencies: ${result.dependencies.length}`);
    console.log(`   Used dependencies: ${result.dependencies.filter(d => d.isUsed).length}`);
    console.log(`   Unused dependencies: ${result.unusedDependencies.length}`);

    if (result.unusedDependencies.length > 0) {
      console.log(`\n📦 Unused Dependencies (${result.unusedDependencies.length}):`);
      result.unusedDependencies.forEach(dep => {
        const depReport = result.dependencies.find(d => d.packageName === dep);
        const type = depReport?.isDev ? '(dev)' : '(prod)';
        console.log(`   - ${dep} ${type}`);
      });
    }

    // Save detailed report to file
    const reportPath = 'cleanup-analysis-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);

    // Show potential savings
    const unusedFilesSize = result.unusedFiles.reduce((sum, file) => {
      const fileReport = result.files.find(f => f.filePath === file);
      return sum + (fileReport?.size || 0);
    }, 0);

    if (unusedFilesSize > 0) {
      console.log(`\n💰 Potential space savings: ${formatBytes(unusedFilesSize)}`);
    }

    console.log('\n✅ Analysis complete!');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

async function runDetection() {
  try {
    const detector = new UnusedFileDetector();
    const result = await detector.detectUnusedFiles();

    console.log('\n📊 UNUSED FILE DETECTION RESULTS');
    console.log('=' .repeat(50));
    
    console.log(`\n📁 Files Overview:`);
    console.log(`   Total files: ${result.analysis.totalFiles}`);
    console.log(`   Total unused: ${result.unusedFiles.length}`);
    console.log(`   Safe to remove: ${result.safeToRemove.length}`);
    console.log(`   Requires review: ${result.requiresReview.length}`);

    if (result.safeToRemove.length > 0) {
      console.log(`\n✅ Safe to Remove (${result.safeToRemove.length}):`);
      result.safeToRemove.forEach(file => {
        const fileReport = result.analysis.files.find(f => f.filePath === file);
        const size = fileReport ? formatBytes(fileReport.size) : 'unknown';
        console.log(`   - ${file} (${size})`);
      });
    }

    if (result.requiresReview.length > 0) {
      console.log(`\n⚠️  Requires Review (${result.requiresReview.length}):`);
      result.requiresReview.forEach(item => {
        console.log(`   - ${item.file} (${formatBytes(item.size)}) - ${item.reason}`);
      });
    }

    console.log('\n💡 Next steps:');
    console.log('   - Run "npm run cleanup remove --dry-run" to see what would be removed');
    console.log('   - Run "npm run cleanup remove" to actually remove safe files');
    console.log('   - Add --include-review to also remove files that require review');

  } catch (error) {
    console.error('❌ Detection failed:', error);
    process.exit(1);
  }
}

async function runRemoval(args: string[]) {
  try {
    const detector = new UnusedFileDetector();
    
    // Parse arguments
    const dryRun = args.includes('--dry-run');
    const skipValidation = args.includes('--skip-validation');
    const includeReview = args.includes('--include-review');
    const autoConfirm = args.includes('--auto-confirm');

    const result = await detector.removeUnusedFiles({
      dryRun,
      skipValidation,
      includeReviewFiles: includeReview,
      autoConfirm
    });

    console.log('\n📊 REMOVAL RESULTS');
    console.log('=' .repeat(50));
    
    if (dryRun) {
      console.log('🔍 DRY RUN - No files were actually removed');
    }

    console.log(`\n📈 Summary:`);
    console.log(`   Success: ${result.success ? '✅ YES' : '❌ NO'}`);
    console.log(`   Files removed: ${result.summary.totalRemoved}`);
    console.log(`   Files skipped: ${result.summary.totalSkipped}`);
    console.log(`   Files failed: ${result.summary.totalFailed}`);
    console.log(`   Space saved: ${formatBytes(result.summary.spaceSaved)}`);

    if (result.details.failed.length > 0) {
      console.log(`\n❌ Failed Removals (${result.details.failed.length}):`);
      result.details.failed.forEach(item => {
        console.log(`   - ${item.file}: ${item.error}`);
      });
    }

    if (!dryRun && result.summary.totalRemoved > 0) {
      console.log('\n💡 Backup information:');
      const history = detector.getRemovalHistory();
      console.log(`   - Backup directory: ${history.backupDir}`);
      console.log(`   - Run "npm run cleanup rollback" to restore all files`);
      console.log(`   - Run "npm run cleanup cleanup-backups" to remove backups`);
    }

  } catch (error) {
    console.error('❌ Removal failed:', error);
    process.exit(1);
  }
}

async function runRollback() {
  try {
    const detector = new UnusedFileDetector();
    const result = await detector.rollbackRemoval();

    console.log('\n📊 ROLLBACK RESULTS');
    console.log('=' .repeat(50));
    
    console.log(`\n📈 Summary:`);
    console.log(`   Success: ${result.success ? '✅ YES' : '❌ NO'}`);
    console.log(`   Files restored: ${result.restored.length}`);
    console.log(`   Files failed: ${result.failed.length}`);

    if (result.failed.length > 0) {
      console.log(`\n❌ Failed Restorations (${result.failed.length}):`);
      result.failed.forEach(item => {
        console.log(`   - ${item.file}: ${item.error}`);
      });
    }

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🧹 Project Cleanup Tool

Usage:
  npm run cleanup <command> [options]

Commands:
  analyze                      Analyze project for unused files and dependencies
  detect                       Detect unused files with categorization
  remove [options]             Remove unused files safely
  rollback                     Restore all removed files from backup
  help                         Show this help message

Remove Options:
  --dry-run                    Show what would be removed without actually removing
  --skip-validation            Skip build validation (faster but less safe)
  --include-review             Include files that require manual review
  --auto-confirm               Don't prompt for confirmation

Examples:
  npm run cleanup analyze      # Basic analysis
  npm run cleanup detect       # Detect and categorize unused files
  npm run cleanup remove --dry-run    # Preview removal
  npm run cleanup remove       # Remove safe files only
  npm run cleanup remove --include-review --auto-confirm  # Remove all unused files
  npm run cleanup rollback     # Restore removed files

The tool will:
- Scan all project files and dependencies
- Analyze import/export relationships  
- Safely remove unused files with backup
- Validate project integrity before and after removal
- Provide rollback capability

All removed files are backed up and can be restored.
`);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the CLI
main().catch(console.error);