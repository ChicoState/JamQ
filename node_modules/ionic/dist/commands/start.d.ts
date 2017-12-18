import { CommandLineInputs, CommandLineOptions, CommandPreRun, StarterManifest, StarterTemplate } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
export declare class StartCommand extends Command implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    isGitSetup(): Promise<boolean>;
    ensureDirectory(projectName: string, projectDir: string): Promise<void>;
    findStarterTemplate(template: string, type: string): Promise<StarterTemplate>;
    validateName(name: string): Promise<void>;
    loadManifest(manifestPath: string): Promise<StarterManifest | undefined>;
    performManifestOps(manifest: StarterManifest): Promise<void>;
    personalizeApp(projectDir: string, name: string, displayName: string): Promise<void>;
    personalizeCordovaApp(projectDir: string, name: string, bundleId?: string): Promise<void>;
    downloadStarterTemplate(projectDir: string, starterTemplate: StarterTemplate): Promise<void>;
    showNextSteps(projectDir: string, linkConfirmed: boolean): Promise<void>;
}
