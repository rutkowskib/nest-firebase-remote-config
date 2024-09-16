import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseRemoteConfigService } from './firebase-remote-config.service';
import * as admin from 'firebase-admin';
import { setTimeout } from 'node:timers/promises';
import { MODULE_OPTIONS_TOKEN } from '../firebase-remote-config.module-definition';

jest.mock('firebase-admin');

describe('RemoteConfigService', () => {
  let service: FirebaseRemoteConfigService;
  const TTL = 5000;

  const getTemplate = jest.fn(() => ({
    parameters: {
      property: {
        defaultValue: {
          value: 'value',
        },
      },
    },
    parameterGroups: {
      group: {
        parameters: {
          property: {
            defaultValue: {
              value: 'groupValue',
            },
          },
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
            ttl: TTL,
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
  });

  it('Should get property from group', async () => {
    const property = await service.getProperty('property', 'group');
    expect(property).toEqual('groupValue');
  });

  it('Should use cached template', async () => {
    await setTimeout(TTL); // make sure the cache is expired
    await service.getProperty('property');
    await service.getProperty('property');
    expect(getTemplate).toHaveBeenCalledTimes(1);
  });
});
