import Layout from "@theme-original/Layout";
import { useLocation } from "react-router-dom";
import useBaseUrl from "@docusaurus/useBaseUrl";
import DisclaimerModal from "@site/src/components/DisclaimerModal";

export default function LayoutWrapper(props) {
  const { pathname } = useLocation();
  const baseUrl = useBaseUrl("/");

  // Check if we're on the home page
  const isBaseUrl =
    pathname === "/" || pathname === baseUrl.replace(/\/$/, "/");

  // Check if we're on a docs page
  const isDocsPage = pathname.startsWith(baseUrl + "docs") ||
                     pathname.startsWith("/docs");

  // Add layout--homepage tag if on base
  const mainWrapperClass = isBaseUrl ? "layout--homepage" : "";

  return (
    <div className={mainWrapperClass}>
      <Layout {...props} />
      {isDocsPage && <DisclaimerModal />}
    </div>
  );
}
