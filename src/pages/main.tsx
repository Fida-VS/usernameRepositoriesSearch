import { useCallback, useEffect, useRef, useState } from "react";
import { Content } from "../components/content/content";
import { useAppDispatch, useAppSelector } from "../hook";
import { fetchRepos } from "../store/repository-slice";
import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import { Loader } from "../components/loader/loader";
import { debounce } from "../utils/debounce";





export const Main: React.FC = () => {  
    const { loading, error, username } = useAppSelector(state => state.repositories);  
    const dispatch = useAppDispatch();  
    const currentPage = useRef(1); // Используем ref для отслеживания текущей страницы  
    const loadingMore = useRef(false); // Указывает, загружаем ли мы больше данных 
    const [hasMoreRepos, setHasMoreRepos] = useState(true); 
    const [searchPerformed, setSearchPerformed] = useState(false);
  
    const loadMoreRepos = useCallback(() => {  
      if (!loadingMore.current && !loading && hasMoreRepos) {  
        loadingMore.current = true; // Устанавливаем флаг загрузки  
        dispatch(fetchRepos({ username, page: currentPage.current }))  
          .then((response) => {  
            if (response && response.payload) { // Проверяем, что response и response.payload существуют  
              if (response.payload.length === 0) { // Проверяем на пустой массив  
                setHasMoreRepos(false); // Устанавливаем состояние, что репозиториев больше нет  
              } else {  
                currentPage.current += 1; // Увеличиваем номер страницы после успешной загрузки  
              }  
              setSearchPerformed(true); // Устанавливаем, что поиск выполнен, даже если репозиториев нет  
            } else {  
              console.error('Unexpected response structure:', response); // Логируем неожидаемую структуру  
            }  
          })  
          .catch((error) => {  
            console.error('Ошибка при загрузке репозиториев:', error); // Логируем ошибки  
            setSearchPerformed(true); // Устанавливаем, что поиск выполнен, даже при ошибке  
          })  
          .finally(() => {  
            loadingMore.current = false; // Сбрасываем флаг загрузки после завершения  
            setSearchPerformed(true);
          });  
      }  
    }, [dispatch, username, loading, hasMoreRepos]);  
  
    useEffect(() => {  
      const handleScroll = debounce(() => {  
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {  
          loadMoreRepos();  
        }  
      }, 400);  
  
      window.addEventListener('scroll', handleScroll); // Добавляем обработчик события прокрутки  
      return () => {  
        window.removeEventListener('scroll', handleScroll); // Удаляем обработчик при размонтировании  
      };  
    }, [loadMoreRepos]);  
  
    return (  
      <Container sx={{ paddingTop: '3%' }} className="main">  
        {loading && <Loader />}  
        
        {error && (  
          <Stack sx={{ width: '100%', marginBottom: '2rem' }} spacing={1}>  
            <Alert severity="error">{error}</Alert> {/* Показываем ошибку */}  
          </Stack>  
        )}  
  
        {/* Показываем приветственное сообщение, если поиск еще не был выполнен */}  
        {(!searchPerformed && !loading) && (  
          <Typography variant="h4" align="center" sx={{ margin: '20px 0' }}>  
            Добро пожаловать!  
          </Typography>  
        )}  
  
        <Box sx={{ minHeight: 'calc(100vh - 200px)' }} className="content">  
          <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>  
            <Content />  
          </Container>  
          {/* Индикатор загрузки в конце списка показывается, только если есть еще репозитории для загрузки */}  
          {loadingMore.current && hasMoreRepos && <Loader />}   
        </Box>  
      </Container>  
    );  
  }; 




   