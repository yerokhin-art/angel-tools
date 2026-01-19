import {
  ActionButton,
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
  StatusLight,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Copy from "@react-spectrum/s2/icons/Copy";
import {
  useFileStore,
  selectSearchFilteredRows,
  selectTotalFiles,
  selectAvailableCount,
  selectMissingCount,
} from "../../store/files";
import { useShallow } from "zustand/react/shallow";
import { formatSizeMB, formatMtime } from "../../utils/cameraSequence";
import { EmptyState } from "./EmptyState";
import { useTranslation } from "react-i18next";

const containerStyles = style({
  display: "flex",
  flexDirection: "column",
  height: "full",
  width: "full",
  overflow: "hidden",
});

const tableContainerStyles = style({
  flexGrow: 1,
  overflow: "auto",
});

const footerStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingX: 16,
  paddingY: 12,
  borderTopWidth: 1,
  borderTopStyle: "solid",
  borderColor: "gray-200",
  backgroundColor: "layer-1",
});

const statsStyles = style({
  display: "flex",
  gap: 16,
});

const statItemStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 4,
  font: "body-sm",
});

export function FileTable() {
  const { t } = useTranslation();
  const filteredRows = useFileStore(useShallow(selectSearchFilteredRows));
  const missedRows = useFileStore((s) => s.missedRows);
  const copyMissedList = useFileStore((s) => s.copyMissedList);
  const filter = useFileStore((s) => s.filter);
  const searchQuery = useFileStore((s) => s.searchQuery);

  const totalFiles = useFileStore(selectTotalFiles);
  const availableCount = useFileStore(selectAvailableCount);
  const missingCount = useFileStore(selectMissingCount);

  if (filteredRows.length === 0) {
    return (
      <div className={containerStyles}>
        <div className={tableContainerStyles}>
          <EmptyState filter={filter} searchQuery={searchQuery} />
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyles}>
      <div className={tableContainerStyles}>
        <TableView
          aria-label={t("fileTable.ariaLabel")}
          selectionMode="none"
          density="spacious"
          styles={style({ height: "full" })}
        >
          <TableHeader>
            <Column key="status" width={100}>
              {t("fileTable.columnStatus")}
            </Column>
            <Column key="name" isRowHeader>
              {t("fileTable.columnName")}
            </Column>
            <Column key="size" width={120}>
              {t("fileTable.columnSize")}
            </Column>
            <Column key="modified" width={180}>
              {t("fileTable.columnModified")}
            </Column>
          </TableHeader>
          <TableBody items={filteredRows}>
            {(item) => (
              <Row key={item.id}>
                <Cell>
                  <StatusLight
                    variant={item.kind === "local" ? "positive" : "negative"}
                  >
                    {item.kind === "local"
                      ? t("fileTable.statusAvailable")
                      : t("fileTable.statusMissing")}
                  </StatusLight>
                </Cell>
                <Cell>
                  <Text>{item.name}</Text>
                </Cell>
                <Cell>
                  <Text>
                    {item.kind === "local" ? formatSizeMB(item.sizeBytes) : "-"}
                  </Text>
                </Cell>
                <Cell>
                  <Text>
                    {item.kind === "local" ? formatMtime(item.mtimeMs) : "-"}
                  </Text>
                </Cell>
              </Row>
            )}
          </TableBody>
        </TableView>
      </div>

      <footer className={footerStyles}>
        <div className={statsStyles}>
          <span className={statItemStyles}>
            <Text>{t("fileTable.total", { count: totalFiles })}</Text>
          </span>
          <span className={statItemStyles}>
            <StatusLight variant="positive">
              {t("fileTable.available", { count: availableCount })}
            </StatusLight>
          </span>
          <span className={statItemStyles}>
            <StatusLight variant="negative">
              {t("fileTable.missing", { count: missingCount })}
            </StatusLight>
          </span>
        </div>

        {missedRows.length > 0 && (
          <ActionButton onPress={copyMissedList}>
            <Copy />
            <Text>{t("fileTable.copyMissing", { count: missedRows.length })}</Text>
          </ActionButton>
        )}
      </footer>
    </div>
  );
}
