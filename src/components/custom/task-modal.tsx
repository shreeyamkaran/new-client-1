import { Pencil } from 'lucide-react';
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { DayPicker } from "react-day-picker";
import { Toaster } from "../ui/toaster";
import { useToast } from "@/hooks/use-toast";
import "../../../node_modules/react-day-picker/dist/style.css";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useNavigate } from "react-router-dom";

interface TaskModalProps {
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
    }[],
    heading: string,
    projectId: number,
    setProjectId: Dispatch<SetStateAction<number>>,
    projectName: string,
    setProjectName: Dispatch<SetStateAction<string>>,
    title: string,
    setTitle: Dispatch<SetStateAction<string>>,
    date: string,
    setDate: Dispatch<SetStateAction<string>>,
    duration: number,
    setDuration: Dispatch<SetStateAction<number>>,
    description: string,
    setDescription: Dispatch<SetStateAction<string>>,
    appraisalStatus: string,
    setAppraisalStatus: Dispatch<SetStateAction<string>>,
}

export default function TaskModal({ 
    task,
    heading,
    projects,
    projectId, 
    setProjectId, 
    projectName, 
    setProjectName ,
    title,
    setTitle,
    date,
    setDate,
    duration,
    setDuration,
    description,
    setDescription,
    appraisalStatus,
    setAppraisalStatus,
}: TaskModalProps) {
    const { toast } = useToast();
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(appraisalStatus != "DID_NOT_APPLY");
    const navigate = useNavigate();
    
    function convertMinutesToHHMM(totalMinutes: number): string {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    }

    function convertHHMMToMinutes(time: string): number {
        const [hoursStr, minutesStr] = time.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        return hours * 60 + minutes;
    }

    const handleEdit = async () => {
        setButtonClicked(true);
        if(checked) {
            if(appraisalStatus == "DID_NOT_APPLY") {
                setAppraisalStatus("APPLIED_FOR_APPRAISAL");
            }
        }
        else {
            setAppraisalStatus("DID_NOT_APPLY");
        }
        const taskDto = {
            id: task.id,
            title: title,
            description: description,
            date: date,
            duration: duration,
            appraisalStatus: checked ?  "APPLIED_FOR_APPRAISAL" : "DID_NOT_APPLY",
            projectId: projectId,
            projectName: projectName
        }
        const response = await fetchWithAuth(`http://localhost:8080/api/v1/tasks/${ task.id }`, {
            method: "PUT",
            body: JSON.stringify(taskDto)
        });

        if(response.ok) {
            toast({
                title: "Task Edit Successful"
            });
        }
        else {
            toast({
                title: "Something went wrong. Cannot edit task"
            });
        }
    }

    const handleCloseDialog = () => {
        if(buttonClicked == true) {
            setButtonClicked(false);
            return;
        }
        setTitle(task.title);
        setDescription(task.description);
        setDate(task.date);
        setDuration(task.duration);
        setProjectId(task.projectId);
        setProjectName(task.projectName);
        setChecked(task.appraisalStatus != "DID_NOT_APPLY");
    }

    return (
        <Fragment>
            <Toaster />
            <Dialog onOpenChange={ open => !open && handleCloseDialog() }>
                <DialogTrigger asChild>
                    <Button size="sm" onClick={ () => navigate(`/tasks/add?taskId=${ task.id }`) }><Pencil /> Edit Task</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[920px]">
                    <DialogHeader>
                        <DialogTitle>{ heading }</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 w-full">
                        <div className="flex flex-col justify-around">
                            <div>
                                <Label htmlFor="title-modal-textField">Title</Label>
                                <Input id="title-modal-textField" value={ title } onChange={ event => setTitle(event.target.value) } />
                            </div>
                            <div>
                                <Label htmlFor="description-modal-textArea">Description</Label>
                                <Textarea id="description-modal-textArea" className="resize-none" rows={ 5 } value={ description } onChange={ event => setDescription(event.target.value) } />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <Label htmlFor="duration-modal-timePicker">Duration (HH : MM)</Label>
                                    <input id="duration-modal-timePicker" className="block border border-input shadow-sm px-2 h-8 text-primary bg-transparent rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label="Time" type="time" value={ convertMinutesToHHMM(duration) } onChange={ event => setDuration(convertHHMMToMinutes(event.target.value)) } />
                                </div>
                                <div>
                                    <Label htmlFor="project-modal-dropdown">Project</Label>
                                    <select id="project-modal-dropdown" className="block border border-input shadow-sm px-2 h-8 text-primary bg-transparent rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={ projectId + ":" + projectName } onChange={ event => { setProjectId(Number(event.target.value.split(':')[0])); setProjectName(event.target.value.split(':')[1]) } }>
                                        <option value="">Choose a project</option>
                                        {
                                            projects && projects.map(project => {
                                                return <option key={ project.id } value={ `${ project.id }:${ project.name }` }>{ project.name }</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <DayPicker mode="single" selected={ new Date(date) } onSelect={ date => setDate(date) } defaultMonth={ new Date(date) } />
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="flex justify-between w-full">
                            <div className="flex items-center gap-1">
                                <Checkbox id="checkbox-modal" checked={ checked } onClick={ () => setChecked(!checked) } />
                                <Label htmlFor="checkbox-modal">Mark for Appraisal</Label>
                            </div>
                            <DialogClose>
                                <Button onClick={ handleEdit }>Save Changes</Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}