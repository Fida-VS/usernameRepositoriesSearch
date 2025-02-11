import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type Data = Repository[];


type Repository = {
  id: number;  
  name: string;  
  description: string | null;  
  html_url: string;  
  stargazers_count: number;  
  updated_at: string;
}


type fetchReposProps = {
    username: string;
    page?: number;
}

type RepositoriesState = {
    repositories: Repository[];
    username: string;
    page: number;
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: RepositoriesState = {
    repositories: [],
    username: '',
    page: 1,
    totalCount: 0,
    loading: false,
    error: null,
}

export const fetchRepos = createAsyncThunk<Data, fetchReposProps, {rejectValue: string}>(
    'repositories/fetchRepos',
    async function ({username, page}, { rejectWithValue }) {


            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=20&page=${page}`,
                {
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/vnd.github+json'
                      },
                      method: 'GET',
                }
            );
            
            if (!response.ok) {  
                if (response.status === 404) {  
                    return rejectWithValue("User not found"); // Обрабатываем ошибку 404  
                }  
                return rejectWithValue("Network response was not ok"); // Обрабатываем другие ошибки  
              }  
        
            const data = await response.json();

            console.log(data)

            return data;
          
          } 
  
);



const repositorySlice = createSlice({
    name: "repositories",
    initialState,
    reducers: {
        addUserName(state, action: PayloadAction<string>){
            state.username = action.payload;
          },
        setCurrentPage(state, action: PayloadAction<number>){
        state.page = action.payload;
      }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchRepos.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchRepos.fulfilled, (state, action) => {
            state.repositories = action.payload;
            state.loading = false;
        })
        .addMatcher(isError, (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        })
    }
  });


  export const { addUserName, setCurrentPage } = repositorySlice.actions;
  
export default repositorySlice.reducer;

function isError (action: AnyAction){
    return action.type.endsWith('rejected');
}