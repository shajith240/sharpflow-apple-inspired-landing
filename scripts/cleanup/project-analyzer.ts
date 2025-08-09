import { FileScanner } from './file-scanner.js';
import { ImportExportAnalyzer } from './import-export-analyzer.js';
import { ProjectAnalysisResult, FileUsageReport, DependencyReport } from './types.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Main project analyzer that orchestrates file scanning and dependency analysis
 */
export class ProjectAnalyzer {
  private fileScanner: FileScanner;
  private importExportAnalyzer: ImportExportAnalyzer;

  constructor() {
    this.fileScanner = new FileScanner();
    this.importExportAnalyzer = new ImportExportAnalyzer();
  }

  /**
   * Performs comprehensive project analysis
   */
  async analyzeProject(rootDir: string = '.'): Promise<ProjectAnalysisResult> {
    console.log('🔍 Starting project analysis...');
    
    // Step 1: Scan all project files
    console.log('📁 Scanning project files...');
    const allFiles = await this.fileScanner.scanProjectFiles(rootDir);
    console.log(`Found ${allFiles.length} files`);

    // Step 2: Initialize TypeScript program for code analysis
    console.log('🔧 Initializing TypeScript analysis...');
    const codeFiles = this.fileScanner.getCodeFiles(allFiles);
    this.importExportAnalyzer.initializeProgram(codeFiles);

    // Step 3: Analyze file usage and dependencies
    console.log('🔗 Analyzing file dependencies...');
    const fileReports = await this.analyzeFileUsage(allFiles);

    // Step 4: Analyze package dependencies
    console.log('📦 Analyzing package dependencies...');
    const dependencyReports = await this.analyzeDependencies(codeFiles);

    // Step 5: Identify unused files and dependencies
    const unusedFiles = fileReports
      .filter(report => !report.isUsed && !this.isEntryPoint(report.filePath))
      .map(report => report.filePath);

    const unusedDependencies = dependencyReports
      .filter(report => !report.isUsed)
      .map(report => report.packageName);

    const totalSize = fileReports.reduce((sum, report) => sum + report.size, 0);

    console.log('✅ Analysis complete!');
    console.log(`📊 Summary: ${allFiles.length} files, ${unusedFiles.length} unused files, ${unusedDependencies.length} unused dependencies`);

    return {
      files: fileReports,
      dependencies: dependencyReports,
      totalFiles: allFiles.length,
      totalSize,
      unusedFiles,
      unusedDependencies
    };
  }

