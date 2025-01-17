import { cli } from "cleye";

import { downloadFile, downloadVideo } from ".";

const downloadOptions = ["yes", "no"] as const;

type Downloads = (typeof downloadOptions)[number];

// Custom type function
function downloadSchema(download: Downloads) {
  if (!downloadOptions.includes(download)) {
    throw new Error(`Invalid download option: "${download}"`);
  }

  return download;
}

// Parse argv
const argv = cli({
  name: "twt-dl-cli",

  // Define parameters
  parameters: [
    "<twitter url>", // Twitter URL is required
  ],

  // Define flags/options
  flags: {
    // Parses `--download` as a string
    download: {
      type: downloadSchema,
      description: "Allow to download video (yes/no)",
      default: "yes",
    },
    // Parses `--output` as a string
    output: {
      type: String,
      description: "Specify the output path",
    },
  },
});

async function main() {
  const video = await downloadVideo(argv._?.twitterUrl);
  console.log(video);
  if (argv.flags.download === "yes" && video) {
    await downloadFile(video, argv.flags.output);
  }
}

main().catch(console.error);
