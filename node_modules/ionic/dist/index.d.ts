import { RootPlugin } from '@ionic/cli-utils';
import { IonicNamespace } from './commands';
export declare const namespace: IonicNamespace;
export declare function generateRootPlugin(): Promise<RootPlugin>;
export declare function run(pargv: string[], env: {
    [k: string]: string;
}): Promise<void>;
