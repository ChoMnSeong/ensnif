declare module "shaka-player" {
  export = shaka;
}

declare module "../dist/server/entry-server.js" {
  export const entryServerRender: (url: string) => Promise<{
    html: string;
    head?: string;
  }>;
}
