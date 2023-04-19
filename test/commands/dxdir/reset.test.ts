import { expect, test } from '@oclif/test';

describe('dxdir reset', () => {
  test
    .stdout()
    .command(['dxdir reset'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world');
    });

  test
    .stdout()
    .command(['dxdir reset', '--name', 'Astro'])
    .it('runs hello --name Astro', (ctx) => {
      expect(ctx.stdout).to.contain('hello Astro');
    });
});
