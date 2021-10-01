import { getMicroAppConfigManager } from '../src/node';

describe('test the micro application Config configuration library', () => {
  test('test getModuleFederationRemotes()', () => {
    const manager = getMicroAppConfigManager({
      name: 'my_app',
      url: 'www.base.com',
      remotes: [
        {
          name: 'app1',
          url: 'www.app1.com',
          sharedLibraries: [],
        },
        {
          name: 'app2',
          url: 'www.app2.com',
        },
      ],
      exposes: [],
    });

    expect(manager.getModuleFederationRemotes())
      .toStrictEqual({
        'app1': 'app1@www.app1.com',
        'app2': 'app2@www.app2.com',
      });
  });

  test('test getNormalModuleReplacementPluginCallBack()', () => {
    const manager = getMicroAppConfigManager({
      name: 'my_app',
      url: 'www.base.com',
      remotes: [
        {
          name: 'app1',
          url: 'www.app1.com',
          sharedLibraries: [
            'react',
          ],
        },
        {
          name: 'app2',
          url: 'www.app2.com',
          sharedLibraries: [
            'mobx',
            {
              name: 'global-store',
              type: 'module',
              path: 'src/global-store.ts',
            },
            {
              name: 'foo',
              type: 'package',
              path: 'node_modules/foo',
            },
          ],
        },
      ],
      exposes: [],
    });

    const cb = manager.getNormalModuleReplacementPluginCallBack();

    const runCb = (name: string) => {
      const item = {
        request: name,
      };
      cb(item);
      return item.request;
    };

    expect(runCb('react')).toStrictEqual('app1/react');
    expect(runCb('react-dom')).toStrictEqual('react-dom');
    expect(runCb('foo')).toStrictEqual('app2/foo');
  });
});
