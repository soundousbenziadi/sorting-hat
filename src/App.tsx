import { useTranslation } from "react-i18next";
import LanguageToggle from "./components/LanguageToggle";
function App() {
  const { t } = useTranslation();
  return (
    <>
      <LanguageToggle />
      <h1>{t("welcome")}</h1>
      <p>{t("subtitle")}</p>
    </>
  );
}

export default App;
