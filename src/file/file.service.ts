import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { CloudProvidersMetaData } from './cloud.providers.metadata';
import { R_OK } from 'constants';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private cloudProviders = new CloudProvidersMetaData();
  private readonly allowedRoot = path.resolve(process.cwd());

  private sanitizeFilePath(file: string): string {
    if (
      !file ||
      file.includes('://') ||
      file.startsWith('http') ||
      file.startsWith('//') ||
      file.includes('\\') ||
      file.includes('?') ||
      file.includes('#')
    ) {
      throw new Error('invalid file path');
    }

    const normalizedInput = file.startsWith('/') ? file.slice(1) : file;
    if (!normalizedInput || normalizedInput.includes('..') || path.isAbsolute(normalizedInput)) {
      throw new Error('invalid file path');
    }

    const resolvedPath = path.resolve(this.allowedRoot, normalizedInput);

    if (!resolvedPath.startsWith(this.allowedRoot + path.sep) && resolvedPath !== this.allowedRoot) {
      throw new Error('invalid file path');
    }

    return resolvedPath;
  }

  async getFile(file: string): Promise<Readable> {
    const resolvedFile = this.sanitizeFilePath(file);
    this.logger.log(`Reading file: ${resolvedFile}`);

    await fs.promises.access(resolvedFile, R_OK);

    return fs.createReadStream(resolvedFile);
  }

  async deleteFile(file: string): Promise<boolean> {
    if (file.startsWith('/')) {
      throw new Error('cannot delete file from this location');
    } else if (file.startsWith('http')) {
      throw new Error('cannot delete file from this location');
    } else {
      file = path.resolve(process.cwd(), file);
      await fs.promises.unlink(file);
      return true;
    }
  }
}
