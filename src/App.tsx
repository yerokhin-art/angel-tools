import { useEffect } from "react";
import {
  ActionButton,
  ActionGroup,
  Button,
  Cell,
  Column,
  Flex,
  Item,
  Row,
  StatusLight,
  TableBody,
  TableHeader,
  TableView,
  Text,
  View,
  Tooltip,
} from "@adobe/react-spectrum";
import CopyIcon from "@spectrum-icons/workflow/Copy";
import FolderOpenIcon from "@spectrum-icons/workflow/OpenRecent";
import { useFileStore, selectFilteredRows, Filter } from "./store/files";
import { formatMtime, formatSizeMB } from "./utils/cameraSequence";
import "./App.css";

function App() {
  const directoryPath = useFileStore((s) => s.directoryPath);
  const loading = useFileStore((s) => s.loading);
  const filter = useFileStore((s) => s.filter);
  const rows = useFileStore(selectFilteredRows);
  const missedRows = useFileStore((s) => s.missedRows);
  const selectDirectory = useFileStore((s) => s.selectDirectory);
  const setFilter = useFileStore((s) => s.setFilter);
  const copyMissedList = useFileStore((s) => s.copyMissedList);
  const refresh = useFileStore((s) => s.refresh);

  useEffect(() => {
    // Optional: auto-refresh when app regains focus if a dir is selected
    const onFocus = () => {
      if (directoryPath) refresh();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [directoryPath, refresh]);

  return (
    <View height="100vh" padding="size-200" backgroundColor="gray-100">
      <Flex direction="column" gap="size-200" height="100%">
        <Flex alignItems="center" gap="size-200">
          <ActionButton onPress={selectDirectory} isDisabled={loading}>
            <FolderOpenIcon />
            <Text>
              {directoryPath ? "Change directory" : "Select directory"}
            </Text>
          </ActionButton>
          <ActionGroup
            selectionMode="single"
            selectedKeys={[filter]}
            onSelectionChange={(keys) =>
              keys instanceof Set &&
              setFilter(keys.values().next().value as Filter)
            }
            aria-label="Filter"
          >
            <Item key="all">All</Item>
            <Item key="local">Local</Item>
            <Item key="missed">Missed</Item>
          </ActionGroup>
          <Button
            variant="primary"
            onPress={copyMissedList}
            isDisabled={missedRows.length === 0}
          >
            Copy missed list ({missedRows.length})
          </Button>
          <View flex />
          <Text UNSAFE_style={{ opacity: 0.7 }}>
            {directoryPath ?? "No directory selected"}
          </Text>
        </Flex>

        <View flex overflow="auto" borderRadius="regular">
          <TableView
            aria-label="Files"
            isQuiet
            density="compact"
            width="100%"
            height="100%"
            overflowMode="wrap"
          >
            <TableHeader>
              <Column key="name" width="1fr">
                Name
              </Column>
              <Column key="mtime">Last changed</Column>
              <Column key="size" align="end">
                Size
              </Column>
              <Column key="actions" width={120}>
                Actions
              </Column>
            </TableHeader>
            <TableBody items={rows} loadingState={loading ? "loading" : "idle"}>
              {(item) => (
                <Row key={item.id}>
                  <Cell>
                    <Flex alignItems="center" gap="size-100">
                      <Text>{item.name}</Text>
                      {item.kind === "missing" && (
                        <StatusLight variant="negative">Missing</StatusLight>
                      )}
                    </Flex>
                  </Cell>
                  <Cell>{formatMtime(item.mtimeMs)}</Cell>
                  <Cell>{formatSizeMB(item.sizeBytes)}</Cell>
                  <Cell>
                    <Tooltip placement="left">
                      <ActionButton
                        isQuiet
                        onPress={async () => {
                          await navigator.clipboard.writeText(item.name);
                        }}
                      >
                        <CopyIcon />
                        <Text>Copy name</Text>
                      </ActionButton>
                    </Tooltip>
                  </Cell>
                </Row>
              )}
            </TableBody>
          </TableView>
        </View>
      </Flex>
    </View>
  );
}

export default App;
