import { Injectable, Logger } from '@nestjs/common';
import admin, { remoteConfig } from 'firebase-admin';

@Injectable()
export class FirebaseRemoteConfigService {
  private readonly logger = new Logger(FirebaseRemoteConfigService.name);

  private template: remoteConfig.RemoteConfigTemplate;
  private templateFetchedTimestamp: number;

  async getProperty(key: string): Promise<string> {
    this.logger.debug(`Fetching remote config property for key: ${key}...`);
    const template = await this.fetchTemplate();
    const property = (
      template.parameters[key]
        .defaultValue as remoteConfig.ExplicitParameterValue
    ).value;
    this.logger.debug(`Fetched remote config property for key: ${key}`, {
      property,
    });
    return property;
  }

  private async fetchTemplate(): Promise<remoteConfig.RemoteConfigTemplate> {
    this.logger.debug('Fetching remote config template...');
    if (!this.template || Date.now() - this.templateFetchedTimestamp > 1000 * 5) {
      const template = await admin.remoteConfig().getTemplate();
      this.templateFetchedTimestamp = Date.now();
      this.logger.debug('Fetched remote config template', { template });
      this.template = template;
    } else {
      this.logger.debug('Using cached remote config template');
    }
    return this.template;
  }
}
