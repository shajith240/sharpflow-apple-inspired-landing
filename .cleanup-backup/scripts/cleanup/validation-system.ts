import * as fs from 'fs';
import { ProjectAnalyzer } from './project-analyzer.js';
import { FileScanner } from './file-scanner.js';
import { ImportExportAnalyzer } from './import-export-analyzer.js';
import { FileUsageReport } from './types.js';

/**
 * Validation system to ensure no broken references after file removal
 */
export class ValidationSystem {
  private projectAnalyzer: ProjectAnalyzer;
  private fileScanner: FileScanner;
  private importExportAnalyzer: ImportExportAnalyzer;

  constructor() {
    this.projectAnalyzer = new ProjectAnalyzer();
    this.fileScanner = new FileScanner();
    this.importExportAnalyzer = new ImportExportAnalyzer();
  }

  /**
   * Validates that removing files won't break any imports
   */
  async validateFileRemoval(filesToRemove: string[]): Promise<{
    isValid: boolean;
    brokenReferences: Array<{
      file: string;
      missingImport: string;
      importedFrom: string;
    }>;
    warnings: string[];
  }> {
    console.log(`🔍 Validating removal of ${filesToRemove.length} files...`);

    const brokenReferences: Array<{
      file: string;
      missingImport: string;
      importedFrom: string;
    }> = [];
    const warnings: string[] = [];

    // Get all remaining files after removal
    const allFiles = await this.fileScanner.scanProjectFiles();
    const remainingFiles = allFiles.filter(file => !filesToRemove.includes(file));
    const codeFiles = this.fileScanner.getCodeFiles(remainingFiles);

    // Initialize TypeScript program for remaining files
    this.importExportAnalyzer.initializeProgram(codeFiles);

    // Check each remaining file for broken imports
    for (const file of codeFiles) {
      try {
        const analysis = this.importExportAnalyzer.analyzeFile(file);
        
        for (const importInfo of analysis.imports) {
          const resolvedPath = this.importExportAnalyzer.resolveImportPath(importInfo.source, file);
          
          // Check if the imported file would be removed
          if (resolvedPath && filesToRemove.includes(resolvedPath)) {
            brokenReferences.push({
              file,
              missingImport: importInfo.source,
              importedFrom: resolvedPath
            });
          }
          
          // Check for relative imports that might be broken
          if (importInfo.source.startsWith('.')) {
            const resolvedPath = this.importExportAnalyzer.resolveImportPath(importInfo.source, file);
            if (!resolvedPath || !fs.existsSync(resolvedPath)) {
              warnings.push(`Potentially broken import in ${file}: ${importInfo.source}`);
            }
          }
        }
      } catch (error) {
        warnings.push(`Could not analyze ${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    const isValid = brokenReferences.length === 0;

    if (!isValid) {
      console.log(`❌ Validation failed: ${brokenReferences.length} broken references found`);
      brokenReferences.forEach(ref => {
        console.log(`   - ${ref.file} imports ${ref.missingImport} from ${ref.importedFrom}`);
      });
    } else {
      console.log(`✅ Validation passed: No broken references found`);
    }

    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} warnings:`);
      warnings.forEach(warning => console.log(`   - ${warning}`));
    }

    return {
      isValid,
      brokenReferences,
      warnings
    };
  }

  /**
   * Validates the project can still build after file removal
   */
  async validateBuild(): Promise<{
    canBuild: boolean;
    buildOutput: string;
    error?: string;
  }> {
    console.log('🔨 Validating project build...');

    try {
      const { spawn } = await import('child_process');
      
      return new Promise((resolve) => {
        const buildProcess = spawn('npm', ['run', 'build'], {
          stdio: 'pipe',
          shell: true
        });

        let output = '';
        let errorOutput = '';

        buildProcess.stdout?.on('data', (data) => {
          output += data.toString();
        });

        buildProcess.stderr?.on('data', (data) => {
          errorOutput += data.toString();
        });

        buildProcess.on('close', (code) => {
          const canBuild = code === 0;
          const buildOutput = output + errorOutput;

          if (canBuild) {
            console.log('✅ Build validation passed');
          } else {
            console.log('❌ Build validation failed');
            console.log('Build output:', buildOutput);
          }

          resolve({
            canBuild,
            buildOutput,
            error: canBuild ? undefined : `Build failed with exit code ${code}`
          });
        });

        buildProcess.on('error', (error) => {
          resolve({
            canBuild: false,
            buildOutput: '',
            error: `Build process error: ${error.message}`
          });
        });
      });
    } catch (error) {
      return {
        canBuild: false,
        buildOutput: '',
        error: `Failed to start build process: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Performs comprehensive validation before file removal
   */
  async performPreRemovalValidation(filesToRemove: string[]): Promise<{
    canProceed: boolean;
    referenceValidation: Awaited<ReturnType<typeof this.validateFileRemoval>>;
    buildValidation?: Awaited<ReturnType<typeof this.validateBuild>>;
    recommendations: string[];
  }> {
    console.log('\n🔍 Performing pre-removal validation...');

    const recommendations: string[] = [];

    // 1. Validate references
    const referenceValidation = await this.validateFileRemoval(filesToRemove);

    // 2. Validate build (optional, can be slow)
    let buildValidation: Awaited<ReturnType<typeof this.validateBuild>> | undefined;
    
    // Only run build validation if reference validation passes
    if (referenceValidation.isValid) {
      console.log('\n🔨 Running build validation...');
      buildValidation = await this.validateBuild();
    }

    // Generate recommendations
    if (!referenceValidation.isValid) {
      recommendations.push('Fix broken import references before proceeding with file removal');
      recommendations.push('Consider removing files that import the target files first');
    }

    if (buildValidation && !buildValidation.canBuild) {
      recommendations.push('Fix build errors before proceeding with cleanup');
    }

    if (referenceValidation.warnings.length > 0) {
      recommendations.push('Review and fix import warnings to ensure code quality');
    }

    const canProceed = referenceValidation.isValid && (buildValidation?.canBuild !== false);

    console.log(`\n📊 Validation Summary:`);
    console.log(`   Reference validation: ${referenceValidation.isValid ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Build validation: ${buildValidation ? (buildValidation.canBuild ? '✅ PASS' : '❌ FAIL') : '⏭️ SKIPPED'}`);
    console.log(`   Can proceed: ${canProceed ? '✅ YES' : '❌ NO'}`);

    return {
      canProceed,
      referenceValidation,
      buildValidation,
      recommendations
    };
  }

  /**
   * Validates project state after file removal
   */
  async performPostRemovalValidation(): Promise<{
    isHealthy: boolean;
    newAnalysis: Awaited<ReturnType<ProjectAnalyzer['analyzeProject']>>;
    buildValidation: Awaited<ReturnType<typeof this.validateBuild>>;
    issues: string[];
  }> {
    console.log('\n🔍 Performing post-removal validation...');

    const issues: string[] = [];

    // 1. Re-analyze project
    console.log('📊 Re-analyzing project structure...');
    const newAnalysis = await this.projectAnalyzer.analyzeProject();

    // 2. Validate build
    const buildValidation = await this.validateBuild();

    // 3. Check for issues
    if (!buildValidation.canBuild) {
      issues.push('Project no longer builds successfully');
    }

    // Check if we accidentally removed used files
    const stillUnusedFiles = newAnalysis.unusedFiles.length;
    if (stillUnusedFiles === 0) {
      console.log('✅ All unused files have been successfully removed');
    }

    const isHealthy = buildValidation.canBuild && issues.length === 0;

    console.log(`\n📊 Post-removal Summary:`);
    console.log(`   Project builds: ${buildValidation.canBuild ? '✅ YES' : '❌ NO'}`);
    console.log(`   Remaining unused files: ${stillUnusedFiles}`);
    console.log(`   Issues found: ${issues.length}`);
    console.log(`   Project health: ${isHealthy ? '✅ HEALTHY' : '❌ NEEDS ATTENTION'}`);

    return {
      isHealthy,
      newAnalysis,
      buildValidation,
      issues
    };
  }

  /**
   * Checks if specific files are safe to remove
   */
  async checkFilesSafeToRemove(files: string[]): Promise<{
    safeFiles: string[];
    unsafeFiles: Array<{
      file: string;
      reason: string;
      referencedBy: string[];
    }>;
  }> {
    const safeFiles: string[] = [];
    const unsafeFiles: Array<{
      file: string;
      reason: string;
      referencedBy: string[];
    }> = [];

    // Get current project analysis
    const analysis = await this.projectAnalyzer.analyzeProject();
    const fileMap = new Map(analysis.files.map(f => [f.filePath, f]));

    for (const file of files) {
      const fileReport = fileMap.get(file);
      
      if (!fileReport) {
        unsafeFiles.push({
          file,
          reason: 'File not found in project analysis',
          referencedBy: []
        });
        continue;
      }

      if (fileReport.isUsed) {
        unsafeFiles.push({
          file,
          reason: 'File is currently being used',
          referencedBy: fileReport.referencedBy
        });
      } else {
        safeFiles.push(file);
      }
    }

    return { safeFiles, unsafeFiles };
  }
}