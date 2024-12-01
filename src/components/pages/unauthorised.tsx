import { jwtDecode } from "jwt-decode";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface MyToken {
    sub: string,
    role: string,
    iat: number,
    exp: number,
    employeeId: number
}

export default function Unauthorised() {
    const token = localStorage.getItem("jwt");
    const user = jwtDecode<MyToken>(token ? token : "");
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="flex flex-col items-center gap-4">
                <p className="text-9xl text-secondary">403</p>
                <p className="font-bold">You are not authorised to access this route</p>
                {
                    token && user.role == "ROLE_Admin" &&
                    <Link to="/admin"><Button>Back to admin panel</Button></Link>
                }
                {
                    token && user.role != "ROLE_Admin" &&
                    <Link to="/"><Button>Back to home page</Button></Link>
                }
            </div>
        </div>
    );
}