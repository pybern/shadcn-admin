import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['src/components/ui/**'],
  ignoreDependencies: ["tailwindcss", "tw-animate-css", "@tailwindcss/postcss"]
};

export default config;
