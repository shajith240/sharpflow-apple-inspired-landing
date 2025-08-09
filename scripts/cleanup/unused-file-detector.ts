import { ProjectAnalyzer } from './project-analyzer.js';
import { FileRemover } from './file-remover.js';
import { ValidationSystem } from './validation-system.js';
import { FileUsageReport, ProjectAnalysisResult } from './types.js';

/**
 * Main unused file detection system that orchestrates analysis, validation, and removal
 */
export class UnusedFileDetector {
  private projectAnalyzer: ProjectAnalyzer;
  private fileRemover: FileRemover;
  private validationSystem: ValidationSystem;

  constructor(backupDir?: string) {
    this.projectAnalyzer = new ProjectAnalyzer();
    this.fileRemover = new FileRemover(backupDir);
    this.validationSystem = new ValidationSystem();
  }

  /**
   * Performs complete unused file detection and analysis
   */
  async detectUnusedFiles(): Promise<{
    analysis: ProjectAnalysisResult;
    unusedFiles: string[];
    safeToRemove: string[];
    requiresReview: Array<{
      file: string;
      reason: string;
      size: number;
    }>;
  }> {
    console.log('🔍 Starting unused file detection...');

    // 1. Analyze project
    const analysis = await this.projectAnalyzer.analyzeProject();

    // 2. Get unused files
    const unusedFiles = analysis.unusedFiles;

    // 3. Categorize files
    const safeToRemove: string[] = [];
    const requiresReview: Array<{
      file: string;
      reason: string;
      size: number;
    }> = [];

    for (const file of unusedFiles) {
      const fileReport = analysis.files.find(f => f.filePath === file);
      if (!fileReport) continue;

      // Check if file requires manual review
      const reviewReason = this.getReviewReason(file, fileReport);
      
      if (reviewReason) {
        requiresReview.push({
          file,
          reason: reviewReason,
          size: fileReport.size
        });
      } else {
        safeToRemove.push(file);
      }
    }

    console.log(`\n📊 Detection Summary:`);
    console.log(`   Total unused files: ${unusedFiles.length}`);
    console.log(`   Safe to remove: ${safeToRemove.length}`);
    console.log(`   Requires review: ${requiresReview.length}`);

    return {
      analysis,
      unusedFiles,
      safeToRemove,
      requiresReview
    };
  }

