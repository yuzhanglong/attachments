import * as path from "path";
import { MicroAppConfig } from "@mf-lite/core/lib/node/micro-fe-app-config";
import { sourcePath } from "@mf-lite/core/lib/common/paths";
import { I18nWebpackPlugin } from "../../lib";

const config: MicroAppConfig = {
  remotes: [],
  name: "my_app",
  url: "http://localhost:8080/",
  exposes: [
    "react",
    "react-dom",
    "react-router",
    "react-router-dom",
    "react-router-config",
    "react/jsx-dev-runtime",
    {
      name: "shared-utils",
      path: path.resolve(sourcePath, "utils", "shared-utils.ts"),
      type: "module"
    }
  ],
  webpackConfig: {
    devtool: "source-map",
    plugins: [
      // @ts-ignore
      // new I18nWebpackPlugin()
    ]
  }
};

export default config;
