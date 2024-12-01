import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { DayPicker } from "react-day-picker";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { CircleCheckBig } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { fetchProjects, fetchTasks } from "@/redux/taskSlice";
import { jwtDecode } from "jwt-decode";
import { Skeleton } from "../ui/skeleton";
import { Toaster } from "../ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@/utils/spinner";
import Navbar from "../custom/navbar";
import "react-day-picker/dist/style.css";

interface MyToken {
    sub: string,
    role: string,
    iat: number,
    exp: number,
    employeeId: number
}

const formSchema = z.object({
    title: z.string().min(2).max(25),
    description: z.string().min(5).max(50),
    project: z.string().nonempty("Please select a project"),
    date: z.date(),
    duration: z.string().refine(time => {
            const [hoursStr, minutesStr] = time.split(':');
            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);
            return hours * 60 + minutes;
        },
        { message: "Duration must be greater than 0 minutes" }
    ),
    markedForAppraisal: z.boolean()
});

export default function AddTask() {

    const { toast } = useToast();
    const dispatch: AppDispatch = useDispatch();
    const projects = useSelector((state: RootState) => state.task.projects);
    const loading = useSelector((state: RootState) => state.task.loading);
    const token = localStorage.getItem("jwt");
    const user = jwtDecode<MyToken>(token ? token : "");
    const [spinner, setSpinner] = useState(false);
    const navigate = useNavigate();
    const [searchParam] = useSearchParams();
    const taskId = searchParam.get("taskId");

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [projectId, setProjectId] = useState<number>();
    const [projectName, setProjectName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [duration, setDuration] = useState<number>();
    const [appraisalStatus, setAppraisalStatus] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchProjects(user.employeeId));
        dispatch(fetchTasks(user.employeeId));
    }, [taskId]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            project: "",
            date: new Date(),
            duration: "00:00",
            markedForAppraisal: false
        },
    });

    function convertHHMMToMinutes(time: string): number {
        const [hoursStr, minutesStr] = time.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        return hours * 60 + minutes;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const taskDto = {
            title: values.title,
            description: values.description,
            date: values.date,
            duration: convertHHMMToMinutes(values.duration),
            projectId: Number(values.project.split(':')[0]),
            projectName: values.project.split(':')[1],
            appraisalStatus: values.markedForAppraisal ? "APPLIED_FOR_APPRAISAL" : "DID_NOT_APPLY",
            numberOfRatings: 0,
            ratings: 0.0
        }
        console.log(taskDto);

        try {
            setSpinner(true);
            await fetchWithAuth(`http://localhost:8080/api/v1/tasks/${ user.employeeId }`, {
                method: "POST",
                body: JSON.stringify(taskDto)
            });
            toast({
                title: "Task added"
            });
        }
        catch(error) {
            console.log(error);
            toast({
                title: "Something went wrong",
                variant: "destructive"
            });
        }
        finally {
            setSpinner(false);
            navigate("/tasks");
        }
    }
    
    return (
        <div>
            <Navbar />
            <Toaster />
            {
                loading ? (
                    <div className="px-2 py-2 sm:px-20 sm:py-10">
                        <p className="text-2xl font-bold mb-5">Add Task</p>
                        <div className="grid grid-cols-[2fr,1fr] gap-8">
                            <div className="flex flex-col gap-4">
                                <Skeleton className="h-8 rounded-md" />
                                <Skeleton className="h-8 rounded-md" />
                                <Skeleton className="h-8 rounded-md" />
                                <Skeleton className="h-8 rounded-md" />
                            </div>
                            <Skeleton className="h-[125px]" />
                        </div>
                    </div>
                ) : (
                    <div className="px-2 py-2 sm:px-20 sm:py-10">
                        <p className="text-2xl font-bold mb-5">Add Task</p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <div className="grid grid-cols-[2fr,1fr]">
                                    <div className="flex flex-col gap-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={ 5 } className="resize-none" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-between items-center">
                                            <FormField
                                                control={form.control}
                                                name="duration"
                                                render={({ field }) => (
                                                    <div className="flex flex-col">
                                                        <FormItem>
                                                            <FormLabel>Duration</FormLabel>
                                                            <FormControl>
                                                                <Input type="time" { ...field } className="w-auto" />
                                                            </FormControl>
                                                        </FormItem>
                                                        <FormMessage />
                                                    </div>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="project"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Project</FormLabel>
                                                        <FormControl>
                                                            <Select value={ field.value } onValueChange={ value => field.onChange(value) }>
                                                                <SelectTrigger className="w-[180px]">
                                                                    <SelectValue placeholder="Select a project" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Projects</SelectLabel>
                                                                        {
                                                                            projects && projects.map(project => {
                                                                                return (
                                                                                    <SelectItem key={ project.id } value={ `${ project.id }:${ project.name }` }>{ project.name }</SelectItem>
                                                                                );
                                                                            })
                                                                        }
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>

                                    </div>

                                    <div className="flex flex-col items-end gap-4">
                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <DayPicker mode="single" selected={ field.value } onSelect={ date => field.onChange(date) } defaultMonth={ field.value } disabled={ { after: new Date() } } />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>

                                    <div className="flex flex-col items-start gap-8 mt-8">
                                        <FormField
                                            control={form.control}
                                            name="markedForAppraisal"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex justify-start items-center gap-2">
                                                        <FormControl>
                                                            <Checkbox checked={ field.value } onCheckedChange={ checked => field.onChange(checked) } />
                                                        </FormControl>
                                                        <FormLabel>Mark for Appraisal</FormLabel>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <Button type="submit" disabled={ spinner }>{ spinner ? <LoadingSpinner /> : <div className="flex items-center gap-2"><CircleCheckBig /><span>Add Task</span></div> }</Button>
                                    </div>
                                </div>
                                
                            </form>
                        </Form>
                    </div>
                )
            }
            
        </div>
    );
}