import React from 'react';  
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';  
import { useTheme } from '@mui/material/styles';  
import useMediaQuery from '@mui/material/useMediaQuery';  


interface ReposCardProps {
  id: number;  
  name: string;  
  description: string | null;  
  html_url: string;  
  stargazers_count: number;  
  updated_at: string;
}


export const ReposCard: React.FC<ReposCardProps> = ({
    id,
    name,
    description,
    html_url,
    stargazers_count,
    updated_at
}) => {

    const formattedDate = new Date(updated_at).toLocaleDateString(); 

    const theme = useTheme();  
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Card variant="outlined" sx={{ margin: isSmallScreen ? '5%' : 2 }}>  
        <CardContent>  
          <Typography  
            variant="h5"  
            component="div"  
            sx={{  
              fontSize: isSmallScreen ? '1.2rem' : '1.5rem', // Меняем размер шрифта  
              overflow: 'hidden',  
              whiteSpace: 'nowrap', // Запрет переноса  
              textOverflow: 'ellipsis', // Многоточие для длинного текста  
              maxWidth: '100%', // Ограничение ширины  
            }}  
          >  
            {name}  
          </Typography>  
          {description && (  
            <Typography variant="body1" style={{ fontStyle: 'italic', color: 'darkGray' }}>  
              {description}  
            </Typography>  
          )}  
          <Typography variant="body2" color="text.secondary">  
            <strong>Stars:</strong> {stargazers_count}  
          </Typography>  
          <Typography variant="body2" color="text.secondary">  
            <strong>Updated on:</strong> {formattedDate}  
          </Typography>  
        </CardContent>  
        <CardActions>  
          <Button size="small" href={html_url} target="_blank" rel="noopener noreferrer">  
            Go to Repository  
          </Button>  
        </CardActions>  
      </Card>   
    )
}