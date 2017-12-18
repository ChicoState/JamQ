import * as SSHConfigModule from 'ssh-config';
export declare const SSHConfig: typeof SSHConfigModule;
export declare function loadFromPath(p: string): Promise<SSHConfigModule.SSHConfig>;
export declare function isDirective(entry: any): entry is SSHConfigModule.ConfigDirective;
export declare function isHostDirective(entry: SSHConfigModule.Config): entry is SSHConfigModule.ConfigHostDirective;
export declare function getConfigPath(): string;
export declare function findHostSection(conf: SSHConfigModule.SSHConfig, host: string): SSHConfigModule.ConfigHostDirective | null;
export declare function ensureHostAndKeyPath(conf: SSHConfigModule.SSHConfig, conn: {
    host: string;
    port?: number;
}, keyPath: string): void;
