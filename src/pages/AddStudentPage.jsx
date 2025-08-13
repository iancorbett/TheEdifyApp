import React from "react";
import { Navbar } from "../components/Navbar";
import { AddStudentForm } from "../components/AddStudentForm";
import { BackButton } from "../components/BackButton";

export const AddStudentPage = () => {
    return (
        <section>
            <Navbar />
            <BackButton />
            <div>
                <AddStudentForm />
            </div>
        </section>
    )
}