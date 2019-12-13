import React from 'react';
import Loadable from 'react-loadable';

/** 异步加载依赖 */
export function withLazyInjectProps<P = any>(provider: () => Promise<P>, loading: () => any) {
  return function<C>(Comp: C): C {
    return Loadable({
      loader: async () => {
        const di = await provider();
        const refFunc = (props, ref) => {
          const newProps = {
            ...di,
            ...props,
            ref,
          };

          return React.createElement(Comp as any, newProps);
        };
        const name = Comp.displayName || Comp.name;
        refFunc.displayName = `withLazyInjectProps(${name})`;
        const LazyComp = React.forwardRef<any, P>(refFunc);

        return LazyComp;
      },
      loading,
    }) as any;
  };
}
