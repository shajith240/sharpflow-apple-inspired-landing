import * as ts from 'typescript';
import * as path from 'path';
import { ImportExportInfo, ImportInfo, ExportInfo } from './types.js';

/**
 * Analyzes TypeScript/JavaScript files to extract import/export information
 */
export class ImportExportAnalyzer {
  private program: ts.Program | null = null;

  /**
   * Initialize TypeScript program for analysis
   */
  initializeProgram(files: string[], tsConfigPath?: string): void {
    const configPath = tsConfigPath || this.findTsConfig();
    let compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      allowJs: true,
      jsx: ts.JsxEmit.ReactJSX,
      skipLibCheck: true,
      strict: false
    };

    if (configPath) {
      const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
      if (!configFile.error) {
        const parsedConfig = ts.parseJsonConfigFileContent(
          configFile.config,
          ts.sys,
          path.dirname(configPath)
        );
        compilerOptions = { ...compilerOptions, ...parsedConfig.options };
      }
    }

    this.program = ts.createProgram(files, compilerOptions);
  }

  /**
   * Analyzes a file to extract import and export information
   */
  analyzeFile(filePath: string): ImportExportInfo {
    if (!this.program) {
      throw new Error('TypeScript program not initialized. Call initializeProgram first.');
    }

    const sourceFile = this.program.getSourceFile(filePath);
    if (!sourceFile) {
      return { imports: [], exports: [] };
    }

    const imports: ImportInfo[] = [];
    const exports: ExportInfo[] = [];

    const visit = (node: ts.Node): void => {
      // Handle import declarations
      if (ts.isImportDeclaration(node)) {
        const importInfo = this.extractImportInfo(node);
        if (importInfo) {
          imports.push(importInfo);
        }
      }
      
      // Handle export declarations
      if (ts.isExportDeclaration(node) || ts.isExportAssignment(node)) {
        const exportInfo = this.extractExportInfo(node);
        if (exportInfo) {
          exports.push(...exportInfo);
        }
      }

      // Handle function declarations with export modifier
      if (ts.isFunctionDeclaration(node) && this.hasExportModifier(node)) {
        const exportInfo = this.extractFunctionExport(node);
        if (exportInfo) {
          exports.push(exportInfo);
        }
      }

      // Handle variable declarations with export modifier
      if (ts.isVariableStatement(node) && this.hasExportModifier(node)) {
        const exportInfos = this.extractVariableExports(node);
        exports.push(...exportInfos);
      }

      // Handle class declarations with export modifier
      if (ts.isClassDeclaration(node) && this.hasExportModifier(node)) {
        const exportInfo = this.extractClassExport(node);
        if (exportInfo) {
          exports.push(exportInfo);
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return { imports, exports };
  }

  private extractImportInfo(node: ts.ImportDeclaration): ImportInfo | null {
    const moduleSpecifier = node.moduleSpecifier;
    if (!ts.isStringLiteral(moduleSpecifier)) {
      return null;
    }

    const source = moduleSpecifier.text;
    const specifiers: string[] = [];
    let isDefault = false;
    let isNamespace = false;

    if (node.importClause) {
      // Default import
      if (node.importClause.name) {
        specifiers.push(node.importClause.name.text);
        isDefault = true;
      }

      // Named imports
      if (node.importClause.namedBindings) {
        if (ts.isNamespaceImport(node.importClause.namedBindings)) {
          specifiers.push(node.importClause.namedBindings.name.text);
          isNamespace = true;
        } else if (ts.isNamedImports(node.importClause.namedBindings)) {
          for (const element of node.importClause.namedBindings.elements) {
            specifiers.push(element.name.text);
          }
        }
      }
    }

    return {
      source,
      specifiers,
      isDefault,
      isNamespace,
      line: ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1
    };
  }

  private extractExportInfo(node: ts.ExportDeclaration | ts.ExportAssignment): ExportInfo[] {
    const exports: ExportInfo[] = [];
    const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;

    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const element of node.exportClause.elements) {
          exports.push({
            name: element.name.text,
            isDefault: false,
            line,
            type: 'variable' // Default to variable, could be refined
          });
        }
      }
    } else if (ts.isExportAssignment(node)) {
      exports.push({
        name: 'default',
        isDefault: true,
        line,
        type: 'variable'
      });
    }

    return exports;
  }

  private extractFunctionExport(node: ts.FunctionDeclaration): ExportInfo | null {
    if (!node.name) return null;

    const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
    const isDefault = this.hasDefaultModifier(node);

    return {
      name: isDefault ? 'default' : node.name.text,
      isDefault,
      line,
      type: 'function'
    };
  }

  private extractVariableExports(node: ts.VariableStatement): ExportInfo[] {
    const exports: ExportInfo[] = [];
    const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
    const isDefault = this.hasDefaultModifier(node);

    for (const declaration of node.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) {
        exports.push({
          name: isDefault ? 'default' : declaration.name.text,
          isDefault,
          line,
          type: 'variable'
        });
      }
    }

    return exports;
  }

  private extractClassExport(node: ts.ClassDeclaration): ExportInfo | null {
    if (!node.name) return null;

    const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
    const isDefault = this.hasDefaultModifier(node);

    return {
      name: isDefault ? 'default' : node.name.text,
      isDefault,
      line,
      type: 'class'
    };
  }

  private hasExportModifier(node: ts.Node): boolean {
    return node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
  }

  private hasDefaultModifier(node: ts.Node): boolean {
    return node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword) ?? false;
  }

  private findTsConfig(): string | null {
    const possiblePaths = ['tsconfig.json', 'tsconfig.app.json'];
    
    for (const configPath of possiblePaths) {
      if (ts.sys.fileExists(configPath)) {
        return configPath;
      }
    }
    
    return null;
  }

  /**
   * Resolves import path to actual file path
   */
  resolveImportPath(importPath: string, fromFile: string): string | null {
    if (!this.program) return null;

    // Handle relative imports
    if (importPath.startsWith('.')) {
      const fromDir = path.dirname(fromFile);
      const resolved = path.resolve(fromDir, importPath);
      
      // Try different extensions
      const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
      for (const ext of extensions) {
        const withExt = resolved + ext;
        if (ts.sys.fileExists(withExt)) {
          return path.relative('.', withExt);
        }
      }
      
      // Try index files
      for (const ext of extensions) {
        const indexFile = path.join(resolved, 'index' + ext);
        if (ts.sys.fileExists(indexFile)) {
          return path.relative('.', indexFile);
        }
      }
    }

    return null;
  }
}