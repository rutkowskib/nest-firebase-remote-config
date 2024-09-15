import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseRemoteConfigService } from './firebase-remote-config.service';
import * as admin from 'firebase-admin';
import { setTimeout } from 'node:timers/promises';
import { MODULE_OPTIONS_TOKEN } from '../firebase-remote-config.module-definition';

jest.mock('firebase-admin');

describe('RemoteConfigService', () => {
  let service: FirebaseRemoteConfigService;

  const getTemplate = jest.fn(() => ({
    parameters: {
      property: {
        defaultValue: {
          value: 'value',
        },
      },
    },
  }));

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: {
            ttl: 5000,
          },
        },
        FirebaseRemoteConfigService,
      ],
    }).compile();
    service = module.get<FirebaseRemoteConfigService>(
      FirebaseRemoteConfigService,
    );

    Object.defineProperty(admin, 'remoteConfig', {
      value: jest.fn(() => ({
        getTemplate,
      })),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should get property', async () => {
    const property = await service.getProperty('property');
    expect(property).toEqual('value');
    expect(getTemplate).toHaveBeenCalledTimes(1);
  });

  it('Should use cached template', async () => {
    await setTimeout(5000); // make sure the cache is expired
    await service.getProperty('property');
    await service.getProperty('property');
    expect(getTemplate).toHaveBeenCalledTimes(1);
  });
});
