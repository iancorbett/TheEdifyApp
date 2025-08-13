import React from "react";

export const Footer = () => {
  return (
    <footer className=" text-black text-center py-12">
      <p className="text-sm">&copy; {new Date().getFullYear()} EdApp. All rights reserved.</p>
    </footer>
  );
};