  /**
   * Safely removes unused files with full validation
   */
  async removeUnusedFiles(options: {
    dryRun?: boolean;
    skipValidation?: boolean;
    includeReviewFiles?: boolean;
    excludePatterns?: RegExp[];
    autoConfirm?: boolean;
  } = {}): Promise<{
    success: boolean;
    summary: {
      totalAnalyzed: number;
      totalUnused: number;
      totalRemoved: number;
      totalSkipped: number;
      totalFailed: number;
      spaceSaved: number;
    };
    details: {
      removed: string[];
      skipped: string[];
      failed: Array<{ file: string; error: string }>;
      requiresReview: Array<{ file: string; reason: string }>;
    };
    validationResults?: any;
  }> {
    const {
      dryRun = false,
      skipValidation = false,
      includeReviewFiles = false,
      excludePatterns = [],
      autoConfirm = false
    } = options;

    console.log('🚀 Starting safe unused file removal...');

    // 1. Detect unused files
    const detection = await this.detectUnusedFiles();
    
    // 2. Determine files to remove
    let filesToRemove = detection.safeToRemove;
    
    if (includeReviewFiles) {
      const reviewFiles = detection.requiresReview.map(r => r.file);
      filesToRemove = [...filesToRemove, ...reviewFiles];
      
      console.log(`⚠️  Including ${reviewFiles.length} files that require review`);
      detection.requiresReview.forEach(item => {
        console.log(`   - ${item.file}: ${item.reason}`);
      });
    }

    // 3. Apply exclude patterns
    const originalCount = filesToRemove.length;
    filesToRemove = filesToRemove.filter(file => {
      return !excludePatterns.some(pattern => pattern.test(file));
    });
    const excludedCount = originalCount - filesToRemove.length;

    if (excludedCount > 0) {
      console.log(`📋 Excluded ${excludedCount} files based on patterns`);
    }

    // 4. Pre-removal validation
    let validationResults;
    if (!skipValidation && !dryRun) {
      validationResults = await this.validationSystem.performPreRemovalValidation(filesToRemove);
      
      if (!validationResults.canProceed) {
        console.log('❌ Validation failed. Aborting removal.');
        console.log('Recommendations:');
        validationResults.recommendations.forEach(rec => console.log(`   - ${rec}`));
        
        return {
          success: false,
          summary: {
            totalAnalyzed: detection.analysis.totalFiles,
            totalUnused: detection.unusedFiles.length,
            totalRemoved: 0,
            totalSkipped: filesToRemove.length,
            totalFailed: 0,
            spaceSaved: 0
          },
          details: {
            removed: [],
            skipped: filesToRemove,
            failed: [],
            requiresReview: detection.requiresReview
          },
          validationResults
        };
      }
    }

    // 5. Remove files
    const removalResult = await this.fileRemover.removeUnusedFiles(
      detection.analysis.files,
      {
        dryRun,
        excludePatterns,
        confirmBeforeRemoval: !autoConfirm
      }
    );

    // 6. Calculate space saved
    const spaceSaved = removalResult.actuallyRemoved.reduce((total, file) => {
      const fileReport = detection.analysis.files.find(f => f.filePath === file);
      return total + (fileReport?.size || 0);
    }, 0);

    // 7. Post-removal validation
    if (!dryRun && !skipValidation && removalResult.actuallyRemoved.length > 0) {
      console.log('\n🔍 Running post-removal validation...');
      const postValidation = await this.validationSystem.performPostRemovalValidation();
      
      if (!postValidation.isHealthy) {
        console.log('⚠️  Post-removal validation detected issues. Consider rollback.');
        console.log('Issues:');
        postValidation.issues.forEach(issue => console.log(`   - ${issue}`));
      }
    }

    const success = removalResult.failed.length === 0;

    console.log('\n🎉 Removal process completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   Files analyzed: ${detection.analysis.totalFiles}`);
    console.log(`   Unused files found: ${detection.unusedFiles.length}`);
    console.log(`   Files removed: ${removalResult.actuallyRemoved.length}`);
    console.log(`   Files skipped: ${removalResult.skipped.length}`);
    console.log(`   Files failed: ${removalResult.failed.length}`);
    console.log(`   Space saved: ${this.formatBytes(spaceSaved)}`);

    return {
      success,
      summary: {
        totalAnalyzed: detection.analysis.totalFiles,
        totalUnused: detection.unusedFiles.length,
        totalRemoved: removalResult.actuallyRemoved.length,
        totalSkipped: removalResult.skipped.length,
        totalFailed: removalResult.failed.length,
        spaceSaved
      },
      details: {
        removed: removalResult.actuallyRemoved,
        skipped: removalResult.skipped,
        failed: removalResult.failed,
        requiresReview: detection.requiresReview
      },
      validationResults
    };
  }

  /**
   * Rolls back file removal
   */
  async rollbackRemoval(): Promise<{
    success: boolean;
    restored: string[];
    failed: Array<{ file: string; error: string }>;
  }> {
    console.log('🔄 Rolling back file removal...');
    
    const result = await this.fileRemover.restoreAllFiles();
    
    return {
      success: result.failed.length === 0,
      restored: result.successful,
      failed: result.failed
    };
  }

  /**
   * Gets removal history
   */
  getRemovalHistory(): {
    removedFiles: string[];
    backupDir: string;
  } {
    return {
      removedFiles: this.fileRemover.getRemovedFiles(),
      backupDir: this.fileRemover.getBackupDir()
    };
  }

  /**
   * Cleans up backup files
   */
  cleanupBackups(): void {
    this.fileRemover.cleanupBackups();
  }

  /**
   * Determines if a file requires manual review before removal
   */
  private getReviewReason(filePath: string, fileReport: FileUsageReport): string | null {
    // Large files should be reviewed
    if (fileReport.size > 100 * 1024) { // > 100KB
      return `Large file (${this.formatBytes(fileReport.size)}) - review before removal`;
    }

    // Configuration files
    if (filePath.includes('config') || filePath.includes('.config.')) {
      return 'Configuration file - verify not needed';
    }

    // Type definition files
    if (filePath.endsWith('.d.ts')) {
      return 'Type definition file - verify not needed';
    }

    // Documentation files
    if (filePath.toLowerCase().includes('readme') || filePath.toLowerCase().includes('doc')) {
      return 'Documentation file - review content';
    }

    // Test files
    if (filePath.includes('test') || filePath.includes('spec')) {
      return 'Test file - verify not needed';
    }

    // Files with exports (might be used dynamically)
    if (fileReport.exports.length > 0) {
      return `Has exports (${fileReport.exports.join(', ')}) - verify not used dynamically`;
    }

    return null;
  }

  /**
   * Formats bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}