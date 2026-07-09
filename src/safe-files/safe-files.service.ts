import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dns from 'dns/promises';
import { URL } from 'url';

export interface SafeFileResponse {
  name: string;
  url: string;
  content: string;
}

@Injectable()
export class SafeFilesService {
  async add(name: string, url: string): Promise<SafeFileResponse> {
    const content = await this.fetchContent(url);
    return { name, url, content };
  }

  private async fetchContent(url: string): Promise<string> {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '::1' ||
        hostname === '169.254.169.254' ||
        hostname.endsWith('.local')
      ) {
        return '';
      }
      const response = await axios.get(parsed.toString(), { responseType: 'text' });
      return typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data);
    } catch {
      return '';
    }
  }
}
