# nest-firebase-remote-config

---
NestJS module used to fetch Firebase Remote Config values. Uses firebase-admin to connect to Firebase.

Module implements very simple caching mechanism to avoid fetching remote config on every request.

## Installation

```bash
$ yarn add nest-firebase-remote-config
```

## Usage

First register the module in your app module.
```typescript
import { Module } from '@nestjs/common';
import { FirebaseRemoteConfigModule } from 'nest-firebase-remote-config';

@Module({
  imports: [
    FirebaseRemoteConfigModule.registerAsync({
      firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
      ttl: 5000,
    })],
})
export class AppModule {}
```

Then you can inject the `FirebaseRemoteConfigService` in your services and use it to fetch values from Firebase Remote Config.

```typescript
import { Injectable } from '@nestjs/common';
import { FirebaseRemoteConfigService } from 'nest-firebase-remote-config';

@Injectable()
export class AppService {
  constructor(
      private readonly firebaseConfigService: FirebaseRemoteConfigService,
  ) {
  }

  async getParam(): Promise<string> {
    return this.firebaseConfigService.getProperty('param')
  }
}
```

## Options
```typescript
export interface FirebaseRemoteConfigModuleOptions {
  firebaseServiceAccount: string; // Stringified JSON of Firebase service account
  ttl?: number; // Time to cache fetched remote config in milliseconds
}

```