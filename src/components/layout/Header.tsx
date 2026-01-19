import {
  ActionButton,
  SearchField,
  SegmentedControl,
  SegmentedControlItem,
  Text,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import FolderOpen from "@react-spectrum/s2/icons/FolderOpen";
import Refresh from "@react-spectrum/s2/icons/Refresh";
import { useFileStore, type Filter } from "../../store/files";
import { useTranslation } from "react-i18next";

const headerStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingX: 16,
  paddingY: 12,
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderColor: "gray-200",
  backgroundColor: "layer-1",
  gap: 16,
});

const leftSectionStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

const centerSectionStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexGrow: 1,
  gap: 16,
});

const rightSectionStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export function Header() {
  const { t } = useTranslation();
  const filter = useFileStore((s) => s.filter);
  const setFilter = useFileStore((s) => s.setFilter);
  const searchQuery = useFileStore((s) => s.searchQuery);
  const setSearchQuery = useFileStore((s) => s.setSearchQuery);
  const selectDirectory = useFileStore((s) => s.selectDirectory);
  const refresh = useFileStore((s) => s.refresh);
  const loading = useFileStore((s) => s.loading);
  const directoryPath = useFileStore((s) => s.directoryPath);

  const folderName = directoryPath?.split("/").pop() ?? t("header.noFolderSelected");

  return (
    <header className={headerStyles}>
      <div className={leftSectionStyles}>
        <ActionButton onPress={selectDirectory} aria-label={t("header.openFolder")}>
          <FolderOpen />
        </ActionButton>
        <Text
          UNSAFE_style={{
            fontSize: "14px",
            fontWeight: 500,
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {folderName}
        </Text>
      </div>

      <div className={centerSectionStyles}>
        <SearchField
          aria-label={t("header.searchFiles")}
          value={searchQuery}
          onChange={setSearchQuery}
          styles={style({ width: 280 })}
        />
        <SegmentedControl
          aria-label={t("header.filterFiles")}
          selectedKey={filter}
          onSelectionChange={(key) => setFilter(key as Filter)}
        >
          <SegmentedControlItem id="all">{t("header.all")}</SegmentedControlItem>
          <SegmentedControlItem id="local">{t("header.available")}</SegmentedControlItem>
          <SegmentedControlItem id="missed">{t("header.missing")}</SegmentedControlItem>
        </SegmentedControl>
      </div>

      <div className={rightSectionStyles}>
        <ActionButton
          onPress={refresh}
          isDisabled={loading}
          aria-label={t("header.refresh")}
        >
          <Refresh />
        </ActionButton>
      </div>
    </header>
  );
}
