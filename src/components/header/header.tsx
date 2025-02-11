import { useState, ChangeEvent, useEffect } from "react"
import { useAppDispatch } from "../../hook";
import { addUserName, fetchRepos } from "../../store/repository-slice";
import { AppBar, Container, Toolbar } from "@mui/material";
import { debounce } from "../../utils/debounce";




export const Header: React.FC = () => {

    const [searchValue, setSearchValue] = useState('');

    
    const dispatch = useAppDispatch();

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value);

    // Создание дебаунсированной функции  
    const debouncedFetchRepos = debounce((value: string) => {  
        if (value) {  
            dispatch(fetchRepos({ username: value })); // Передаем объект  
        }  
    }, 1000);   

    useEffect(() => {  
        debouncedFetchRepos(searchValue); // Вызов дебаунсированной функции 
        dispatch(addUserName(searchValue)); 
    }, [searchValue, debouncedFetchRepos, dispatch]); // Зависимость: searchValue 



    return (
        <AppBar sx={{ backgroundColor: '#005b8f' }} position="static">  
  <Toolbar>  
    <Container sx={{ padding: '20px', display: 'flex', justifyContent: 'center', flexGrow: 1 }}>  
      <input  
        className="searchInput"  
        placeholder="Введите имя пользователя GitHub"  
        value={searchValue}  
        onChange={onChangeHandler}  
        style={{ width: '100%', maxWidth: '500px' }} // Можно установить максимальную ширину для инпута  
      />  
    </Container>  
  </Toolbar>  
</AppBar>
    )
}