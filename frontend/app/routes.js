import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    index("routes/SignUp.jsx"),
    route("home", "routes/home.jsx"),
    route("signin", "routes/SignIn.jsx"),
  ]),
];
