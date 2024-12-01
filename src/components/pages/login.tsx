import { useTheme } from "@/utils/theme-provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        if(theme == "light") {
            setTheme("dark");
        }
        else {
            setTheme("light");
        }
    }

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const token = await response.text();
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            
            localStorage.setItem("jwt", token);
            navigate("/");
            
        }
        catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="relative flex min-h-screen justify-center items-center">
            <Button className="absolute top-4 right-8" variant="outline" size="icon" onClick={ toggleTheme }>
                {
                    theme == "dark" ? (
                        <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    )
                }
            </Button>
            <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">
                    <p>Login to your account</p>
                </div>
                <div className="w-full max-w-96 flex flex-col gap-2">
                    <Input type="text" placeholder="Username" value={ username } onChange={ event => setUsername(event.target.value) } />
                    <Input type="password" placeholder="Password" value={ password } onChange={ event => setPassword(event.target.value) } />
                </div>
                <div className="w-full text-center">
                    <Button className="w-1/2" onClick={ handleLogin }>Login</Button>
                </div>
            </div>
        </div>
    );
}