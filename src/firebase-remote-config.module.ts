import { DynamicModule, Module } from '@nestjs/common';
import admin from 'firebase-admin';
import { FirebaseRemoteConfigService } from './services/firebase-remote-config.service';

interface FirebaseRemoteConfigModuleOptions {
  firebaseServiceAccount: string;
}

@Module({})
export class FirebaseRemoteConfigModule {
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
      ],
      module: FirebaseRemoteConfigModule,
      exports: [FirebaseRemoteConfigService],
    };
  }
}
