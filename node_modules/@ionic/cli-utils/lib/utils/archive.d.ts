import * as archiver from 'archiver';
import { IonicEnvironment } from '../../definitions';
export declare function createArchive(format: 'zip' | 'tar'): archiver.Archiver;
export declare function tarXvfFromUrl(env: IonicEnvironment, url: string, destination: string, {progress}: {
    progress?: (loaded: number, total: number) => void;
}): Promise<void>;
