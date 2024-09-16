import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseRemoteConfigService } from './services/firebase-remote-config.service';
import { FirebaseRemoteConfigModule } from './firebase-remote-config.module';

jest.mock('firebase-admin');

describe('FirebaseRemoteConfigModule', () => {
  let service: FirebaseRemoteConfigService;
  let module: FirebaseRemoteConfigModule;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        FirebaseRemoteConfigModule.registerAsync({
          firebaseServiceAccount: '{}',
          ttl: 5000,
        }),
      ],
    }).compile();

    service = testingModule.get<FirebaseRemoteConfigService>(
      FirebaseRemoteConfigService,
    );

    module = testingModule.get<FirebaseRemoteConfigModule>(
      FirebaseRemoteConfigModule,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Module should be defined', () => {
    expect(module).toBeDefined();
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });
});
