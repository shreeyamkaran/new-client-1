import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchEmployeeDetails = createAsyncThunk("fetchEmployeeDetails", async (employeeId: number) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/v1/employees/${ employeeId }`);
    const data = await response.json();
    return data;
});

export const fetchEmployeeProjects = createAsyncThunk("fetchEmployeeProjects", async (employeeId: number) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/v1/employees/${ employeeId }/projects`);
    const data = await response.json();
    return data;
});

export const fetchEmployeeSkillsAndRatings = createAsyncThunk("fetchEmployeeSkillsAndRatings", async (employeeId: number) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/v1/employees/skills/ratings/${ employeeId }`);
    const data = await response.json();
    const skillsAndRatings = data.map((item: [number, string, number, string]) => ({
        id: item[0],
        name: item[1],
        rating: item[2],
        category: item[3]
    }));
    return skillsAndRatings;
});

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
        }],
    },
    dob: string,
    gender: string,
    doj: string,
    ratings: number,
    location: string
}

interface Project {
    id: number,
    name: string
}

interface Skills {
    id: number;
    name: string;
    rating: number;
    category: string;
}

interface EmployeeState {
    loading: boolean,
    error: boolean,
    employeeDetails: Employee | null,
    projects: Project[],
    skillsAndRatings: Skills[]
}

const initialState: EmployeeState = {
    loading: false,
    error: false,
    employeeDetails: null,
    projects: [],
    skillsAndRatings: []
}

export const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchEmployeeDetails.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchEmployeeDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.error = false;
            state.employeeDetails = action.payload;
        });
        builder.addCase(fetchEmployeeDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });

        builder.addCase(fetchEmployeeProjects.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchEmployeeProjects.fulfilled, (state, action) => {
            state.loading = false;
            state.error = false;
            state.projects = action.payload;
        });
        builder.addCase(fetchEmployeeProjects.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });

        builder.addCase(fetchEmployeeSkillsAndRatings.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchEmployeeSkillsAndRatings.fulfilled, (state, action: PayloadAction<Skills[]>) => {
            state.loading = false;
            state.error = false;
            state.skillsAndRatings = action.payload;
        });
        builder.addCase(fetchEmployeeSkillsAndRatings.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });
    }
});

export default employeeSlice.reducer;