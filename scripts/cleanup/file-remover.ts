import * as fs from 'fs';
import * as path from 'path';
import { FileUsageReport } from './types.js';

/**
 * Safe file removal system with backup and rollback capabilities
 */
export class FileRemover {
  private backupDir: string;
  private removedFiles: string[] = [];

  constructor(backupDir: string = '.cleanup-backup') {
    this.backupDir = backupDir;
  }

  /**
   * Creates backup directory if it doesn't exist
   */
  private ensureBackupDir(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Creates a backup of a file before removal
   */
  private backupFile(filePath: string): string {
    this.ensureBackupDir();
    
    const backupPath = path.join(this.backupDir, filePath);
    const backupDirPath = path.dirname(backupPath);
    
    // Create backup directory structure
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }
    
    // Copy file to backup location
    fs.copyFileSync(filePath, backupPath);
    
    return backupPath;
  }

  /**
   * Safely removes a single file with backup
   */
  async removeFile(filePath: string): Promise<{ success: boolean; backupPath?: string; error?: string }> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return { success: false, error: `File does not exist: ${filePath}` };
      }

      // Create backup
      const backupPath = this.backupFile(filePath);
      
      // Remove the original file
      fs.unlinkSync(filePath);
      
      // Track removed file
      this.removedFiles.push(filePath);
      
      console.log(`✅ Removed: ${filePath} (backed up to ${backupPath})`);
      
      return { success: true, backupPath };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to remove ${filePath}: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  /**
   * Safely removes multiple files with backup
   */
  async removeFiles(filePaths: string[]): Promise<{
    successful: string[];
    failed: Array<{ file: string; error: string }>;
    totalRemoved: number;
    totalFailed: number;
  }> {
    const successful: string[] = [];
    const failed: Array<{ file: string; error: string }> = [];

    console.log(`🗑️  Starting removal of ${filePaths.length} files...`);

    for (const filePath of filePaths) {
      const result = await this.removeFile(filePath);
      
      if (result.success) {
        successful.push(filePath);
      } else {
        failed.push({ file: filePath, error: result.error || 'Unknown error' });
        console.error(`❌ Failed to remove: ${filePath} - ${result.error}`);
      }
    }

    console.log(`\n📊 Removal Summary:`);
    console.log(`   ✅ Successfully removed: ${successful.length} files`);
    console.log(`   ❌ Failed to remove: ${failed.length} files`);

    return {
      successful,
      failed,
      totalRemoved: successful.length,
      totalFailed: failed.length
    };
  }

  /**
   * Removes unused files based on analysis report
   */
  async removeUnusedFiles(
    fileReports: FileUsageReport[], 
    options: {
      dryRun?: boolean;
      excludePatterns?: RegExp[];
      confirmBeforeRemoval?: boolean;
    } = {}
  ): Promise<{
    wouldRemove: string[];
    actuallyRemoved: string[];
    skipped: string[];
    failed: Array<{ file: string; error: string }>;
  }> {
    const { dryRun = false, excludePatterns = [], confirmBeforeRemoval = false } = options;

    // Get unused files
    const unusedFiles = fileReports
      .filter(report => !report.isUsed && !this.isProtectedFile(report.filePath))
      .map(report => report.filePath);

    // Apply exclude patterns
    const filesToRemove = unusedFiles.filter(file => {
      return !excludePatterns.some(pattern => pattern.test(file));
    });

    const skipped = unusedFiles.filter(file => {
      return excludePatterns.some(pattern => pattern.test(file));
    });

    console.log(`\n🔍 Found ${unusedFiles.length} unused files`);
    console.log(`📋 Will process ${filesToRemove.length} files (${skipped.length} skipped by patterns)`);

    if (dryRun) {
      console.log('\n🔍 DRY RUN - No files will actually be removed');
      console.log('\nFiles that would be removed:');
      filesToRemove.forEach(file => console.log(`   - ${file}`));
      
      return {
        wouldRemove: filesToRemove,
        actuallyRemoved: [],
        skipped,
        failed: []
      };
    }

    if (confirmBeforeRemoval && filesToRemove.length > 0) {
      console.log('\nFiles to be removed:');
      filesToRemove.forEach(file => console.log(`   - ${file}`));
      console.log('\nNote: All files will be backed up before removal.');
      // In a real CLI, you'd prompt for confirmation here
    }

    // Remove files
    const result = await this.removeFiles(filesToRemove);

    return {
      wouldRemove: filesToRemove,
      actuallyRemoved: result.successful,
      skipped,
      failed: result.failed
    };
  }

  /**
   * Checks if a file should be protected from removal
   */
  private isProtectedFile(filePath: string): boolean {
    const protectedPatterns = [
      /^package\.json$/,
      /^package-lock\.json$/,
      /^bun\.lockb$/,
      /^yarn\.lock$/,
      /^tsconfig.*\.json$/,
      /^vite\.config\./,
      /^tailwind\.config\./,
      /^postcss\.config\./,
      /^eslint\.config\./,
      /^\.gitignore$/,
      /^README/i,
      /^index\.html$/,
      /^src[\/\\]main\./,
      /^src[\/\\]App\./,
      /^src[\/\\]index\./,
      /^public[\/\\]/,
      /^\.env/,
      /^\.git[\/\\]/,
      /^node_modules[\/\\]/,
      /^dist[\/\\]/,
      /^build[\/\\]/
    ];

    return protectedPatterns.some(pattern => pattern.test(filePath));
  }

  /**
   * Restores a file from backup
   */
  async restoreFile(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const backupPath = path.join(this.backupDir, filePath);
      
      if (!fs.existsSync(backupPath)) {
        return { success: false, error: `Backup not found: ${backupPath}` };
      }

      // Create directory if it doesn't exist
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Restore file
      fs.copyFileSync(backupPath, filePath);
      
      // Remove from removed files list
      this.removedFiles = this.removedFiles.filter(f => f !== filePath);
      
      console.log(`✅ Restored: ${filePath}`);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to restore ${filePath}: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  /**
   * Restores all removed files from backup
   */
  async restoreAllFiles(): Promise<{
    successful: string[];
    failed: Array<{ file: string; error: string }>;
  }> {
    const successful: string[] = [];
    const failed: Array<{ file: string; error: string }> = [];

    console.log(`🔄 Restoring ${this.removedFiles.length} files...`);

    for (const filePath of [...this.removedFiles]) {
      const result = await this.restoreFile(filePath);
      
      if (result.success) {
        successful.push(filePath);
      } else {
        failed.push({ file: filePath, error: result.error || 'Unknown error' });
      }
    }

    console.log(`\n📊 Restore Summary:`);
    console.log(`   ✅ Successfully restored: ${successful.length} files`);
    console.log(`   ❌ Failed to restore: ${failed.length} files`);

    return { successful, failed };
  }

  /**
   * Cleans up backup directory
   */
  cleanupBackups(): void {
    if (fs.existsSync(this.backupDir)) {
      fs.rmSync(this.backupDir, { recursive: true, force: true });
      console.log(`🧹 Cleaned up backup directory: ${this.backupDir}`);
    }
  }

  /**
   * Gets list of files that have been removed
   */
  getRemovedFiles(): string[] {
    return [...this.removedFiles];
  }

  /**
   * Gets backup directory path
   */
  getBackupDir(): string {
    return this.backupDir;
  }
}