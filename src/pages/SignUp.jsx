import React from "react";
import { SignUpForm } from "../components/SignUpForm";
import { Navbar } from "../components/Navbar";
import { BackButton } from "../components/BackButton";

export const SignUp = () => {
    return (
        <section>
            <Navbar />
            <BackButton />
            <div>
                <SignUpForm />
            </div>
        </section>
    )
}