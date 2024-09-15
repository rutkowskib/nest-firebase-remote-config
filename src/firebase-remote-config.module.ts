import { DynamicModule, Module } from '@nestjs/common';
import admin from 'firebase-admin';
import { FirebaseRemoteConfigService } from './services/firebase-remote-config.service';
import { FirebaseRemoteConfigModuleOptions } from './firebase-remote-config.interface';
import { ConfigurableModuleClass } from './firebase-remote-config.module-definition';

@Module({})
export class FirebaseRemoteConfigModule extends ConfigurableModuleClass {
  static forRootAsync(
    options: FirebaseRemoteConfigModuleOptions,
  ): DynamicModule {
    return {
      providers: [
        {
          provide: 'FIREBASE_ADMIN',
          useFactory: async () => {
            admin.initializeApp({
              credential: admin.credential.cert(options.firebaseServiceAccount),
            });
          },
        },
        FirebaseRemoteConfigService,
      ],
      module: FirebaseRemoteConfigModule,
      exports: [FirebaseRemoteConfigService],
    };
  }
}
