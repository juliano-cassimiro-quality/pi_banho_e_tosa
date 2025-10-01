import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

export interface EnvironmentConfig {
  apiUrl: string;
}

export const ENVIRONMENT = new InjectionToken<EnvironmentConfig>('ENVIRONMENT_CONFIG');

export function provideEnvironment(config: EnvironmentConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ENVIRONMENT, useValue: config }]);
}
