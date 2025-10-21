import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  InputGroup,
  InputLeftElement,
  Input,
  List,
  ListItem,
  Card,
  CardBody,
  Text,
  Spinner,
  Link,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useBranches } from "../api/hooks";

export default function BranchListPage() {
  const { data, isLoading, error } = useBranches();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = q.trim().toLowerCase();
    if (!term) return data;
    return data.filter((b) =>
      [
        b.name,
        b.addressLine,
        b.town,
        b.postcode,
        b.brandName,
        ...(b.sortCodes ?? []),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [data, q]);

  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">Failed to load branches.</Text>;

  return (
    <VStack align="stretch" spacing={4}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>
        <Input
          placeholder="Search by name, address, town, postcode, sort code…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </InputGroup>

      <List spacing={3}>
        {filtered.map((b) => (
          <ListItem key={b.id}>
            <Card
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              color="gray.100"
              _hover={{ shadow: "md", bg: "gray.700" }}
            
              transition="box-shadow .2s"
            >
              <CardBody>
                <Link
                  as={RouterLink}
                  to={`/branch/${encodeURIComponent(b.id)}`}
                >
                  <Text fontWeight="bold">{b.name}</Text>
                  <Text fontSize="sm" opacity={0.8}>
                    {[b.addressLine, b.town, b.postcode]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                </Link>
              </CardBody>
            </Card>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
}
