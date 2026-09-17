import * as fs from 'fs';
import * as path from 'path';

export interface EnvConfig {
  baseUrl: string;
  timeout: number;
  username: string;
  password: string;
}

class ConfigManager {
  private config: EnvConfig;

  constructor() {
    const env = process.env.ENV || 'dev';
    const configPath = path.resolve(__dirname, 'env', `${env}.json`);
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found for environment "${env}" at ${configPath}`);
    }
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  public get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }

  public getAll(): EnvConfig {
    return this.config;
  }
}

export default new ConfigManager();
