/**
 * Type definitions for project analysis and cleanup utilities
 */

export interface FileUsageReport {
  filePath: string;
  isUsed: boolean;
  referencedBy: string[];
  exports: string[];
  imports: string[];
  size: number;
}

export interface CodeAnalysisReport {
  unusedImports: string[];
  unusedVariables: string[];
  unusedFunctions: string[];
  deadCode: CodeBlock[];
}

export interface CodeBlock {
  startLine: number;
  endLine: number;
  content: string;
  type: 'function' | 'variable' | 'import' | 'export';
}

export interface DependencyReport {
  packageName: string;
  isUsed: boolean;
  usageLocations: string[];
  size: number;
  isDev: boolean;
}

export interface ProjectAnalysisResult {
  files: FileUsageReport[];
  dependencies: DependencyReport[];
  totalFiles: number;
  totalSize: number;
  unusedFiles: string[];
  unusedDependencies: string[];
}

export interface ImportExportInfo {
  imports: ImportInfo[];
  exports: ExportInfo[];
}

export interface ImportInfo {
  source: string;
  specifiers: string[];
  isDefault: boolean;
  isNamespace: boolean;
  line: number;
}

export interface ExportInfo {
  name: string;
  isDefault: boolean;
  line: number;
  type: 'function' | 'variable' | 'class' | 'interface' | 'type';
}