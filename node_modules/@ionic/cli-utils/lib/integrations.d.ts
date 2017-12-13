import { IntegrationTemplate, IonicEnvironment } from '../definitions';
export declare const INTEGRATIONS: IntegrationTemplate[];
export interface IntegrationOptions {
    quiet?: boolean;
}
export declare function enableIntegration(env: IonicEnvironment, id: string, opts?: IntegrationOptions): Promise<void>;
export declare function disableIntegration(env: IonicEnvironment, id: string): Promise<void>;
