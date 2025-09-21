import { FunctionComponent } from 'react';
import { Navigate } from 'react-router-dom';

/** A higher-order component with conditional routing logic */
export function withCondition(
  Component: FunctionComponent,
  condition: boolean,
  redirectTo: string
) {
  return function InnerComponent(props: any) {
    return condition ? (
      <Component {...props} />
    ) : (
      <Navigate to={redirectTo} replace />
    );
  };
}

/** Example of a more specific variation */
//   export const withLoggedIn = (Component: React.FunctionComponent) =>
//     withCondition(Component, useContext(UserContext).loggedIn, '/home')
