import * as fs from 'fs';
import * as path from 'path';
import { FileUsageReport } from './types.js';

/**
 * File system scanner that maps all project files and their relationships
 */
export class FileScanner {
  private readonly excludePatterns = [
    /node_modules/,
    /\.git/,
    /dist/,
    /build/,
    /coverage/,
    /\.next/,
    /\.vercel/,
    /\.kiro/,
    /\.qodo/,
    /\.vscode/,
    /\.DS_Store/,
    /\.env/,
    /\.log$/,
    /\.lock$/,
    /\.lockb$/
  ];

  private readonly includeExtensions = [
    '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.html'
  ];

  /**
   * Scans the project directory and returns all relevant files
   */
  async scanProjectFiles(rootDir: string = '.'): Promise<string[]> {
    const files: string[] = [];
    
    const scanDirectory = (dir: string): void => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(rootDir, fullPath);
        
        // Skip excluded patterns
        if (this.shouldExclude(relativePath)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile() && this.shouldInclude(entry.name)) {
          files.push(relativePath);
        }
      }
    };
    
    scanDirectory(rootDir);
    return files.sort();
  }

  /**
   * Gets file information including size and modification time
   */
  getFileInfo(filePath: string): { size: number; mtime: Date } {
    try {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        mtime: stats.mtime
      };
    } catch (error) {
      return { size: 0, mtime: new Date() };
    }
  }

  /**
   * Reads file content safely
   */
  readFileContent(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}:`, error);
      return '';
    }
  }

  /**
   * Creates initial file usage report structure
   */
  createFileUsageReport(filePath: string): FileUsageReport {
    const fileInfo = this.getFileInfo(filePath);
    
    return {
      filePath,
      isUsed: false, // Will be determined by dependency analysis
      referencedBy: [],
      exports: [],
      imports: [],
      size: fileInfo.size
    };
  }

  private shouldExclude(filePath: string): boolean {
    return this.excludePatterns.some(pattern => pattern.test(filePath));
  }

  private shouldInclude(fileName: string): boolean {
    const ext = path.extname(fileName);
    return this.includeExtensions.includes(ext);
  }

  /**
   * Gets all TypeScript/JavaScript files for code analysis
   */
  getCodeFiles(files: string[]): string[] {
    return files.filter(file => {
      const ext = path.extname(file);
      return ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
    });
  }

  /**
   * Gets all asset files (CSS, images, etc.)
   */
  getAssetFiles(files: string[]): string[] {
    return files.filter(file => {
      const ext = path.extname(file);
      return ['.css', '.scss', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext);
    });
  }
}