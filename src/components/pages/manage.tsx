import { CalendarDays, CircleCheckBig, Clock, Settings, ShieldCheck, Star } from "lucide-react";
import Navbar from "../custom/navbar";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Fragment, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchEmployeesUnderManager, fetchProjectByManagerId, fetchSkillsRatingsByManager, updateSkillRating } from "@/redux/managerSlice";
import { fetchTasks, setTaskRating } from "@/redux/taskSlice";
import { fetchEmployeeDetails, fetchEmployeeSkillsAndRatings } from "@/redux/employeeSlice";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/utils/spinner";
import { Toaster } from "../ui/toaster";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { jwtDecode } from "jwt-decode";

interface MyToken {
    sub: string,
    role: string,
    iat: number,
    exp: number,
    employeeId: number
}

export default function Manage() {
    const [activeId, setActiveId] = useState<string>("");
    const [activeView, setActiveView] = useState<string>("");
    const [taskRateLoader, setTaskRateLoader] = useState<boolean>(false);
    const [skillRateLoader, setSkillRateLoader] = useState<boolean>(false);
    const { toast } = useToast();
    const token = localStorage.getItem("jwt");
    const user = jwtDecode<MyToken>(token ? token : "");

    const dispatch: AppDispatch = useDispatch();
    const employeesUnderManager= useSelector((state: RootState) => state.manager.employeesUnderManager);
    const currentProject = useSelector((state: RootState) => state.manager.projectUnderManager);
    const loading = useSelector((state: RootState) => state.manager.loading);
    const tasks = useSelector((state: RootState) => state.task.tasks);
    const taskLoading = useSelector((state: RootState) => state.task.loading);
    const activeEmployee = useSelector((state: RootState) => state.employee.employeeDetails);
    const employeeLoading = useSelector((state: RootState) => state.employee.loading);
    const employeeSkillsAndRatings = useSelector((state: RootState) => state.employee.skillsAndRatings);
    const skillsRatedByManager = useSelector((state: RootState) => state.manager.skillsRatedByManager);

    useEffect(() => {
        dispatch(fetchProjectByManagerId(user.employeeId));
        dispatch(fetchEmployeesUnderManager(user.employeeId));
    }, []);

    useEffect(() => {
        dispatch(fetchTasks(Number(activeId)));
        dispatch(fetchEmployeeDetails(Number(activeId)));
        dispatch(fetchEmployeeSkillsAndRatings(Number(activeId)));
        dispatch(fetchSkillsRatingsByManager({ managerId: user.employeeId, employeeId: Number(activeId) }));
    }, [activeId]);

    const viewEmployeesDetails = (event: React.MouseEvent) => {
        const targetElement = event.target as HTMLElement;
        const targetElementId = targetElement.id;
        const employeeId = targetElementId.split('-')[0];
        setActiveId(targetElement.id);
        setActiveView("attributes");
        setActiveId(employeeId);
    }

    const viewEmployeesTasks = (event: React.MouseEvent) => {
        const targetElement = event.target as HTMLElement;
        const targetElementId = targetElement.id;
        const employeeId = targetElementId.split('-')[0];
        setActiveView("tasks");
        setActiveId(employeeId);
    }

    const formatdate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        return formattedDate;
    }

    const getColor = (appraisalStatus: string) => {
        switch(appraisalStatus) {
            case "DID_NOT_APPLY": return "text-primary";
            default: return "text-yellow-400";
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
        let newRating = Number(event.target.value);
        if(newRating > 5) {
            newRating = 5;
        } // Get the new rating value
        // Dispatch action to update the rating of the task in Redux store
        dispatch(setTaskRating({ taskId, newRating }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, skillId: number) => {
        let newRating = Number(event.target.value);
        if(newRating > 5) {
            newRating = 5;
        }
        dispatch(updateSkillRating({ skillId: skillId, ratings: newRating, employeeId: Number(activeId) }));
    }

    const handleClick = async (taskId: number) => {
        try {
            setTaskRateLoader(true);
            const task = tasks.find(task => task.id === taskId);
            if (!task) throw new Error("Task not found");
    
            const endpoint = task.numberOfRatings === 0 
                ? `rateTask/${ task.id }` 
                : `updateTaskRating/${ task.id }`;
    
            await fetchWithAuth(`http://localhost:8080/api/v1/tasks/${ endpoint }`, {
                method: "PUT",
                body: JSON.stringify({ rating: task.ratings })
            });

            toast({
                "title": "Task rating added"
            });
            
        } catch (error) {
            console.error(error);
            toast({
                "title": "Something went wrong",
                "variant": "destructive"
            });
        }
        finally {
            setTaskRateLoader(false);
        }
    }

    const submitSkillsRatings = async () => {
        try {
            setSkillRateLoader(true);

            const skillsObject = skillsRatedByManager.reduce((acc: Record<string, number>, skill) => {
                // Use `String` to convert `skillId` to a string key
                acc[String(skill.skillId)] = skill.ratings;
                return acc;
            }, {} as Record<string, number>); // Explicitly type the accumulator as Record<string, number>
    
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/skills/ratings/employee/${ activeId }/manager/${ user.employeeId }`, {
                method: "POST",
                body: JSON.stringify(skillsObject)
            });

            toast({
                title: "Skills rated successfully"
            });
        }
        catch(error) {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            });
        }
        finally {
            setSkillRateLoader(false);
        }
    }
    
    if(loading) {
        return (
            <Fragment>
                <Navbar />
                <div className="px-2 py-2 sm:px-20 sm:py-10">
                    <div className="flex flex-col gap-4">
                        <p className="text-2xl font-bold">Manage Employees</p>
                        {
                            !loading && <div className="mb-5 flex items-center gap-1">Working on project <Badge>{ currentProject?.name }</Badge></div>
                        }
                        <div>Loading...</div>
                    </div>
                </div>
            </Fragment>
        );
    }

    return (
        <div>
            <Navbar />
            <Toaster />
            <div className={ `px-2 py-2 sm:px-20 sm:py-10 ${ activeId && "grid grid-cols-[1fr,2fr] gap-8" }` }>
                <div>
                    <div className="flex flex-col gap-2">
                        <p className="text-2xl font-bold">Manage Employees</p>
                        <div className="mb-5 flex items-center gap-1">Working on project <Badge>{ currentProject?.name }</Badge></div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/3">Id</TableHead>
                                <TableHead className="w-1/3 text-center">Name</TableHead>
                                <TableHead className="w-1/3 text-right">Manage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="font-bold">
                            {
                                employeesUnderManager.map(object => {
                                    return (
                                        <TableRow key={ object.id }>
                                            <TableCell>{ object.id }</TableCell>
                                            <TableCell className="text-center">{ object.name }</TableCell>
                                            <TableCell className="flex justify-end">
                                                <Button size="sm" id={ `${ object.id }-tasks` } onClick={ event => viewEmployeesTasks(event) }><Settings /></Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
                {
                    activeId && activeEmployee &&
                    (taskLoading || employeeLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <Fragment>
                                <div className="flex flex-col gap-8">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold">Employee Details</p>
                                            <div className="flex gap-4">
                                                <Button size="sm" id={ `${ activeId }-details` } onClick={ event => viewEmployeesDetails(event) }><Star /></Button>
                                                <Button size="sm" id={ `${ activeId }-tasks` } onClick={ event => viewEmployeesTasks(event) }><Settings /></Button>
                                            </div>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-1/2">Attribute</TableHead>
                                                    <TableHead className="w-1/2">Details</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="font-bold">
                                                <TableRow>
                                                    <TableCell>Id</TableCell>
                                                    <TableCell>{ activeEmployee.id }</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>{ activeEmployee.name }</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Designation</TableCell>
                                                    <TableCell>{ activeEmployee.designation.name }</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Date of Joining</TableCell>
                                                    <TableCell>{ formatdate(activeEmployee.doj) }</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Overall Rating</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <p>{ parseFloat(activeEmployee.ratings.toFixed(1)) }</p>
                                                            <Star size={ 16 } />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {
                                        activeView == "attributes" ? (
                                            activeEmployee && employeeSkillsAndRatings &&
                                            <div>
                                                <p className="font-bold">Employee Skills</p>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Skill</TableHead>
                                                            <TableHead>Category</TableHead>
                                                            <TableHead>Avg Rating</TableHead>
                                                            <TableHead>Your Rating</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="font-bold">
                                                        {
                                                            employeeSkillsAndRatings.map((object, index) => {
                                                                return (
                                                                    <TableRow key={ index }>
                                                                        <TableCell>{ object.name }</TableCell>
                                                                        <TableCell>{ object.category }</TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-1">
                                                                                <p>{ object.rating.toFixed(1) }</p>
                                                                                <Star size={ 16 } />
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Input type="number" className="max-w-24" disabled={ skillRateLoader } value={ skillsRatedByManager?.filter(s => s.skillId == object.id)[0]?.ratings || 0 } onChange={ event => handleInputChange(event, object.id) } />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })
                                                        }
                                                        <TableRow>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell><Button className="w-full max-w-24" onClick={ submitSkillsRatings }>{ skillRateLoader? <LoadingSpinner /> : <CircleCheckBig /> }</Button></TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            tasks &&
                                            <div>
                                                <p className="font-bold">Employee Tasks</p>
                                                <div>
                                                    <Accordion type="multiple" className="w-full">
                                                        {
                                                            tasks.filter(task => task.projectId == currentProject?.id && task.appraisalStatus == "APPLIED_FOR_APPRAISAL")
                                                            .map((object, index) => {
                                                                return (
                                                                    <AccordionItem key={ index } value={ `item-${ index + 1 }` }>
                                                                        <AccordionTrigger>
                                                                            <div className="flex justify-between items-center w-full px-2 sm:px-10">
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="text-lg">{ object.title }</p>
                                                                                </div>
                                                                                <div className="flex flex-col gap-2">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <CalendarDays size={ 16 } />
                                                                                        <p>{ formatdate(object.date) }</p>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Clock size={ 16 } />
                                                                                        <p>{ object.duration } minutes</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </AccordionTrigger>
                                                                        <AccordionContent>
                                                                            <div className="flex flex-col gap-4 px-2 sm:px-10">
                                                                                <p>{ object.description }</p>
                                                                                <div className="flex gap-4 items-end">
                                                                                    <div>
                                                                                        <div className="flex">
                                                                                            <Input type="number" className="max-w-32 rounded-tr-none rounded-br-none" placeholder="Rate this task" disabled={ taskRateLoader } value={ object.ratings } onChange={ event => handleChange(event, object.id) } />
                                                                                            <Button className="rounded-tl-none rounded-bl-none" disabled={ taskRateLoader } onClick={ event => handleClick(object.id) }>{ taskRateLoader ? <LoadingSpinner /> : <CircleCheckBig />}</Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                );
                                                            })
                                                        }
                                                    </Accordion>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </Fragment>
                        )
                    )
                }
            </div>
        </div>
    );
}