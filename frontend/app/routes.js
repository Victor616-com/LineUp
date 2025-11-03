import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    index("routes/SignIn.jsx"),
    route("home", "routes/home.jsx"),
    route("signup", "routes/SignUp.jsx"),
    route("profile/:id", "routes/ProfileView.jsx"),
    route("profile/:id/edit", "routes/EditProfileView.jsx"),
  ]),
];
