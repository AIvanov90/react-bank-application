import { Routes, Route, Link } from "react-router-dom";
import { Flex, Heading, Spacer, Container } from "@chakra-ui/react";
import BranchListPage from "./pages/BranchListPage";
import BranchDetailsPage from "./pages/BranchDetailsPage";

function App() {
  return (
    <Container>
      <Flex>
        <Heading size="md" textAlign="center">
          <Link to="/">HSBC Branches</Link>
        </Heading>
        <Spacer />
      </Flex>

      <Routes>
        <Route path="/" element={<BranchListPage />} />
        <Route path="/branch/:id" element={<BranchDetailsPage />} />
      </Routes>
    </Container>
  );
}

export default App;
