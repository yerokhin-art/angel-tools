import {
  Button,
  ButtonGroup,
  Content,
  Heading,
  IllustratedMessage,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import FolderOpen from "@react-spectrum/s2/illustrations/gradient/generic1/FolderOpen";
import { useFileStore } from "../../store/files";
import { useTranslation } from "react-i18next";

const containerStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "screen",
  width: "full",
  backgroundColor: "base",
});

export function WelcomeView() {
  const { t } = useTranslation();
  const selectDirectory = useFileStore((s) => s.selectDirectory);
  const loading = useFileStore((s) => s.loading);

  return (
    <div className={containerStyles}>
      <IllustratedMessage size="L">
        <FolderOpen />
        <Heading>{t("welcome.title")}</Heading>
        <Content>{t("welcome.description")}</Content>
        <ButtonGroup>
          <Button
            variant="accent"
            onPress={selectDirectory}
            isPending={loading}
          >
            {t("welcome.openFolder")}
          </Button>
        </ButtonGroup>
      </IllustratedMessage>
    </div>
  );
}
