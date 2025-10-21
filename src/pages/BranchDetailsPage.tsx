import { useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box, Heading, Text, SimpleGrid, Badge, Divider, Link, Spinner
} from "@chakra-ui/react";
import { useBranches } from "../api/hooks";

export default function BranchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useBranches();

  const branch = useMemo(() => data?.find(b => String(b.id) === String(id)), [data, id]);

  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">Failed to load branch.</Text>;
  if (!branch) {
    return (
      <Box>
        <Heading size="md">Branch not found</Heading>
        <Link as={RouterLink} to="/">← Back to list</Link>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={1}>{branch.name}</Heading>
      <Badge colorScheme="purple" mb={3}>{branch.brandName ?? "HSBC"}</Badge>

      <Text>
        {[branch.addressLine, branch.town, branch.postcode, branch.country]
          .filter(Boolean)
          .join(", ")}
      </Text>
      {branch.phone && <Text mt={1}>☎ {branch.phone}</Text>}
      {branch.sortCodes?.length ? <Text mt={1}>Sort code: {branch.sortCodes.join(", ")}</Text> : null}

      <Divider my={4} />

      {!!branch.hours?.length && (
        <>
          <Heading size="sm" mb={2}>Working hours</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }}>
            {branch.hours.map((h, i) => (
              <Text key={i}>{h.day}: {h.opens}–{h.closes}</Text>
            ))}
          </SimpleGrid>
        </>
      )}

      {/* Map placeholder — add Leaflet later if you want the bonus */}
      {branch.lat && branch.lon ? (
        <Box mt={4} fontSize="sm" opacity={0.8}>
          Coordinates: {branch.lat.toFixed(6)}, {branch.lon.toFixed(6)}
        </Box>
      ) : null}

      <Link as={RouterLink} to="/" display="inline-block" mt={6}>← Back to branches</Link>
    </Box>
  );
}