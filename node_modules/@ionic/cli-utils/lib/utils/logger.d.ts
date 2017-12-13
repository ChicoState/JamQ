/// <reference types="node" />
import { Chalk } from 'chalk';
import { ILogger, LogLevel, LogMsg, LogPrefix, LoggerOptions } from '../../definitions';
export declare const LOGGER_STATUS_COLORS: Map<LogLevel, Chalk>;
export declare class Logger implements ILogger {
    firstLineColored: LogLevel[];
    readonly level: LogLevel;
    readonly prefix: LogPrefix;
    stream: NodeJS.WritableStream;
    constructor({level, prefix, stream}: LoggerOptions);
    debug(msg: LogMsg): void;
    info(msg: LogMsg): void;
    ok(msg: LogMsg): void;
    warn(msg: LogMsg): void;
    error(msg: LogMsg): void;
    announce(msg: LogMsg): void;
    msg(msg: LogMsg): void;
    log(msg: LogMsg): void;
    nl(num?: number): void;
    shouldLog(level: LogLevel): boolean;
    private enforceLF(str);
    private getStatusColor(level);
    private _log(level, msg);
}
