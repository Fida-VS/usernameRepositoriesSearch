import { useState, ChangeEvent, useEffect, useRef, useCallback } from "react";
import { useAppDispatch } from "../../hook";
import {
  addUserName,
  clearRepositories,
  fetchRepos,
} from "../../store/repository-slice";
import { AppBar, Container, Toolbar } from "@mui/material";
import { debounce } from "../../utils/debounce";

export const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useAppDispatch();
  const abortControllerRef = useRef(new AbortController());

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const fetchData = useCallback(
    (value: string) => {
      // Прерываем предыдущий запрос
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (value) {
        dispatch(clearRepositories()); // Очищаем репозитории перед новым поиском
        dispatch(addUserName(value));
        dispatch(fetchRepos({ username: value, page: 1, signal })); 
      }
    },
    [dispatch]
  );

  const debouncedFetchData = useRef(
    debounce((value: string) => fetchData(value), 500)
  ).current;

  useEffect(() => {
    debouncedFetchData(searchValue);

    return () => {
      // Прерываем запрос при размонтировании компонента
      abortControllerRef.current.abort();
    };
  }, [searchValue, debouncedFetchData]);

  return (
    <AppBar sx={{ backgroundColor: "#005b8f" }} position="static">
      <Toolbar>
        <Container
          sx={{
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <input
            className="searchInput"
            placeholder="Введите имя пользователя GitHub"
            value={searchValue}
            onChange={onChangeHandler}
            style={{ width: "100%", maxWidth: "500px" }} 
          />
        </Container>
      </Toolbar>
    </AppBar>
  );
};
