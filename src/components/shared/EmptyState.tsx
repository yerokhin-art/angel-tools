import { Content, Heading, IllustratedMessage } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Search from "@react-spectrum/s2/illustrations/gradient/generic1/Search";
import Checkmark from "@react-spectrum/s2/illustrations/gradient/generic1/Checkmark";
import Document from "@react-spectrum/s2/illustrations/gradient/generic1/Document";
import type { Filter } from "../../store/files";
import { useTranslation } from "react-i18next";

const containerStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "full",
  width: "full",
});

interface EmptyStateProps {
  filter: Filter;
  searchQuery: string;
}

export function EmptyState({ filter, searchQuery }: EmptyStateProps) {
  const { t } = useTranslation();

  if (searchQuery) {
    return (
      <div className={containerStyles}>
        <IllustratedMessage>
          <Search />
          <Heading>{t("emptyState.noResultsTitle")}</Heading>
          <Content>
            {t("emptyState.noResultsDescription", { query: searchQuery })}
          </Content>
        </IllustratedMessage>
      </div>
    );
  }

  if (filter === "missed") {
    return (
      <div className={containerStyles}>
        <IllustratedMessage>
          <Checkmark />
          <Heading>{t("emptyState.noMissingTitle")}</Heading>
          <Content>{t("emptyState.noMissingDescription")}</Content>
        </IllustratedMessage>
      </div>
    );
  }

  if (filter === "local") {
    return (
      <div className={containerStyles}>
        <IllustratedMessage>
          <Document />
          <Heading>{t("emptyState.noAvailableTitle")}</Heading>
          <Content>{t("emptyState.noAvailableDescription")}</Content>
        </IllustratedMessage>
      </div>
    );
  }

  return (
    <div className={containerStyles}>
      <IllustratedMessage>
        <Document />
        <Heading>{t("emptyState.noFilesTitle")}</Heading>
        <Content>{t("emptyState.noFilesDescription")}</Content>
      </IllustratedMessage>
    </div>
  );
}
