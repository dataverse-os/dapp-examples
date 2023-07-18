export const config = {
  name: "dataverse_app_example", // app name should NOT contain "-"
  logo: "https://github.com/dataverse-os/core-connector/raw/main/logo.svg",
  website: ["https://dataverse-os.com"], // you can use localhost:(port) for testing
  defaultFolderName: "Main",
  description: "This is dataverse app example.",
  models: [
    {
      isPublicDomain: false, // default
      schemaName: "post.graphql",
      encryptable: ["text", "images", "videos"], // strings within the schema and within the array represent fields that may be encrypted, while fields within the schema but not within the array represent fields that will definitely not be encrypted
    },
    {
      isPublicDomain: true,
      schemaName: "profile.graphql",
      encryptable: [],
    },
  ],
  ceramicUrl: null, // leave null to use dataverse test Ceramic node. Set to {Your Ceramic node Url} for mainnet, should start with "https://".
};
