import { ConfigurableModuleBuilder } from '@nestjs/common';
import { FirebaseRemoteConfigModuleOptions } from './firebase-remote-config.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<FirebaseRemoteConfigModuleOptions>().build();
