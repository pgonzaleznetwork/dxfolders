import { expect, test } from '@oclif/test';

describe('connect org', () => {
  test
    .stdout()
    .command(['connect org'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world');
    });

  test
    .stdout()
    .command(['connect org', '--name', 'Astro'])
    .it('runs hello --name Astro', (ctx) => {
      expect(ctx.stdout).to.contain('hello Astro');
    });
});
