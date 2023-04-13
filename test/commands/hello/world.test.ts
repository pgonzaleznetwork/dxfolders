import { expect, test } from '@oclif/test';
import { HelloWorldResult } from '../../../src/commands/hello/world';

describe('hello world', () => {
  test
    .stdout()
    .command(['hello:world'])
    .it('runs hello world with no provided name', (ctx) => {
      expect(ctx.stdout).to.contain('Hello World');
    });

  test
    .stdout()
    .command(['hello:world', '--json'])
    .it('runs hello world with --json and no provided name', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: HelloWorldResult };
      expect(result.name).to.equal('World');
    });

  test
    .stdout()
    .command(['hello:world', '--name', 'Astro'])
    .it('runs hello world --name Astro', (ctx) => {
      expect(ctx.stdout).to.contain('Hello Astro');
    });

  test
    .stdout()
    .command(['hello:world', '--name', 'Astro', '--json'])
    .it('runs hello world --name Astro --json', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: HelloWorldResult };
      expect(result.name).to.equal('Astro');
    });
});
