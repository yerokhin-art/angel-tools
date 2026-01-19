import { Heading } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Folder from "@react-spectrum/s2/icons/Folder";
import { useFileStore } from "../../store/files";
import { useTranslation } from "react-i18next";

const sidebarStyles = style({
  display: "flex",
  flexDirection: "column",
  width: 240,
  minWidth: 240,
  backgroundColor: "layer-1",
  borderEndWidth: 1,
  borderEndStyle: "solid",
  borderColor: "gray-200",
  overflow: "auto",
});

const headerStyles = style({
  display: "flex",
  alignItems: "center",
  paddingX: 16,
  paddingY: 12,
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderColor: "gray-200",
});

const listStyles = style({
  display: "flex",
  flexDirection: "column",
  padding: 8,
  gap: 2,
});

const itemStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
  paddingX: 12,
  paddingY: 8,
  borderRadius: "sm",
  font: "body-sm",
  cursor: "default",
});

const activeItemStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
  paddingX: 12,
  paddingY: 8,
  borderRadius: "sm",
  font: "body-sm",
  cursor: "default",
  backgroundColor: "accent-subtle",
});

const iconStyles = style({
  flexShrink: 0,
});

const textStyles = style({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export function Sidebar() {
  const { t } = useTranslation();
  const directoryPath = useFileStore((s) => s.directoryPath);
  const folderStructure = useFileStore((s) => s.folderStructure);

  const currentFolderName = directoryPath?.split("/").pop() ?? t("sidebar.root");

  return (
    <aside className={sidebarStyles}>
      <div className={headerStyles}>
        <Heading level={3} UNSAFE_style={{ fontSize: "14px", margin: 0 }}>
          {t("sidebar.folders")}
        </Heading>
      </div>
      <nav className={listStyles}>
        {/* Current folder (root of selection) */}
        <div className={activeItemStyles}>
          <span className={iconStyles}>
            <Folder />
          </span>
          <span className={textStyles}>{currentFolderName}</span>
        </div>

        {/* Nested folders */}
        {folderStructure.map((folder) => (
          <div key={folder.path} className={itemStyles}>
            <span className={iconStyles}>
              <Folder />
            </span>
            <span className={textStyles}>{folder.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
