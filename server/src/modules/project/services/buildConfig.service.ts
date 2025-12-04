import { Project } from "../models/project.model";

class BuildConfigService {

  async updateInstallCmd(projectId: string, installCmd: string) {
    return Project.findByIdAndUpdate(
      projectId,
      { $set: { "buildConfig.installCmd": installCmd } },
      { new: true }
    );
  }

  async updateBuildCmd(projectId: string, buildCmd: string) {
    return Project.findByIdAndUpdate(
      projectId,
      { $set: { "buildConfig.buildCmd": buildCmd } },
      { new: true }
    );
  }

  async updateOutputDir(projectId: string, outputDir: string) {
    return Project.findByIdAndUpdate(
      projectId,
      { $set: { "buildConfig.outputDir": outputDir } },
      { new: true }
    );
  }

  async updateRuntime(projectId: string, runtime: string) {
    return Project.findByIdAndUpdate(
      projectId,
      { $set: { "buildConfig.runtime": runtime } },
      { new: true }
    );
  }

  async autoDetectFramework(projectId: string, pkg: any) {
    let framework: string = "node";
    let buildCmd = "npm run build";
    let outputDir = "dist";

    if (pkg.dependencies?.next) {
      framework = "nextjs";
      buildCmd = "next build";
      outputDir = ".next";
    }

    else if (pkg.dependencies?.vite) {
      framework = "react-vite";
      buildCmd = "vite build";
      outputDir = "dist";
    }

    return Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          framework,
          "buildConfig.buildCmd": buildCmd,
          "buildConfig.outputDir": outputDir
        }
      },
      { new: true }
    );
  }

  async updateCloudProviderConfig(projectId: string, cloud: any) {
    return Project.findByIdAndUpdate(
      projectId,
      { $set: { cloudProvider: cloud } },
      { new: true }
    );
  }
}

export const buildConfigService = new BuildConfigService();
