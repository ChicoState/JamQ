import { IonicEnvironment, LiveReloadFunction } from '../definitions';
export declare const DEV_SERVER_PREFIX = "__ionic";
export declare function injectDevServerScript(content: string): string;
export declare function createLiveReloadServer(env: IonicEnvironment, {port, wwwDir}: {
    port: number;
    wwwDir: string;
}): Promise<LiveReloadFunction>;
export declare function injectLiveReloadScript(content: string, port: number): string;
