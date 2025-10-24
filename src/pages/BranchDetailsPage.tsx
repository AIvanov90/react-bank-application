import { useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Divider,
  Link,
  Spinner,
  Wrap,
  WrapItem,
  Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useBranches } from "../api/hooks";
import BranchMap from "../components/BranchMap";

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
      {branch.type && (
        <Text mt={1} opacity={0.85}>Type: {branch.type}</Text>
      )}

      {branch.lat && branch.lon && (
        <Box mt={2}>
          <Link
            href={`https://www.google.com/maps?q=${branch.lat},${branch.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            color="blue.300"
          >
            Open in Google Maps →
          </Link>
        </Box>
      )}

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

      {(branch.serviceAndFacility?.length || branch.accessibility?.length || branch.customerSegment?.length) ? (
        <Box mt={4}>
          <Accordion allowMultiple>
            {branch.serviceAndFacility?.length ? (
              <AccordionItem border="none">
                <h3>
                  <AccordionButton px={0}>
                    <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                      Services and facilities ({branch.serviceAndFacility.length})
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel px={0}>
                  <Wrap mt={2}>
                    {branch.serviceAndFacility.map((s, i) => (
                      <WrapItem key={i}>
                        <Tag colorScheme="teal" variant="subtle">{s}</Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </AccordionPanel>
              </AccordionItem>
            ) : null}

            {branch.accessibility?.length ? (
              <AccordionItem border="none">
                <h3>
                  <AccordionButton px={0}>
                    <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                      Accessibility ({branch.accessibility.length})
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel px={0}>
                  <Wrap mt={2}>
                    {branch.accessibility.map((a, i) => (
                      <WrapItem key={i}>
                        <Tag colorScheme="orange" variant="subtle">{a}</Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </AccordionPanel>
              </AccordionItem>
            ) : null}

            {branch.customerSegment?.length ? (
              <AccordionItem border="none">
                <h3>
                  <AccordionButton px={0}>
                    <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                      Customer segments ({branch.customerSegment.length})
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel px={0}>
                  <Wrap mt={2}>
                    {branch.customerSegment.map((c, i) => (
                      <WrapItem key={i}>
                        <Tag colorScheme="cyan" variant="subtle">{c}</Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </AccordionPanel>
              </AccordionItem>
            ) : null}
          </Accordion>
        </Box>
      ) : null}

      {branch.lat && branch.lon ? (
        <Box mt={4}>
          <BranchMap
            branch={{
              id: String(branch.id),
              name: branch.name,
              addressLine: branch.addressLine,
              lat: branch.lat,
              lon: branch.lon,
            }}
          />
        </Box>
      ) : null}

      <Link as={RouterLink} to="/" display="inline-block" mt={6}>← Back to branches</Link>
    </Box>
  );
}