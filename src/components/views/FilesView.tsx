import { ProgressCircle } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { useFileStore } from "../../store/files";
import { MainLayout } from "../layout/MainLayout";
import { FileTable } from "../shared/FileTable";

const loadingStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "full",
  width: "full",
});

export function FilesView() {
  const loading = useFileStore((s) => s.loading);

  return (
    <MainLayout>
      {loading ? (
        <div className={loadingStyles}>
          <ProgressCircle aria-label="Loading files" isIndeterminate size="L" />
        </div>
      ) : (
        <FileTable />
      )}
    </MainLayout>
  );
}