  /**
   * Analyzes file usage patterns and relationships
   */
  private async analyzeFileUsage(files: string[]): Promise<FileUsageReport[]> {
    const fileReports: FileUsageReport[] = [];
    const fileMap = new Map<string, FileUsageReport>();

    // Initialize file reports
    for (const file of files) {
      const report = this.fileScanner.createFileUsageReport(file);
      fileReports.push(report);
      fileMap.set(file, report);
    }

    // Analyze code files for import/export relationships
    const codeFiles = this.fileScanner.getCodeFiles(files);
    
    for (const file of codeFiles) {
      try {
        const analysis = this.importExportAnalyzer.analyzeFile(file);
        const report = fileMap.get(file);
        
        if (report) {
          // Store exports
          report.exports = analysis.exports.map(exp => exp.name);
          
          // Process imports and build dependency graph
          for (const importInfo of analysis.imports) {
            report.imports.push(importInfo.source);
            
            // Resolve import to actual file
            const resolvedPath = this.importExportAnalyzer.resolveImportPath(importInfo.source, file);
            if (resolvedPath && fileMap.has(resolvedPath)) {
              const importedFile = fileMap.get(resolvedPath)!;
              importedFile.referencedBy.push(file);
              importedFile.isUsed = true;
            }
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not analyze file ${file}:`, error);
      }
    }

    // Mark entry points and their dependencies as used
    this.markEntryPointsAsUsed(fileMap);

    // Mark asset files referenced in code as used
    this.markReferencedAssetsAsUsed(fileMap, files);

    return fileReports;
  }

  /**
   * Analyzes package.json dependencies
   */
  private async analyzeDependencies(codeFiles: string[]): Promise<DependencyReport[]> {
    const packageJsonPath = 'package.json';
    if (!fs.existsSync(packageJsonPath)) {
      return [];
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const reports: DependencyReport[] = [];

    // Read all code files to check for package usage
    const allCodeContent = codeFiles
      .map(file => this.fileScanner.readFileContent(file))
      .join('\n');

    for (const [packageName, version] of Object.entries(dependencies)) {
      const isUsed = this.isPackageUsed(packageName, allCodeContent, codeFiles);
      const usageLocations = isUsed ? this.findPackageUsageLocations(packageName, codeFiles) : [];
      
      reports.push({
        packageName,
        isUsed,
        usageLocations,
        size: 0, // Could be enhanced to get actual package size
        isDev: packageJson.devDependencies && packageName in packageJson.devDependencies
      });
    }

    return reports;
  }

  /**
   * Checks if a package is used in the codebase
   */
  private isPackageUsed(packageName: string, allContent: string, codeFiles: string[]): boolean {
    // Check for direct imports
    const importPatterns = [
      new RegExp(`from\\s+['"]${packageName}['"]`, 'g'),
      new RegExp(`import\\s+['"]${packageName}['"]`, 'g'),
      new RegExp(`require\\s*\\(\\s*['"]${packageName}['"]\\s*\\)`, 'g'),
      new RegExp(`from\\s+['"]${packageName}/`, 'g'),
      new RegExp(`import\\s+['"]${packageName}/`, 'g'),
      new RegExp(`require\\s*\\(\\s*['"]${packageName}/`, 'g')
    ];

    return importPatterns.some(pattern => pattern.test(allContent));
  }

  /**
   * Finds specific locations where a package is used
   */
  private findPackageUsageLocations(packageName: string, codeFiles: string[]): string[] {
    const locations: string[] = [];

    for (const file of codeFiles) {
      const content = this.fileScanner.readFileContent(file);
      const importPatterns = [
        new RegExp(`from\\s+['"]${packageName}['"]`, 'g'),
        new RegExp(`import\\s+['"]${packageName}['"]`, 'g'),
        new RegExp(`require\\s*\\(\\s*['"]${packageName}['"]\\s*\\)`, 'g'),
        new RegExp(`from\\s+['"]${packageName}/`, 'g'),
        new RegExp(`import\\s+['"]${packageName}/`, 'g'),
        new RegExp(`require\\s*\\(\\s*['"]${packageName}/`, 'g')
      ];

      if (importPatterns.some(pattern => pattern.test(content))) {
        locations.push(file);
      }
    }

    return locations;
  }

  /**
   * Marks entry points and their dependencies as used
   */
  private markEntryPointsAsUsed(fileMap: Map<string, FileUsageReport>): void {
    const entryPoints = [
      'src/main.tsx',
      'src/main.ts',
      'src/index.tsx',
      'src/index.ts',
      'src/App.tsx',
      'src/App.ts',
      'index.html',
      'vite.config.ts',
      'vite.config.js'
    ];

    const markAsUsed = (filePath: string): void => {
      const report = fileMap.get(filePath);
      if (report && !report.isUsed) {
        report.isUsed = true;
        // Recursively mark imported files as used
        for (const importPath of report.imports) {
          const resolvedPath = this.importExportAnalyzer.resolveImportPath(importPath, filePath);
          if (resolvedPath) {
            markAsUsed(resolvedPath);
          }
        }
      }
    };

    for (const entryPoint of entryPoints) {
      if (fileMap.has(entryPoint)) {
        markAsUsed(entryPoint);
      }
    }
  }

  /**
   * Marks asset files that are referenced in code as used
   */
  private markReferencedAssetsAsUsed(fileMap: Map<string, FileUsageReport>, allFiles: string[]): void {
    const codeFiles = this.fileScanner.getCodeFiles(allFiles);
    const assetFiles = this.fileScanner.getAssetFiles(allFiles);

    for (const codeFile of codeFiles) {
      const content = this.fileScanner.readFileContent(codeFile);
      
      for (const assetFile of assetFiles) {
        const assetName = path.basename(assetFile);
        const assetPath = assetFile.replace(/\\/g, '/'); // Normalize path separators
        
        // Check if asset is referenced in the code
        if (content.includes(assetName) || content.includes(assetPath)) {
          const report = fileMap.get(assetFile);
          if (report) {
            report.isUsed = true;
            report.referencedBy.push(codeFile);
          }
        }
      }
    }
  }

  /**
   * Checks if a file is an entry point that should never be marked as unused
   */
  private isEntryPoint(filePath: string): boolean {
    const entryPoints = [
      'src/main.tsx',
      'src/main.ts',
      'src/index.tsx',
      'src/index.ts',
      'src/App.tsx',
      'src/App.ts',
      'index.html',
      'vite.config.ts',
      'vite.config.js',
      'package.json',
      'tsconfig.json',
      'tsconfig.app.json',
      'tsconfig.node.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'eslint.config.js'
    ];

    return entryPoints.includes(filePath) || filePath.includes('README');
  }
}