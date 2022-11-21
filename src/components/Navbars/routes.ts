const routes: Route[] = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/login",
    name: "Login",
  },
  {
    path: "/register",
    name: "Register",
  },
];

type Route = {
  path: string;
  name: string;
};

export default routes;
