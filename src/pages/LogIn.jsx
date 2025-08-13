import React from "react";
import { LogInForm } from "../components/LogInForm";
import { Navbar } from "../components/Navbar";
import { BackButton } from "../components/BackButton";

export const LogIn = () => {
    return (
        <section>
            <Navbar />
            <BackButton />
            <div>
                <LogInForm />
            </div>
        </section>
    )
}