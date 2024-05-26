import { readFile, readFileSync, writeFileSync } from 'fs';
import path from 'path';

class MediaService {
  mediaDBPath = path.join(process.cwd(), 'public', 'media', 'imgs');

  // TODO
}

export default new MediaService();
