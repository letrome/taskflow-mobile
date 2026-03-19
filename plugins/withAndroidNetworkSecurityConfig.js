const {
  withAndroidManifest,
  withDangerousMod,
} = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const withCustomNetworkSecurityConfig = (config) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    mainApplication.$["android:networkSecurityConfig"] =
      "@xml/network_security_config";
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const resPath = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
      );
      const xmlDir = path.join(resPath, "xml");

      if (!fs.existsSync(xmlDir)) {
        fs.mkdirSync(xmlDir, { recursive: true });
      }

      const filePath = path.join(xmlDir, "network_security_config.xml");
      const content = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>`;

      fs.writeFileSync(filePath, content);
      return config;
    },
  ]);

  return config;
};

module.exports = withCustomNetworkSecurityConfig;
