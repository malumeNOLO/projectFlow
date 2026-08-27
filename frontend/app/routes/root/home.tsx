import React from 'react'
import type { Route } from "../../+types/root";
import {Button} from "@/components/ui/button";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ProFlow" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const home = () => {
  return (
    <div className="wifull h-screen flex items-center justify-center">
      <Link to="/sign-in">
        <Button className="bg-blue-500 text-white" >Login</Button>
      </Link> 
      <Link to="/sign-up">
        <Button className="bg-blue-500 text-white" >Sign Up</Button>
      </Link>

    </div>
  );
};

export default home;