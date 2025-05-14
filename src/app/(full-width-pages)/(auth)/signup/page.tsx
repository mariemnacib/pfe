import SignUpForm from "components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " SignUp Page | Keepass",
  description: "This is  SignUp Page Keepass",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
