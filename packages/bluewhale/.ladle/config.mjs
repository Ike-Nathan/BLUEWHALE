import type { UserConfig } from '@ladle/react';

export const config: UserConfig = {
  stories: 'src/stories/**/*.stories.{tsx,ts}',
  outDir: 'storybook-static',
  base: './',
};
