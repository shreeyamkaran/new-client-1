import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchTasks = createAsyncThunk("fetchTasks", async (employeeId: number) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/v1/employees/${ employeeId }/tasks`);
    const tasks = await response.json();
    return tasks;
});

export const fetchProjects = createAsyncThunk("fetchProjects", async (employeeId: number) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/v1/employees/${ employeeId }/projects`);
    const projects = await response.json();
    return projects;
});

interface TaskState {
    loading: boolean,
    error: boolean,
    tasks: Task[],
    projects: Project[]
}

interface Task {
    id: number,
    title: string,
    description: string,
    date: string,
    duration: number,
    appraisalStatus: string,
    projectId: number,
    projectName: string,
    ratings: number,
    numberOfRatings: number
}

interface Project {
    id: number,
    name: string
}

const initialState: TaskState = {
    loading: false,
    error: false,
    tasks: [],
    projects: []
}

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        createTask: (state, action) => {
            const task = action.payload;
            state.tasks.push(task);
        },
        setTaskRating: (state, action: PayloadAction<{ taskId: number; newRating:number }>) => {
            const { taskId, newRating } = action.payload;
            const task = state.tasks.find((task) => task.id === taskId);
            if (task) {
              task.ratings = newRating; // Update the rating
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTasks.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
            state.loading = false;
            state.error = false;
            state.tasks = action.payload;
        });
        builder.addCase(fetchTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });

        builder.addCase(fetchProjects.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
            state.loading = false;
            state.error = false;
            state.projects = action.payload;
        });
        builder.addCase(fetchProjects.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });
    }
});

export const { createTask, setTaskRating } = taskSlice.actions;
export default taskSlice.reducer;