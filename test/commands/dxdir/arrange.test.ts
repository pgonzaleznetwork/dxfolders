import { expect, test } from '@oclif/test';

describe('dxdir arrange', () => {
  test
    .stdout()
    .command(['dxdir arrange'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world');
    });

  test
    .stdout()
    .command(['dxdir arrange', '--name', 'Astro'])
    .it('runs hello --name Astro', (ctx) => {
      expect(ctx.stdout).to.contain('hello Astro');
    });
});
