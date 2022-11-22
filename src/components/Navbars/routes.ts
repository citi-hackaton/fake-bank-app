const routes: Route[] = [
  {
    path: "/",
    name: "Home",
    visibleWhenLoggedIn: true,
    visibleWhenLoggedOut: true,
  },
  {
    path: "/login",
    name: "Login",
    visibleWhenLoggedIn: false,
    visibleWhenLoggedOut: true,
  },
  {
    path: "/logout",
    name: "Logout",
    visibleWhenLoggedIn: true,
    visibleWhenLoggedOut: false,
  },
  {
    path: "/register",
    name: "Register",
    visibleWhenLoggedIn: false,
    visibleWhenLoggedOut: true,
  },
];

type Route = {
  path: string;
  name: string;
  visibleWhenLoggedIn?: boolean;
  visibleWhenLoggedOut?: boolean;
};

export default routes;
