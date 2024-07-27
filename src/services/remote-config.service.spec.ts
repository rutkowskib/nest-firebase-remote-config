import { Test, TestingModule } from '@nestjs/testing';
import { RemoteConfigService } from './remote-config.service';
import * as admin from 'firebase-admin';
import { setTimeout } from 'node:timers/promises';

jest.mock('firebase-admin');

describe('RemoteConfigService', () => {
  let service: RemoteConfigService;

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
      providers: [RemoteConfigService],
    }).compile();
    service = module.get<RemoteConfigService>(RemoteConfigService);

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
    await service.getProperty('property');
    await setTimeout(5000);
    await service.getProperty('property');
    expect(getTemplate).toHaveBeenCalledTimes(1);
  });
});
