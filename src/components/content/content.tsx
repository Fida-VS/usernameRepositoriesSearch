import { Container } from "@mui/material";
import { useAppSelector } from "../../hook";
import { ReposCard } from "./card";

export const Content: React.FC = () => {
  const repositories = useAppSelector(
    (state) => state.repositories.repositories
  );

  return (
    <Container>
      {repositories.map((repository) => (
        <ReposCard key={repository.node_id} {...repository} />
      ))}
    </Container>
  );
};
