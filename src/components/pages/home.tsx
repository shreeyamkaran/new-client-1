import Navbar from "../custom/navbar"
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { fetchEmployeeDetails, fetchEmployeeProjects, fetchEmployeeSkillsAndRatings } from "@/redux/employeeSlice";
import { jwtDecode } from "jwt-decode";
import { Skeleton } from "../ui/skeleton";

interface MyToken {
    sub: string,
    role: string,
    iat: number,
    exp: number,
    employeeId: number
}

export default function Home() {
    const loading = useSelector((state: RootState) => state.employee.loading);
    const employee = useSelector((state: RootState) => state.employee.employeeDetails);
    const projects = useSelector((state: RootState) => state.employee.projects);
    const skillsAndRatings = useSelector((state: RootState) => state.employee.skillsAndRatings);
    const token = localStorage.getItem("jwt");
    const user = jwtDecode<MyToken>(token ? token : "");
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchEmployeeDetails(user.employeeId));
        dispatch(fetchEmployeeProjects(user.employeeId));
        dispatch(fetchEmployeeSkillsAndRatings(user.employeeId));
    }, []);

    const formatdate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        return formattedDate;
    }
    
    return (
        <div>
            <Navbar />
            {
                loading ? (
                    <div className="px-2 py-2 sm:px-20 sm:py-10">
                        <div className="grid grid-cols-[2fr,3fr] gap-12">
                            <div className="flex flex-col gap-4">
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <Skeleton className="h-4 w-1/3" />
                                <div className="flex flex-wrap gap-4">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4" />
                            </div>
                        </div>
                    </div>
                ) : (
                    employee && projects && skillsAndRatings &&
                    <div className="px-2 py-2 sm:px-20 sm:py-10">
                        <div className="grid grid-cols-[2fr,3fr] gap-12">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <p className="text-xl">Welcome, <span className="font-bold">{ employee.name }</span></p>
                                </div>
                                <div>
                                    <Label htmlFor="employeeId-textfield">Employee Id</Label>
                                    <div id="employeeId-textfield" className="border py-1 px-2 rounded-md font-bold">{ employee.id }</div>
                                </div>
                                <div>
                                    <Label htmlFor="username-textfield">Username</Label>
                                    <div id="username-textfield" className="border py-1 px-2 rounded-md font-bold">{ employee.username }</div>
                                </div>
                                <div>
                                    <Label htmlFor="designation-textfield">Designation</Label>
                                    <div id="designation-textfield" className="border py-1 px-2 rounded-md font-bold">{ employee.designation.name }</div>
                                </div>
                                <div>
                                    <Label htmlFor="dateOfBirth-textfield">Date of Birth</Label>
                                    <div id="dateOfBirth-textfield" className="border py-1 px-2 rounded-md font-bold">{ formatdate(employee.dob) }</div>
                                </div>
                                <div>
                                    <Label htmlFor="gender-textfield">Gender</Label>
                                    <div id="gender-textfield" className="border py-1 px-2 rounded-md font-bold">{ employee.gender }</div>
                                </div>
                                <div>
                                    <Label htmlFor="dateOfJoining-textfield">Date of Joining</Label>
                                    <div id="dateOfJoining-textfield" className="border py-1 px-2 rounded-md font-bold">{ formatdate(employee.doj) }</div>
                                </div>
                                <div>
                                    <Label htmlFor="officeLocation-textfield">Office Location</Label>
                                    <div id="officeLocation-textfield" className="border py-1 px-2 rounded-md font-bold">{ employee.location }</div>
                                </div>
                                <div>
                                    <Label htmlFor="ratings-textfield">Overall Rating</Label>
                                    <div id="ratings-textfield" className="border py-1 px-2 rounded-md font-bold">
                                        <div className="flex items-center gap-1">
                                            <p>{ parseFloat(employee.ratings.toFixed(1)) }</p>
                                            <Star size={ 16 } />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-4">
                                    <p className="font-bold">Projects</p>
                                    <div className="flex flex-wrap gap-4">
                                        {
                                            projects.map(project => {
                                                return <Badge key={ project.id }>{project.name}</Badge>
                                            })
                                        }
                                    </div>
                                </div>
                                <div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Skill</TableHead>
                                                <TableHead>Rating</TableHead>
                                                <TableHead>Category</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                skillsAndRatings.map((object, index) => {
                                                    return (
                                                        <TableRow key={ index } className="font-bold">
                                                            <TableCell>{ object.name }</TableCell>
                                                            <TableCell className="flex items-center gap-1">
                                                                <p>{ object.rating }</p>
                                                                <Star size={ 16 } />
                                                            </TableCell>
                                                            <TableCell>{ object.category }</TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}