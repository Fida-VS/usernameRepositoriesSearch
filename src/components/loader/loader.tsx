import { Box, Container, Typography } from "@mui/material";

 export const Loader: React.FC = () => {


	return (
	<Container sx={{
		width: '15rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '3rem',
        marginBottom: '3rem'
	  }}>
		<Box>
		<Typography variant="h4">Loading...</Typography>
		</Box>
	</Container>

);
};