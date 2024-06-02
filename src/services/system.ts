import { readFileSync } from 'fs';
import path from 'path';

export interface ISystem {
  version: string;
  newestVersion: string;
}

class System {
  private packageJsonPath = path.join(process.cwd(), 'package.json');
  system: ISystem | undefined;

  constructor() {
    this.readDBFileSync();
  }

  private readDBFileSync = () => {
    const data = readFileSync(this.packageJsonPath, { encoding: 'utf-8' });
    const parseData = JSON.parse(data || '{}');
    this.system = parseData;
  };

  get version() {
    return this.system?.version;
  }
}

export default new System();
