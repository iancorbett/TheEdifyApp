import React from "react";
import { Navbar } from "../components/Navbar";
import { ObservationForm } from "../components/ObservationForm";
import { BackButton } from "../components/BackButton";

export const FormPage = () => {
    return(
        <section>
            <Navbar />
            <BackButton />
            <div>
                <ObservationForm />
            </div>
        </section>
    )
}