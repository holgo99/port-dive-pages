import NBISElliottWaveChart from "./NBISElliottWaveChart.jsx";
import { useColorMode } from "@docusaurus/theme-common";

export default function NBISElliottWaveChartWrapper(props) {
  const { colorMode } = useColorMode();

  return <NBISElliottWaveChart {...props} colorMode={colorMode} />;
}
