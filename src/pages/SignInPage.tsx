import { SignInForm } from "../components/auth/SignInForm";

export const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <SignInForm 
        logoSrc="/images/c1b7ec54-20bb-40a1-8179-95645b90b10f.jpg"
        illustrationSrc="/images/d94bd4e7-05eb-45c4-9d27-ad64d4070919.png"
      />
    </div>  
  );
};
