import { useEffect } from "react";
import Navbar from "../custom/navbar";
import TaskCard from "../custom/task-card";
import { Accordion } from "../ui/accordion";
import { fetchProjects, fetchTasks } from "@/redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { Plus } from 'lucide-react';
import { Toaster } from "../ui/toaster";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

interface MyToken {
    sub: string,
    role: string,
    iat: number,
    exp: number,
    employeeId: number
}

export default function Tasks() {
    const tasks = useSelector((state: RootState) => state.task.tasks);
    const projects = useSelector((state: RootState) => state.task.projects);
    let loading = useSelector((state: RootState) => state.task.loading);
    const dispatch: AppDispatch = useDispatch();
    const token = localStorage.getItem("jwt");
    const user = jwtDecode<MyToken>(token ? token : "");

    useEffect(() => {
        dispatch(fetchTasks(user.employeeId));
        dispatch(fetchProjects(user.employeeId));
    }, []);

    return (
        <div>
            <Toaster />
            <Navbar />
            <div className="px-2 py-2 sm:px-20 sm:py-10">
                <p className="text-2xl font-bold mb-5">Tasks</p>
                {
                    loading ? (
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                        </div>
                    ) : (
                        <Accordion type="multiple" className="w-full">
                            {
                                tasks.length == 0 ? (
                                    <div>No tasks availaible</div>
                                ) : (
                                    tasks?.map((task, index) => (
                                        <TaskCard key={ task.id } value={ `value-${ index + 1 }` } task={ task } projects={ projects } />
                                    ))
                                )
                                
                            }
                        </Accordion>
                    )
                }
                {
                    loading == false &&
                    <Link to="/tasks/add"><Button className="fixed bottom-10 right-10 rounded-md" size="sm"><Plus />Add Task</Button></Link>
                }
            </div>
        </div>
    );
}
