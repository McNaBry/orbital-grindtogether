// Configuration file for running cypress testing.

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e",
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    specPattern: "cypress/components",
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
