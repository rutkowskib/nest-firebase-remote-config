import { DynamicModule, Logger, Module } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
import { FirebaseRemoteConfigService } from './services/firebase-remote-config.service';
import { FirebaseRemoteConfigModuleOptions } from './firebase-remote-config.interface';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './firebase-remote-config.module-definition';

@Module({})
export class FirebaseRemoteConfigModule extends ConfigurableModuleClass {
  static logger = new Logger(FirebaseRemoteConfigModule.name);

  static registerAsync(
    options: FirebaseRemoteConfigModuleOptions,
  ): DynamicModule {
    return {
      providers: [
        {
          provide: 'FIREBASE_ADMIN',
          useFactory: async () => {
            let cert: ServiceAccount;
            try {
              cert = JSON.parse(options.firebaseServiceAccount);
            } catch (error) {
              FirebaseRemoteConfigModule.logger.error(
                'Failed to parse Firebase service account',
                error.stack,
              );
              throw error;
            }
            admin.initializeApp({
              credential: admin.credential.cert(cert),
            });
          },
        },
        FirebaseRemoteConfigService,
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: options,
        },
      ],
      module: FirebaseRemoteConfigModule,
      exports: [FirebaseRemoteConfigService],
    };
  }
}
