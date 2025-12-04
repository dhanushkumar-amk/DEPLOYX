import { Schema, model, Types } from "mongoose";

const ProjectSchema = new Schema(
  {
    orgId: { type: Types.ObjectId, ref: "Organization", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    framework: { type: String, default: "node" },
    region: { type: String, default: "asia-south1" },

    environments: {
      production: {
        url: { type: String, default: null },
        vars: { type: Map, of: String, default: {} },
        secrets: { type: Map, of: String, default: {} }
      },
      development: {
        url: { type: String, default: null },
        vars: { type: Map, of: String, default: {} },
        secrets: { type: Map, of: String, default: {} }
      },
      preview: {
        url: { type: String, default: null },
        vars: { type: Map, of: String, default: {} },
        secrets: { type: Map, of: String, default: {} }
      }
    },

    buildConfig: {
      installCmd: { type: String, default: "npm install" },
      buildCmd: { type: String, default: "npm run build" },
      outputDir: { type: String, default: "dist" },
      runtime: { type: String, default: "node18" }
    },

    status: { type: String, enum: ["active", "archived", "deleted"], default: "active" }
  },
  { timestamps: true }
);

export const Project = model("Project", ProjectSchema);
