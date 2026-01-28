import NBISElliottWaveChart from "./NBISElliottWaveChart.jsx";
import { useColorMode } from "@docusaurus/theme-common";
const { colorMode } = useColorMode();
export default function NBISElliottWaveChartWrapper(props) {
  const { colorMode } = useColorMode();

  return <NBISElliottWaveChart {...props} colorMode={colorMode} />;
}
