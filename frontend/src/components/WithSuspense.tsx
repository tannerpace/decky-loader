import { Focusable, SteamSpinner } from '@decky/ui';
import { FunctionComponent, ReactNode, Suspense, CSSProperties } from 'react';

interface WithSuspenseProps {
  children: ReactNode;
  route?: boolean;
}
const getFallbackStyles = (isRoute: boolean | undefined): CSSProperties => ({
  overflowY: 'scroll',
  backgroundColor: 'transparent',
  ...(isRoute && {
    marginTop: '40px',
    height: 'calc(100% - 40px)',
  }),
});

const WithSuspense: FunctionComponent<WithSuspenseProps> = ({ children, route }) => {
  return (
    <Suspense
      fallback={
        <Focusable
          // Enables focus ring for proper reset on load
          onActivate={() => {}}
          style={getFallbackStyles(route)}
        >
          <SteamSpinner background="transparent" />
        </Focusable>
      }
    >
      {children}
    </Suspense>
  );
};

export default WithSuspense;
