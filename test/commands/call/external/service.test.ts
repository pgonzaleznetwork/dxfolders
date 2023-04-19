import { expect, test } from '@oclif/test';

describe('call external service', () => {
  test
    .stdout()
    .command(['call external service'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world');
    });

  test
    .stdout()
    .command(['call external service', '--name', 'Astro'])
    .it('runs hello --name Astro', (ctx) => {
      expect(ctx.stdout).to.contain('hello Astro');
    });
});
