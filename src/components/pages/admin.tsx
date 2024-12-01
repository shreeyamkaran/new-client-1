import { CalendarDays, ClipboardCheck, Clock, Eye, ShieldCheck, Star, UserRound } from "lucide-react";
import Navbar from "../custom/navbar";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import AdminNavbar from "../custom/admin-navbar";

interface Employee {
    id: number;
    name: string;
    username: string;
    password: string;
    designation: {
        id: number;
        name: string;
        skills: {
            id: number;
            name: string;
            category: string;
        }[];
    };
    dob: string;
    gender: string;
    doj: string;
    location: string;
    tasks: {
        id: number;
        title: string;
        description: string;
        date: string;
        duration: number;
        appraisalStatus: string;
        ratings: number;
        numberOfRatings: number;
    }[];
    projects: {
        id: number;
        name: string;
    }[];
    ratings: number;
    numberOfRatings: number;
}

// Function to format the date into the desired format
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    return formattedDate;
};

export default function Admin() {
    const [activeId, setActiveId] = useState<number>(-1);
    const [activeView, setActiveView] = useState<string>("DETAILS");
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeLoader, setEmployeeLoader] = useState<boolean>(false);

    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                setEmployeeLoader(true);
                const response = await fetchWithAuth(`http://localhost:8080/api/v1/employees`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched Employees:", data);
                setEmployees(data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            } finally {
                setEmployeeLoader(false);
            }
        };
        fetchAllEmployees();
    }, []);

    const handleClick = (event: React.MouseEvent) => {
        const targetElement = event.target as HTMLElement;
        const targetElementId = targetElement.id;
        const employeeId = targetElementId.split("-")[0];
        setActiveId(Number(employeeId));
    };

    const handleUserDetails = () => {
        setActiveView("DETAILS");
    };

    const handleUserTasks = () => {
        setActiveView("TASKS");
    };

    const selectedEmployee = employees.find((e) => e.id === activeId);

    return (
        <div>
            <Navbar />
            {employeeLoader ? (
                <div>Loading...</div>
            ) : (
                <div
                    className={`px-2 py-2 sm:px-20 sm:py-10 ${activeId !== -1 && "grid grid-cols-[1fr,2fr] gap-8"}`}
                >
                    <div>
                        <p className="text-2xl font-bold">Admin Panel</p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/3">Id</TableHead>
                                    <TableHead className="w-1/3 text-center">Name</TableHead>
                                    <TableHead className="w-1/3 text-right">View more</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="font-bold">
                                {employees.length > 0 &&
                                    employees.map((e) => (
                                        <TableRow key={e.id}>
                                            <TableCell>{e.id}</TableCell>
                                            <TableCell className="text-center">{e.name}</TableCell>
                                            <TableCell className="flex justify-end">
                                                <Button
                                                    size="sm"
                                                    id={`${e.id}-activeId`}
                                                    onClick={(event) => handleClick(event)}
                                                >
                                                    <Eye />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>

                    {activeId !== -1 && selectedEmployee && (
                        <div>
                            <div className="flex justify-end gap-4">
                                <Button size="sm" onClick={handleUserDetails}>
                                    <UserRound /> Details
                                </Button>
                                <Button size="sm" onClick={handleUserTasks}>
                                    <ClipboardCheck /> Tasks
                                </Button>
                            </div>

                            {activeView === "DETAILS" && (
                                <div>
                                    <p className="font-bold">Employee Details</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-1/2">Attribute</TableHead>
                                                <TableHead className="w-1/2">Value</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="font-bold">
                                            <TableRow>
                                                <TableCell>Id</TableCell>
                                                <TableCell>{selectedEmployee.id}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>{selectedEmployee.name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Username</TableCell>
                                                <TableCell>{selectedEmployee.username}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Designation</TableCell>
                                                <TableCell>{selectedEmployee.designation.name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Date of Birth</TableCell>
                                                <TableCell>{formatDate(selectedEmployee.dob)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Gender</TableCell>
                                                <TableCell>{selectedEmployee.gender}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Date of Joining</TableCell>
                                                <TableCell>{formatDate(selectedEmployee.doj)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Office Location</TableCell>
                                                <TableCell>{selectedEmployee.location}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Overall Rating</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <p>{selectedEmployee.ratings.toFixed(1)}</p>
                                                        <Star size={16} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Projects</TableCell>
                                                <TableCell className="flex gap-2 flex-wrap">
                                                    {selectedEmployee.projects.map((project) => (
                                                        <Badge key={project.id}>{project.name}</Badge>
                                                    ))}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {activeView === "TASKS" && selectedEmployee.tasks.length > 0 && (
                                <div>
                                    <p className="font-bold">Employee Tasks</p>
                                    <Accordion type="multiple" className="w-full">
                                        {selectedEmployee.tasks.map((task) => (
                                            <AccordionItem key={task.id} value={`item-${task.id}`}>
                                                <AccordionTrigger>
                                                    <div className="flex justify-between w-full px-2 sm:px-10">
                                                        <div className="flex flex-col items-start gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <ShieldCheck />
                                                                <p className="text-lg">{task.title}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end justify-end gap-1 font-bold">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarDays size={16} />
                                                                <p>{formatDate(task.date)}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock size={16} />
                                                                <p>{task.duration} minutes</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="flex flex-col gap-4 px-2 sm:px-10">
                                                        {task.description}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
