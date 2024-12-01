import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchEmployeesUnderManager = createAsyncThunk("fetchEmployeesUnderManager", async (managerId: number) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/v1/employees/managers/${ managerId }`);
    const data = await response.json();
    return data;
});

export const fetchProjectByManagerId = createAsyncThunk("fetchProjectByManagerId", async (managerId: number) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/v1/projects/managers/${ managerId }`);
    const data = await response.json();
    return data;
});

export const fetchSkillsRatingsByManager = createAsyncThunk("fetchSkillsRatingsByManager", async ({ managerId, employeeId }: { managerId: number; employeeId: number }) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/v1/skills/ratings/employee/${ employeeId }/manager/${ managerId }`);
    const data = await response.json();
    return data;
});

interface ManagerState {
    loading: boolean,
    error: boolean,
    employeesUnderManager: Employee[],
    projectUnderManager: Project | null,
    skillsRatedByManager: Skill[]
}

interface Project {
    id: number,
    name: string
}

interface Employee {
    id: number,
    name: string,
    username: string,
    designation: {
        id: number,
        name: string,
        skills: [{
            id: number,
            name: string,
            category: string
        }]
    },
    dob: string,
    gender: string,
    doj: string,
    ratings: number,
    location: string
}

interface Skill {
    skillId: number,
    ratings: number,
    employeeId: number
}

const initialState: ManagerState = {
    loading: false,
    error: false,
    employeesUnderManager: [],
    projectUnderManager: null,
    skillsRatedByManager: []
}

export const managerSlice = createSlice({
    name: "manager",
    initialState,
    reducers: {
        updateSkillRating: (state, action: PayloadAction<{ skillId: number; ratings: number; employeeId: number }>) => {
            const { employeeId, skillId, ratings } = action.payload;
        
        // Find the skill for this employee in the state
            const skillIndex = state.skillsRatedByManager.findIndex((s) => s.employeeId === employeeId && s.skillId === skillId);

            // If the skill exists, update it
            if (skillIndex !== -1) {
                state.skillsRatedByManager[skillIndex].ratings = ratings;
            } else {
                // If the skill doesn't exist, add a new skill rating for the employee
                state.skillsRatedByManager.push({ employeeId, skillId, ratings });
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchEmployeesUnderManager.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchEmployeesUnderManager.fulfilled, (state, action: PayloadAction<Employee[]>) => {
            state.loading = false;
            state.error = false;
            state.employeesUnderManager = action.payload;
        });
        builder.addCase(fetchEmployeesUnderManager.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });

        builder.addCase(fetchProjectByManagerId.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchProjectByManagerId.fulfilled, (state, action: PayloadAction<Project>) => {
            state.loading = false;
            state.error = false;
            state.projectUnderManager = action.payload;
        });
        builder.addCase(fetchProjectByManagerId.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });

        builder.addCase(fetchSkillsRatingsByManager.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchSkillsRatingsByManager.fulfilled, (state, action) => {
            state.loading = false;
            state.error = false;
            state.skillsRatedByManager = action.payload;
        });
        builder.addCase(fetchSkillsRatingsByManager.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });
    }
});

export const { updateSkillRating } = managerSlice.actions;
export default managerSlice.reducer;