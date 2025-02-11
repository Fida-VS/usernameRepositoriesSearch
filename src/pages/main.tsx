import { useCallback, useEffect, useRef, useState } from "react";
import { Content } from "../components/content/content";
import { useAppDispatch, useAppSelector } from "../hook";
import { fetchRepos } from "../store/repository-slice";
import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import { Loader } from "../components/loader/loader";

export const Main: React.FC = () => {
  const { loading, error, username } = useAppSelector(
    (state) => state.repositories
  );
  const dispatch = useAppDispatch();
  const loadingMore = useRef(false);
  const currentPage = useRef(1);
  const [hasMoreRepos, setHasMoreRepos] = useState(true);

  useEffect(() => {
    setHasMoreRepos(true); // Сбрасываем hasMoreRepos при смене username
    currentPage.current = 1; // Сбрасываем номер страницы
  }, [username]);

  const loadMoreRepos = useCallback(() => {
    if (!loadingMore.current && !loading && hasMoreRepos) {
      loadingMore.current = true;
      dispatch(fetchRepos({ username, page: currentPage.current }))
        .then((response) => {
          if (response && response.payload) {
            if (response.payload.length === 0) {
              setHasMoreRepos(false);
            } else {
              currentPage.current += 1;
            }
          }
        })
        .catch((error) => {
          console.error("Ошибка при загрузке репозиториев:", error);
        })
        .finally(() => {
          loadingMore.current = false;
        });
    }
  }, [dispatch, username, loading, hasMoreRepos]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200
    ) {
      loadMoreRepos();
    }
  }, [loadMoreRepos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <Container sx={{ paddingTop: "3%" }} className="main">
      {loading && <Loader />}
      {error && (
        <Stack sx={{ width: "100%", marginBottom: "2rem" }} spacing={1}>
          <Alert severity="error">{error}</Alert>
        </Stack>
      )}
      {!username && !loading && (
        <Typography variant="h4" align="center" sx={{ margin: "20px 0" }}>
          Добро пожаловать!
        </Typography>
      )}
      <Box sx={{ minHeight: "calc(100vh - 200px)" }} className="content">
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Content />
        </Container>
        {loadingMore.current && hasMoreRepos && <Loader />}
      </Box>
    </Container>
  );
};
