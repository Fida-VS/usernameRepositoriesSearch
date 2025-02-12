import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

type Data = Repository[];

type Repository = {
  node_id: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
};

type fetchReposProps = {
  username: string;
  page: number;
  signal?: AbortSignal;
};

type RepositoriesState = {
  repositories: Repository[];
  username: string;
  page: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
  noMoreRepos: boolean;
};

const initialState: RepositoriesState = {
  repositories: [],
  username: "",
  page: 1,
  totalCount: 0,
  loading: false,
  error: null,
  noMoreRepos: false,
};

export const fetchRepos = createAsyncThunk<
  Data,
  fetchReposProps,
  { rejectValue: string }
>(
  "repositories/fetchRepos",
  async function ({ username, page, signal }, { rejectWithValue }) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=20&page=${page}`,
        {
          headers: {
            "content-type": "application/json",
            Accept: "application/vnd.github+json",
          },
          method: "GET",
          signal: signal,
        }
      );

      if (!response.ok) {
        if (signal?.aborted) {
          // Если запрос был отменен, возвращаем сообщение об ошибке
          return rejectWithValue("Request aborted");
        }
        if (response.status === 404) {
          return rejectWithValue("User not found"); // Обрабатываем ошибку 404
        }
        return rejectWithValue("Network response was not ok"); // Обрабатываем другие ошибки
      }

      const data = await response.json();


      return data;
    } catch (error: unknown) {
      if (signal?.aborted) {
        // Если запрос был отменен, возвращаем сообщение об ошибке
        return rejectWithValue("Request aborted");
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message); // Если это Error, возвращаем его сообщение
      } else {
        return rejectWithValue("Unknown error occurred"); // В противном случае, возвращаем общее сообщение об ошибке
      }
    }
  }
);

const repositorySlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    addUserName(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    clearRepositories(state) {
      state.repositories = [];
      state.page = 1;
      state.noMoreRepos = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepos.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length === 0) {
          state.noMoreRepos = true;
        } else {
          // Фильтруем дубликаты по node_id
          const newRepositories = action.payload.filter(
            (newRepo) =>
              !state.repositories.find(
                (existingRepo) => existingRepo.node_id === newRepo.node_id
              )
          );
          state.repositories = [...state.repositories, ...newRepositories];
          state.page += 1;
        }
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        if (action.payload !== "Request aborted") {
          state.error = action.payload; // Сохраняем ошибку, если это не отмененный запрос
        }
        state.loading = false; 
      });
  },
});

export const { addUserName, setCurrentPage, clearRepositories } =
  repositorySlice.actions;

export default repositorySlice.reducer;

function isError(action: AnyAction) {
  return action.type.endsWith("rejected");
}
