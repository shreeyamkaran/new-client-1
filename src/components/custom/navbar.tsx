import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useTheme } from "@/utils/theme-provider";
import { Moon, Sun, Settings, Bell, ClipboardCheck, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const toggleTheme = () => {
        if(theme == "light") {
            setTheme("dark");
        }
        else {
            setTheme("light");
        }
    }

    return (
        <div className="sticky z-10 top-0 backdrop-blur-lg flex justify-between items-center px-4 sm:px-20 py-2">
            <Link to="/" className="text-xl sm:text-4xl">
                brand name
            </Link>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={ () => navigate("/tasks") }><ClipboardCheck /></Button>
                <Button variant="outline" size="sm" onClick={ () => navigate("/manage") }><Settings /></Button>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm"><Bell /></Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Notification Panel</SheetTitle>
                            <SheetDescription>
                                No new notifications.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                <Button variant="outline" size="sm" onClick={ toggleTheme }>
                    {
                        theme == "dark" ? (
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        ) : (
                            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        )
                    }
                </Button>
                <Button variant="secondary" size="sm" onClick={ () => navigate("/manage") }><LogOut /></Button>
            </div>
        </div>
    );
}