import Layout from "@theme-original/Layout";
import { useLocation } from "@docusaurus/router";
import clsx from "clsx";

export default function LayoutWrapper(props) {
  const { pathname } = useLocation();
  const isHomepage = pathname.replace(/\/$/, "") === "";

  // Add a class to the main wrapper if on homepage
  const mainWrapperClass = isHomepage ? "layout--homepage" : "";

  return (
    <div className={mainWrapperClass}>
      <Layout {...props} />
    </div>
  );
}
