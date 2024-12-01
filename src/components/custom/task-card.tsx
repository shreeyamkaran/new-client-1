import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import { ShieldCheck, CalendarDays, Clock, Trash2 } from 'lucide-react';
import { Button } from "../ui/button";
import TaskModal from "./task-modal";
import { useState } from "react";

interface TaskCardProps {
    value: string,
    task: {
        appraisalStatus: string;
        date: string;
        description: string;
        duration: number;
        id: number;
        title: string;
        projectId: number;
        projectName: string;
    },
    projects: {
        id: number,
        name: string
    }[]
}

export default function TaskCard({ value, task, projects }: TaskCardProps) {
    const formatdate = (taskDate: string) => {
        const date = new Date(taskDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        return formattedDate;
    }

    const [projectId, setProjectId] = useState<number>(task.projectId);
    const [projectName, setProjectName] = useState<string>(task.projectName);
    const [title, setTitle] = useState<string>(task.title);
    const [date, setDate] = useState<string>(task.date);
    const [duration, setDuration] = useState<number>(task.duration);
    const [description, setDescription] = useState<string>(task.description);
    const [appraisalStatus, setAppraisalStatus] = useState<string>(task.appraisalStatus);

    const getColor = () => {
        switch(appraisalStatus) {
            case "DID_NOT_APPLY": return "light:text-black dark:text-white";
            default: return "text-yellow-400";
        }
    }
    return (
        <AccordionItem value={ value }>
            <AccordionTrigger>
                <div className="grid grid-cols-3 px-2 sm:px-20 items-center w-full">
                    <div className="flex gap-4 justify-start">
                        <ShieldCheck className={ `${ getColor() }` } />
                        <Badge>{ projectName }</Badge>
                    </div>
                    <p className="text-lg flex justify-center">{ title }</p>
                    <div className="flex flex-col gap-1 items-end">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={ 16 } />
                            <p>{ formatdate(date) }</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={ 16 } />
                            <p>{ duration } minutes</p>
                        </div>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="px-2 sm:px-20 flex flex-col gap-4">
                    <p>{ description }</p>
                    <div className="flex gap-2">
                        <TaskModal 
                            projects={ projects }
                            task={ task } heading="Edit Task"
                            title={ title } setTitle={ setTitle }
                            description={ description } setDescription={ setDescription }
                            projectId={ projectId } setProjectId={ setProjectId }
                            projectName={ projectName } setProjectName={ setProjectName }
                            date={ date } setDate={ setDate }
                            duration={ duration } setDuration={ setDuration }
                            appraisalStatus={ appraisalStatus } setAppraisalStatus={ setAppraisalStatus }
                        />
                        <Button variant="destructive" size="sm"><Trash2 /> Delete Task</Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}