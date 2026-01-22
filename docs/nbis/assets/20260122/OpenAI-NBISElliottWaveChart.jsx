import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';

// ============================================================================
// OHLCV DATA - DO NOT MODIFY VALUES
// ============================================================================
const OHLCV_DATA = [
  { index: 0, timestamp: 1743773400, open: 20.78, high: 21.0992, low: 18.98, close: 20.29, volume: 14053016 },
  { index: 1, timestamp: 1744032600, open: 18.74, high: 21.9, low: 18.31, close: 21.05, volume: 12653701 },
  { index: 2, timestamp: 1744119000, open: 22.52, high: 22.75, low: 19.66, close: 20.06, volume: 11102224 },
  { index: 3, timestamp: 1744205400, open: 20.52, high: 23.9968, low: 18.8905, close: 23.46, volume: 17685383 },
  { index: 4, timestamp: 1744291800, open: 22.765, high: 22.82, low: 20.41, close: 21.04, volume: 8709488 },
  { index: 5, timestamp: 1744378200, open: 21.0, high: 21.665, low: 20.2601, close: 21.51, volume: 5470245 },
  { index: 6, timestamp: 1744637400, open: 22.32, high: 22.778, low: 20.51, close: 20.73, volume: 6090954 },
  { index: 7, timestamp: 1744723800, open: 21.31, high: 21.58, low: 20.8028, close: 21.33, volume: 4681536 },
  { index: 8, timestamp: 1744810200, open: 20.63, high: 21.305, low: 20.51, close: 21.08, volume: 4473320 },
  { index: 9, timestamp: 1744896600, open: 21.32, high: 21.85, low: 21.0215, close: 21.53, volume: 3973038 },
  { index: 10, timestamp: 1745242200, open: 21.24, high: 21.35, low: 20.25, close: 20.72, volume: 4267868 },
  { index: 11, timestamp: 1745328600, open: 21.15, high: 22.035, low: 21.02, close: 21.86, volume: 4708692 },
  { index: 12, timestamp: 1745415000, open: 23.25, high: 23.7861, low: 22.55, close: 22.96, volume: 7948988 },
  { index: 13, timestamp: 1745501400, open: 23.085, high: 24.6189, low: 22.932, close: 24.46, volume: 5588660 },
  { index: 14, timestamp: 1745587800, open: 24.57, high: 25.08, low: 23.86, close: 24.48, volume: 5825710 },
  { index: 15, timestamp: 1745847000, open: 24.205, high: 24.5994, low: 23.31, close: 24.11, volume: 3609706 },
  { index: 16, timestamp: 1745933400, open: 24.11, high: 24.415, low: 23.7, close: 23.86, volume: 3404823 },
  { index: 17, timestamp: 1746019800, open: 22.5, high: 22.8, low: 21.4501, close: 22.73, volume: 6099431 },
  { index: 18, timestamp: 1746106200, open: 25.025, high: 25.71, low: 23.92, close: 23.925, volume: 7475342 },
  { index: 19, timestamp: 1746192600, open: 24.65, high: 25.6162, low: 24.39, close: 25.4, volume: 6124608 },
  { index: 20, timestamp: 1746451800, open: 24.6, high: 24.66, low: 23.73, close: 23.8, volume: 4599858 },
  { index: 21, timestamp: 1746538200, open: 23.3, high: 25.07, low: 23.25, close: 25.04, volume: 6024079 },
  { index: 22, timestamp: 1746624600, open: 27.55, high: 27.87, low: 26.26, close: 27.45, volume: 17899382 },
  { index: 23, timestamp: 1746711000, open: 27.84, high: 28.59, low: 27.3, close: 28.22, volume: 6853824 },
  { index: 24, timestamp: 1746797400, open: 28.35, high: 29.08, low: 27.2, close: 28.27, volume: 8477340 },
  { index: 25, timestamp: 1747056600, open: 32.32, high: 33.73, low: 31.13, close: 33.34, volume: 16292632 },
  { index: 26, timestamp: 1747143000, open: 33.34, high: 35.98, low: 32.88, close: 35.27, volume: 13897455 },
  { index: 27, timestamp: 1747229400, open: 35.675, high: 36.65, low: 34.45, close: 36.12, volume: 12529740 },
  { index: 28, timestamp: 1747315800, open: 35.07, high: 36.79, low: 34.88, close: 35.79, volume: 11205645 },
  { index: 29, timestamp: 1747402200, open: 36.345, high: 38.14, low: 36.1923, close: 37.32, volume: 16647174 },
  { index: 30, timestamp: 1747661400, open: 35.8, high: 37.93, low: 35.68, close: 37.56, volume: 11035773 },
  { index: 31, timestamp: 1747747800, open: 38.12, high: 41.45, low: 36.4201, close: 39.14, volume: 31145816 },
  { index: 32, timestamp: 1747834200, open: 38.7, high: 41.4, low: 38.25, close: 38.92, volume: 17302414 },
  { index: 33, timestamp: 1747920600, open: 39.04, high: 39.55, low: 37.0, close: 37.8, volume: 10928706 },
  { index: 34, timestamp: 1748007000, open: 36.2, high: 39.2, low: 35.8, close: 38.59, volume: 10378906 },
  { index: 35, timestamp: 1748352600, open: 39.57, high: 40.09, low: 38.03, close: 39.82, volume: 9224286 },
  { index: 36, timestamp: 1748439000, open: 40.15, high: 40.9, low: 38.7, close: 39.6, volume: 7801825 },
  { index: 37, timestamp: 1748525400, open: 41.25, high: 41.8, low: 37.6, close: 38.04, volume: 11234109 },
  { index: 38, timestamp: 1748611800, open: 37.47, high: 38.18, low: 36.01, close: 36.75, volume: 8109474 },
  { index: 39, timestamp: 1748871000, open: 34.825, high: 36.04, low: 34.72, close: 36.02, volume: 17309160 },
  { index: 40, timestamp: 1748957400, open: 36.66, high: 37.98, low: 35.72, close: 37.27, volume: 12101564 },
  { index: 41, timestamp: 1749043800, open: 37.935, high: 40.4, low: 37.12, close: 39.39, volume: 14745612 },
  { index: 42, timestamp: 1749130200, open: 41.42, high: 49.73, low: 41.3999, close: 46.3, volume: 59116979 },
  { index: 43, timestamp: 1749216600, open: 46.295, high: 48.57, low: 45.41, close: 48.28, volume: 19955731 },
  { index: 44, timestamp: 1749475800, open: 50.265, high: 55.04, low: 49.54, close: 52.58, volume: 33822167 },
  { index: 45, timestamp: 1749562200, open: 51.0, high: 52.59, low: 49.15, close: 52.51, volume: 21894621 },
  { index: 46, timestamp: 1749648600, open: 52.52, high: 53.26, low: 49.83, close: 50.57, volume: 14439358 },
  { index: 47, timestamp: 1749735000, open: 50.265, high: 51.97, low: 48.82, close: 50.28, volume: 12573598 },
  { index: 48, timestamp: 1749821400, open: 48.64, high: 49.73, low: 46.88, close: 47.13, volume: 14336538 },
  { index: 49, timestamp: 1750080600, open: 48.0, high: 51.82, low: 47.89, close: 50.46, volume: 14505281 },
  { index: 50, timestamp: 1750167000, open: 49.85, high: 50.06, low: 47.66, close: 48.33, volume: 11504780 },
  { index: 51, timestamp: 1750253400, open: 48.625, high: 50.35, low: 47.69, close: 48.32, volume: 10999792 },
  { index: 52, timestamp: 1750426200, open: 48.66, high: 49.74, low: 46.88, close: 47.97, volume: 12670677 },
  { index: 53, timestamp: 1750685400, open: 47.0, high: 48.3, low: 45.02, close: 47.48, volume: 12396039 },
  { index: 54, timestamp: 1750771800, open: 49.0, high: 53.0, low: 48.98, close: 51.02, volume: 18080885 },
  { index: 55, timestamp: 1750858200, open: 53.275, high: 54.59, low: 48.05, close: 48.52, volume: 14092802 },
  { index: 56, timestamp: 1750944600, open: 49.57, high: 53.16, low: 48.54, close: 52.6, volume: 11533054 },
  { index: 57, timestamp: 1751031000, open: 53.01, high: 53.42, low: 50.6001, close: 51.84, volume: 8978070 },
  { index: 58, timestamp: 1751290200, open: 53.34, high: 55.7499, low: 52.15, close: 55.33, volume: 13852466 },
  { index: 59, timestamp: 1751376600, open: 54.6, high: 55.38, low: 49.766, close: 50.31, volume: 14286389 },
  { index: 60, timestamp: 1751463000, open: 50.255, high: 51.2, low: 48.882, close: 49.97, volume: 8151086 },
  { index: 61, timestamp: 1751549400, open: 50.99, high: 50.99, low: 49.8, close: 50.25, volume: 5143329 },
  { index: 62, timestamp: 1751895000, open: 49.325, high: 49.3348, low: 47.22, close: 47.84, volume: 9432634 },
  { index: 63, timestamp: 1751981400, open: 48.1, high: 48.55, low: 46.65, close: 47.1, volume: 8447779 },
  { index: 64, timestamp: 1752067800, open: 47.4, high: 48.8, low: 45.81, close: 46.05, volume: 10148670 },
  { index: 65, timestamp: 1752154200, open: 46.5, high: 47.235, low: 45.25, close: 46.43, volume: 8475988 },
  { index: 66, timestamp: 1752240600, open: 46.515, high: 47.605, low: 43.89, close: 44.3, volume: 9198213 },
  { index: 67, timestamp: 1752499800, open: 48.93, high: 52.21, low: 48.8, close: 51.95, volume: 24405126 },
  { index: 68, timestamp: 1752586200, open: 52.325, high: 55.43, low: 51.02, close: 53.53, volume: 18454809 },
  { index: 69, timestamp: 1752672600, open: 53.58, high: 53.6499, low: 50.12, close: 53.31, volume: 11106696 },
  { index: 70, timestamp: 1752759000, open: 53.81, high: 56.16, low: 52.7115, close: 53.69, volume: 10876380 },
  { index: 71, timestamp: 1752845400, open: 54.65, high: 54.8, low: 51.01, close: 52.79, volume: 9593830 },
  { index: 72, timestamp: 1753104600, open: 53.71, high: 58.1643, low: 51.88, close: 52.37, volume: 19795712 },
  { index: 73, timestamp: 1753191000, open: 52.15, high: 52.3, low: 49.0, close: 51.01, volume: 9913873 },
  { index: 74, timestamp: 1753277400, open: 51.2, high: 52.04, low: 50.44, close: 51.88, volume: 7288526 },
  { index: 75, timestamp: 1753363800, open: 53.28, high: 53.78, low: 51.02, close: 52.16, volume: 7220664 },
  { index: 76, timestamp: 1753450200, open: 52.52, high: 52.76, low: 51.32, close: 51.37, volume: 6237591 },
  { index: 77, timestamp: 1753709400, open: 51.69, high: 52.805, low: 50.554324, close: 52.75, volume: 8599545 },
  { index: 78, timestamp: 1753795800, open: 53.29, high: 54.7, low: 50.0, close: 50.4, volume: 10638297 },
  { index: 79, timestamp: 1753882200, open: 50.88, high: 52.5, low: 50.25, close: 51.29, volume: 8009413 },
  { index: 80, timestamp: 1753968600, open: 53.33, high: 57.13, low: 52.9, close: 54.43, volume: 22905485 },
  { index: 81, timestamp: 1754055000, open: 51.97, high: 53.73, low: 50.0982, close: 52.0, volume: 11719087 },
  { index: 82, timestamp: 1754314200, open: 52.99, high: 54.53, low: 52.88, close: 54.17, volume: 7096068 },
  { index: 83, timestamp: 1754400600, open: 55.845, high: 56.45, low: 53.5379, close: 55.17, volume: 8585128 },
  { index: 84, timestamp: 1754487000, open: 55.89, high: 55.89, low: 53.95, close: 55.09, volume: 9731086 },
  { index: 85, timestamp: 1754573400, open: 64.37, high: 70.54, low: 63.38, close: 65.31, volume: 44064989 },
  { index: 86, timestamp: 1754659800, open: 68.175, high: 71.49, low: 66.45, close: 68.78, volume: 18451904 },
  { index: 87, timestamp: 1754919000, open: 69.9, high: 75.9601, low: 69.16, close: 70.24, volume: 21552712 },
  { index: 88, timestamp: 1755005400, open: 73.425, high: 75.9188, low: 72.0, close: 75.33, volume: 16162726 },
  { index: 89, timestamp: 1755091800, open: 75.08, high: 75.21, low: 69.08, close: 70.63, volume: 18701875 },
  { index: 90, timestamp: 1755178200, open: 69.75, high: 71.52, low: 67.1, close: 68.46, volume: 13114024 },
  { index: 91, timestamp: 1755264600, open: 68.3, high: 71.97, low: 67.31, close: 71.62, volume: 9237569 },
  { index: 92, timestamp: 1755523800, open: 71.44, high: 72.59, low: 68.27, close: 72.54, volume: 10006986 },
  { index: 93, timestamp: 1755610200, open: 71.75, high: 71.75, low: 66.2, close: 67.19, volume: 12276289 },
  { index: 94, timestamp: 1755696600, open: 65.185, high: 67.5, low: 62.01, close: 67.47, volume: 14162843 },
  { index: 95, timestamp: 1755783000, open: 68.26, high: 68.26, low: 65.45, close: 66.18, volume: 8019247 },
  { index: 96, timestamp: 1755869400, open: 65.51, high: 69.68, low: 64.6108, close: 68.98, volume: 11017169 },
  { index: 97, timestamp: 1756128600, open: 69.46, high: 70.74, low: 67.25, close: 70.02, volume: 7898724 },
  { index: 98, timestamp: 1756215000, open: 70.29, high: 72.8, low: 69.31, close: 70.48, volume: 7516543 },
  { index: 99, timestamp: 1756301400, open: 71.5, high: 71.798, low: 68.652, close: 70.1, volume: 6471437 },
  { index: 100, timestamp: 1756387800, open: 70.93, high: 73.5, low: 70.2, close: 72.04, volume: 8909357 },
  { index: 101, timestamp: 1756474200, open: 71.545, high: 71.69, low: 67.6, close: 68.32, volume: 7594332 },
  { index: 102, timestamp: 1756819800, open: 65.9, high: 67.879, low: 64.11, close: 65.72, volume: 9332965 },
  { index: 103, timestamp: 1756906200, open: 66.88, high: 67.0, low: 64.8314, close: 65.65, volume: 6506241 },
  { index: 104, timestamp: 1756992600, open: 65.445, high: 66.5, low: 64.41, close: 64.91, volume: 5473282 },
  { index: 105, timestamp: 1757079000, open: 66.5, high: 67.39, low: 63.26, close: 65.47, volume: 5811679 },
  { index: 106, timestamp: 1757338200, open: 64.67, high: 66.64, low: 63.8, close: 64.06, volume: 23049975 },
  { index: 107, timestamp: 1757424600, open: 97.2, high: 98.6799, low: 86.12, close: 95.72, volume: 88378298 },
  { index: 108, timestamp: 1757511000, open: 91.64, high: 100.51, low: 91.0, close: 93.39, volume: 44690602 },
  { index: 109, timestamp: 1757597400, open: 92.67, high: 93.87, low: 88.415, close: 89.19, volume: 37580632 },
  { index: 110, timestamp: 1757683800, open: 91.19, high: 92.0, low: 86.78, close: 90.41, volume: 22844686 },
  { index: 111, timestamp: 1757943000, open: 92.61, high: 94.42, low: 88.84, close: 90.96, volume: 19391494 },
  { index: 112, timestamp: 1758029400, open: 91.2, high: 91.3, low: 88.02, close: 89.43, volume: 11737329 },
  { index: 113, timestamp: 1758115800, open: 91.67, high: 95.0, low: 88.83, close: 94.08, volume: 24500303 },
  { index: 114, timestamp: 1758202200, open: 95.075, high: 97.68, low: 92.03, close: 94.12, volume: 18068457 },
  { index: 115, timestamp: 1758288600, open: 94.14, high: 99.55, low: 93.25, close: 99.31, volume: 18649279 },
  { index: 116, timestamp: 1758547800, open: 101.95, high: 108.58, low: 98.52, close: 106.6, volume: 24365232 },
  { index: 117, timestamp: 1758634200, open: 108.04, high: 109.98, low: 104.25, close: 107.8, volume: 16693468 },
  { index: 118, timestamp: 1758720600, open: 109.135, high: 114.85, low: 104.85, close: 113.23, volume: 25341223 },
  { index: 119, timestamp: 1758807000, open: 108.055, high: 114.08, low: 105.88, close: 107.94, volume: 19658801 },
  { index: 120, timestamp: 1758893400, open: 109.93, high: 109.99, low: 102.8, close: 107.7, volume: 14915089 },
  { index: 121, timestamp: 1759152600, open: 109.38, high: 112.52, low: 108.33, close: 110.22, volume: 12067011 },
  { index: 122, timestamp: 1759239000, open: 113.445, high: 117.65, low: 111.66, close: 112.27, volume: 20425090 },
  { index: 123, timestamp: 1759325400, open: 111.715, high: 115.88, low: 109.76, close: 115.61, volume: 12008096 },
  { index: 124, timestamp: 1759411800, open: 123.77, high: 126.74, low: 118.57, close: 125.87, volume: 26887671 },
  { index: 125, timestamp: 1759498200, open: 127.235, high: 132.9792, low: 123.6, close: 127.98, volume: 21351332 },
  { index: 126, timestamp: 1759757400, open: 132.4, high: 135.76, low: 124.93, close: 124.94, volume: 16311053 },
  { index: 127, timestamp: 1759843800, open: 127.825, high: 128.28, low: 115.72, close: 117.7, volume: 19573994 },
  { index: 128, timestamp: 1759930200, open: 121.2, high: 125.31, low: 117.5, close: 122.0, volume: 18005901 },
  { index: 129, timestamp: 1760016600, open: 120.98, high: 133.32, low: 119.87, close: 132.64, volume: 18124575 },
  { index: 130, timestamp: 1760103000, open: 134.95, high: 141.1, low: 128.01, close: 129.58, volume: 28268503 },
  { index: 131, timestamp: 1760362200, open: 135.21, high: 138.53, low: 132.65, close: 135.46, volume: 12788929 },
  { index: 132, timestamp: 1760448600, open: 132.0, high: 133.7843, low: 125.75, close: 128.15, volume: 13109232 },
  { index: 133, timestamp: 1760535000, open: 131.9, high: 131.99, low: 122.2, close: 125.83, volume: 11708320 },
  { index: 134, timestamp: 1760621400, open: 128.09, high: 130.97, low: 122.02, close: 123.04, volume: 14207745 },
  { index: 135, timestamp: 1760707800, open: 118.06, high: 120.5734, low: 110.88, close: 113.44, volume: 21366533 },
  { index: 136, timestamp: 1760967000, open: 116.79, high: 117.47, low: 107.51, close: 109.0, volume: 17799474 },
  { index: 137, timestamp: 1761053400, open: 107.88, high: 108.18, low: 101.4, close: 104.28, volume: 18455857 },
  { index: 138, timestamp: 1761139800, open: 106.675, high: 107.8, low: 94.63, close: 98.62, volume: 26631501 },
  { index: 139, timestamp: 1761226200, open: 100.33, high: 106.62, low: 99.46, close: 106.16, volume: 15803826 },
  { index: 140, timestamp: 1761312600, open: 111.16, high: 117.45, low: 110.01, close: 117.26, volume: 17411914 },
  { index: 141, timestamp: 1761571800, open: 120.91, high: 126.5, low: 120.11, close: 125.43, volume: 16809794 },
  { index: 142, timestamp: 1761658200, open: 126.435, high: 129.03, low: 120.78, close: 121.83, volume: 13455547 },
  { index: 143, timestamp: 1761744600, open: 124.28, high: 125.95, low: 117.5, close: 125.1, volume: 13952790 },
  { index: 144, timestamp: 1761831000, open: 121.2, high: 128.44, low: 117.76, close: 124.18, volume: 12204384 },
  { index: 145, timestamp: 1761917400, open: 126.64, high: 132.1499, low: 126.3, close: 130.82, volume: 13389040 },
  { index: 146, timestamp: 1762180200, open: 134.0, high: 134.93, low: 119.7501, close: 120.47, volume: 17247025 },
  { index: 147, timestamp: 1762266600, open: 112.355, high: 116.78, low: 109.0, close: 110.54, volume: 17818197 },
  { index: 148, timestamp: 1762353000, open: 113.64, high: 118.21, low: 111.43, close: 117.0, volume: 13977675 },
  { index: 149, timestamp: 1762439400, open: 119.55, high: 121.0, low: 108.41, close: 109.44, volume: 17314423 },
  { index: 150, timestamp: 1762525800, open: 104.5, high: 111.3, low: 101.26, close: 111.28, volume: 17614072 },
  { index: 151, timestamp: 1762785000, open: 115.18, high: 118.37, low: 108.72, close: 109.95, volume: 21363592 },
  { index: 152, timestamp: 1762871400, open: 114.13, high: 114.56, low: 99.83, close: 102.22, volume: 45261131 },
  { index: 153, timestamp: 1762957800, open: 104.2, high: 105.6499, low: 91.71, close: 94.36, volume: 35913483 },
  { index: 154, timestamp: 1763044200, open: 90.89, high: 91.48, low: 84.5, close: 88.63, volume: 41803017 },
  { index: 155, timestamp: 1763130600, open: 82.36, high: 89.0, low: 82.0, close: 83.54, volume: 31947972 },
  { index: 156, timestamp: 1763389800, open: 83.82, high: 89.65, low: 83.59, close: 85.98, volume: 23478713 },
  { index: 157, timestamp: 1763476200, open: 83.78, high: 93.69, low: 81.71, close: 90.54, volume: 26661640 },
  { index: 158, timestamp: 1763562600, open: 93.005, high: 96.72, low: 91.8, close: 95.07, volume: 22040586 },
  { index: 159, timestamp: 1763649000, open: 99.43, high: 102.69, low: 84.21, close: 84.64, volume: 35775660 },
  { index: 160, timestamp: 1763735400, open: 85.55, high: 88.74, low: 78.21, close: 83.26, volume: 34963167 },
  { index: 161, timestamp: 1763994600, open: 86.23, high: 93.0, low: 85.15, close: 91.9, volume: 51066797 },
  { index: 162, timestamp: 1764081000, open: 89.29, high: 91.28, low: 84.7211, close: 88.88, volume: 15021195 },
  { index: 163, timestamp: 1764167400, open: 93.85, high: 95.634, low: 90.76, close: 94.69, volume: 13544965 },
  { index: 164, timestamp: 1764340200, open: 96.55, high: 97.08, low: 93.4402, close: 94.87, volume: 6018834 },
  { index: 165, timestamp: 1764599400, open: 91.45, high: 101.6, low: 89.01, close: 100.15, volume: 14462853 },
  { index: 166, timestamp: 1764685800, open: 100.36, high: 102.95, low: 96.06, close: 96.45, volume: 11332667 },
  { index: 167, timestamp: 1764772200, open: 95.02, high: 99.06, low: 91.0, close: 98.92, volume: 11307490 },
  { index: 168, timestamp: 1764858600, open: 99.07, high: 103.84, low: 97.47, close: 102.8, volume: 11234128 },
  { index: 169, timestamp: 1764945000, open: 100.34, high: 101.35, low: 96.2, close: 98.04, volume: 13041137 },
  { index: 170, timestamp: 1765204200, open: 97.29, high: 100.5, low: 95.3, close: 100.33, volume: 8737775 },
  { index: 171, timestamp: 1765290600, open: 98.09, high: 100.8826, low: 96.1, close: 96.41, volume: 10059983 },
  { index: 172, timestamp: 1765377000, open: 95.73, high: 97.09, low: 92.2, close: 93.59, volume: 10080735 },
  { index: 173, timestamp: 1765463400, open: 89.2, high: 95.45, low: 86.7, close: 94.28, volume: 11896082 },
  { index: 174, timestamp: 1765549800, open: 93.31, high: 95.65, low: 86.2, close: 87.69, volume: 14990621 },
  { index: 175, timestamp: 1765809000, open: 88.1, high: 88.24, low: 80.0635, close: 81.14, volume: 17138596 },
  { index: 176, timestamp: 1765895400, open: 79.575, high: 81.56, low: 76.88, close: 80.95, volume: 13847810 },
  { index: 177, timestamp: 1765981800, open: 84.09, high: 84.3, low: 75.25, close: 75.45, volume: 17064073 },
  { index: 178, timestamp: 1766068200, open: 79.05, high: 80.35, low: 77.01, close: 78.09, volume: 10345822 },
  { index: 179, timestamp: 1766154600, open: 80.65, high: 90.54, low: 80.1601, close: 89.46, volume: 17558701 },
  { index: 180, timestamp: 1766413800, open: 92.97, high: 95.9, low: 91.1, close: 93.23, volume: 11303103 },
  { index: 181, timestamp: 1766500200, open: 90.31, high: 92.97, low: 88.31, close: 90.03, volume: 8885717 },
  { index: 182, timestamp: 1766586600, open: 90.23, high: 91.42, low: 88.65, close: 91.13, volume: 3338007 },
  { index: 183, timestamp: 1766759400, open: 91.51, high: 91.62, low: 86.74, close: 87.59, volume: 6234606 },
  { index: 184, timestamp: 1767018600, open: 84.45, high: 88.61, low: 84.29, close: 86.04, volume: 8076086 },
  { index: 185, timestamp: 1767105000, open: 86.375, high: 86.96, low: 84.56, close: 85.17, volume: 5802313 },
  { index: 186, timestamp: 1767191400, open: 85.37, high: 86.47, low: 82.9, close: 83.705, volume: 7055872 },
  { index: 187, timestamp: 1767364200, open: 86.985, high: 90.76, low: 86.01, close: 89.95, volume: 9099505 },
  { index: 188, timestamp: 1767623400, open: 95.0, high: 95.44, low: 90.89, close: 92.83, volume: 10025590 },
  { index: 189, timestamp: 1767709800, open: 95.715, high: 100.68, low: 90.94, close: 100.24, volume: 18739584 },
  { index: 190, timestamp: 1767796200, open: 99.01, high: 102.35, low: 95.56, close: 96.21, volume: 10185837 },
  { index: 191, timestamp: 1767882600, open: 96.79, high: 102.54, low: 96.0211, close: 97.3, volume: 12952014 },
  { index: 192, timestamp: 1767969000, open: 98.895, high: 104.97, low: 97.1, close: 97.93, volume: 11735268 },
  { index: 193, timestamp: 1768228200, open: 98.32, high: 108.6799, low: 96.55, close: 107.33, volume: 16033466 },
  { index: 194, timestamp: 1768314600, open: 107.33, high: 107.9499, low: 103.92, close: 105.43, volume: 10405206 },
  { index: 195, timestamp: 1768401000, open: 105.78, high: 106.6999, low: 99.383, close: 101.98, volume: 10468048 },
  { index: 196, timestamp: 1768487400, open: 104.555, high: 108.13, low: 101.1, close: 103.885, volume: 11190850 },
  { index: 197, timestamp: 1768573800, open: 105.995, high: 110.5, low: 100.71, close: 108.73, volume: 15674397 },
  { index: 198, timestamp: 1768919400, open: 101.83, high: 104.47, low: 98.34, close: 99.29, volume: 16768594 },
  { index: 199, timestamp: 1769005800, open: 101.09, high: 102.4, low: 93.1, close: 98.87, volume: 15470530 },
];

// ============================================================================
// PORTDIVE BRAND COLORS - LOCKED (DO NOT CHANGE)
// ============================================================================
const PORTDIVE_COLORS = {
  light: {
    bg: '#f8faf9',
    surface: '#ffffff',
    text: '#0a1a1f',
    textSecondary: '#4a5560',
    border: 'rgba(10, 26, 31, 0.1)',
    grid: 'rgba(10, 26, 31, 0.08)',
    hover: 'rgba(31, 163, 155, 0.08)',
  },
  dark: {
    bg: '#0a1a1f',
    surface: '#1a2a35',
    text: '#f8faf9',
    textSecondary: '#b0bcc4',
    border: 'rgba(248, 250, 249, 0.1)',
    grid: 'rgba(248, 250, 249, 0.08)',
    hover: 'rgba(31, 163, 155, 0.12)',
  },
  primary: '#1FA39B',
  secondary: '#FF6B6B',
  candleUp: '#1FA39B',
  candleDown: '#FF6B6B',
  volume: { up: 'rgba(31, 163, 155, 0.3)', down: 'rgba(255, 107, 107, 0.3)' },
  movingAverage: { fast: 'rgba(31, 163, 155, 0.5)', slow: 'rgba(168, 75, 47, 0.4)' },
  fibonacci: 'rgba(31, 163, 155, 0.3)',
  invalidation: '#FF6B6B',
  target: '#1FA39B',
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('portdive-theme');
      return saved ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem('portdive-theme', JSON.stringify(isDarkMode)); } catch {}
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);
  const theme = isDarkMode ? PORTDIVE_COLORS.dark : PORTDIVE_COLORS.light;
  return { isDarkMode, toggleTheme, theme };
};

// ============================================================================
// CURRENT PRICE CARD COMPONENT
// ============================================================================
const CurrentPriceCard = memo(({ price, change, target, theme, isDarkMode }) => {
  const progressToTarget = Math.min(((price - 18.31) / (target - 18.31)) * 100, 100);
  const isPositive = change >= 0;

  return (
    <div style={{
      background: isDarkMode ? 'linear-gradient(135deg, #1a2a35 0%, #0f1a1f 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f0f4f2 100%)',
      borderRadius: '12px',
      padding: '24px',
      border: `1px solid ${theme.border}`,
      marginBottom: '16px',
    }}>
      <div style={{ fontSize: '11px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 600 }}>
        Current Price
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontSize: '48px', fontWeight: 700, color: PORTDIVE_COLORS.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          ${price.toFixed(2)}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px',
          background: isPositive ? 'rgba(31, 163, 155, 0.15)' : 'rgba(255, 107, 107, 0.15)',
          color: isPositive ? PORTDIVE_COLORS.primary : PORTDIVE_COLORS.secondary,
          fontSize: '14px', fontWeight: 600,
        }}>
          {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <div style={{ height: '8px', background: theme.border, borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressToTarget}%`, height: '100%',
            background: `linear-gradient(90deg, ${PORTDIVE_COLORS.primary} 0%, rgba(31, 163, 155, 0.5) 100%)`,
            borderRadius: '4px', transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: theme.textSecondary }}>
          <span>{progressToTarget.toFixed(0)}% to Target</span>
          <span>Target: ${target.toFixed(2)}</span>
        </div>
      </div>
      <div style={{ marginTop: '12px', fontSize: '11px', color: theme.textSecondary }}>
        Today's Close • Jan 22, 2026
      </div>
    </div>
  );
});

// ============================================================================
// WAVE COUNT SELECTOR COMPONENT
// ============================================================================
const WaveCountSelector = memo(({ activeCount, onChange, theme }) => {
  const counts = [
    { id: 'primary', label: 'Primary', probability: '60%' },
    { id: 'alt1', label: 'Alt 3 Extension', probability: 'STUDIES' },
    { id: 'alt2', label: 'Alt#2', probability: '10%', sublabel: 'PANCROSS' },
    { id: 'minor', label: 'Minor', probability: '' },
  ];

  return (
    <div style={{ background: theme.surface, borderRadius: '12px', padding: '16px', border: `1px solid ${theme.border}`, marginBottom: '16px' }}>
      <div style={{ fontSize: '11px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 600 }}>
        Wave Count Selector
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {counts.map(count => (
          <button
            key={count.id}
            onClick={() => onChange(count.id)}
            aria-pressed={activeCount === count.id}
            style={{
              padding: '14px 12px', borderRadius: '8px',
              border: activeCount === count.id ? `2px solid ${PORTDIVE_COLORS.primary}` : `1px solid ${theme.border}`,
              background: activeCount === count.id 
                ? (count.id === 'alt1' ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' : 'rgba(31, 163, 155, 0.15)')
                : 'transparent',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: activeCount === count.id ? (count.id === 'alt1' ? '#fff' : PORTDIVE_COLORS.primary) : theme.text, fontWeight: 600, fontSize: '13px' }}>
                {count.label}
              </span>
              <span style={{ color: activeCount === count.id && count.id === 'alt1' ? 'rgba(255,255,255,0.8)' : theme.textSecondary, fontSize: '11px' }}>
                {count.probability}
              </span>
            </div>
            {count.sublabel && (
              <div style={{ fontSize: '9px', color: theme.textSecondary, marginTop: '2px' }}>{count.sublabel}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// FIBONACCI LEVELS PANEL
// ============================================================================
const FibonacciLevelsPanel = memo(({ currentPrice, theme }) => {
  const peak = 141.10;
  const low = 75.25;
  const range = peak - low;
  
  const levels = [
    { ratio: 0, price: peak, label: '0%' },
    { ratio: 0.236, price: peak - range * 0.236, label: '23.6%' },
    { ratio: 0.382, price: peak - range * 0.382, label: '38.2%' },
    { ratio: 0.5, price: peak - range * 0.5, label: '50%' },
    { ratio: 0.618, price: peak - range * 0.618, label: '61.8%' },
    { ratio: 0.786, price: peak - range * 0.786, label: '78.6%' },
    { ratio: 1, price: low, label: '100%' },
  ];

  const getCurrentLevel = () => {
    for (let i = 0; i < levels.length - 1; i++) {
      if (currentPrice <= levels[i].price && currentPrice > levels[i + 1].price) return i;
    }
    return levels.length - 1;
  };

  const currentLevelIdx = getCurrentLevel();

  return (
    <div style={{ background: theme.surface, borderRadius: '12px', padding: '16px', border: `1px solid ${theme.border}`, marginBottom: '16px' }}>
      <div style={{ fontSize: '11px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 600 }}>
        Fibonacci Levels
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {levels.map((level, idx) => {
          const isCurrentLevel = idx === currentLevelIdx;
          const isSolid = level.ratio === 0 || level.ratio === 1 || level.ratio === 0.618;
          
          return (
            <div key={level.label} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px',
              borderRadius: '4px', background: isCurrentLevel ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
            }}>
              <span style={{ width: '45px', fontSize: '11px', color: isCurrentLevel ? PORTDIVE_COLORS.secondary : theme.textSecondary, fontWeight: isCurrentLevel ? 600 : 400 }}>
                {level.label}
              </span>
              <div style={{
                flex: 1, height: '1px',
                background: isSolid ? PORTDIVE_COLORS.primary : `repeating-linear-gradient(90deg, ${PORTDIVE_COLORS.primary} 0px, ${PORTDIVE_COLORS.primary} 4px, transparent 4px, transparent 8px)`,
                opacity: isSolid ? 0.6 : 0.4,
              }} />
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: isCurrentLevel ? PORTDIVE_COLORS.secondary : theme.text, fontWeight: isCurrentLevel ? 600 : 400 }}>
                ${level.price.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ============================================================================
// ANALYSIS METRICS ROW
// ============================================================================
const AnalysisMetricsRow = memo(({ theme }) => {
  const metrics = [
    { label: 'Expected Value', value: '+45.2%', sublabel: 'MACD Divergence', indicator: true },
    { label: 'Sharpe Ratio', value: '2.1', sublabel: 'MACD Crossdown', color: 'gradient' },
    { label: 'Price Momentum', value: '-18%', sublabel: 'Risk-Adjusted', negative: true },
    { label: 'Risk', value: '-18%', sublabel: 'Probability-Weighted', negative: true },
  ];

  return (
    <div style={{ background: theme.surface, borderRadius: '12px', padding: '16px', border: `1px solid ${theme.border}`, marginBottom: '16px' }}>
      <div style={{ fontSize: '11px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 600 }}>
        Analysis Metrics
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
        {metrics.map((m, idx) => (
          <div key={idx} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(31, 163, 155, 0.05)' }}>
            <div style={{ fontSize: '10px', color: theme.textSecondary, textTransform: 'uppercase', marginBottom: '4px' }}>{m.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: m.negative ? PORTDIVE_COLORS.secondary : PORTDIVE_COLORS.primary }}>{m.value}</div>
            <div style={{ fontSize: '9px', color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {m.indicator && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: PORTDIVE_COLORS.primary }} />}
              {m.sublabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// TECHNICAL ALERTS PANEL
// ============================================================================
const TechnicalAlertsPanel = memo(({ theme }) => {
  const waves = [
    { label: 'WAVE 1', range: '$88.65 → $82.89', status: 'COMPLETE', color: PORTDIVE_COLORS.primary },
    { label: 'WAVE 3', range: '$86.00 → $0.00', status: 'IN PROGRESS', color: '#F59E0B' },
    { label: 'WAVE 3', range: '$85.95 → $71.78', status: 'PROJECTED', color: PORTDIVE_COLORS.secondary },
    { label: 'WAVE 5', range: '$72.65 → $93.00', status: 'PROJECTED', color: theme.textSecondary },
  ];

  return (
    <div style={{ background: theme.surface, borderRadius: '12px', padding: '16px', border: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: '11px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 600 }}>
        Technical Alerts
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        {waves.map((wave, idx) => (
          <div key={idx} style={{
            padding: '12px', borderRadius: '8px', background: `${wave.color}15`,
            borderLeft: `3px solid ${wave.color}`,
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: wave.color }}>{wave.label}</div>
            <div style={{ fontSize: '10px', color: theme.textSecondary, marginTop: '4px' }}>{wave.range}</div>
            <div style={{
              marginTop: '8px', fontSize: '9px', padding: '3px 8px', borderRadius: '4px',
              background: wave.color, color: '#fff', display: 'inline-block',
            }}>{wave.status}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '10px', color: theme.textSecondary }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '2px', background: theme.text }} /> Price
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '2px', background: PORTDIVE_COLORS.primary }} /> 20 SMA
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '2px', background: theme.textSecondary, opacity: 0.5 }} /> Minor
        </span>
      </div>
      <div style={{ marginTop: '10px', fontSize: '10px', color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PORTDIVE_COLORS.primary }} />
        #1 WMS PROGRESSION
      </div>
    </div>
  );
});

// ============================================================================
// CONTROL BUTTON COMPONENT
// ============================================================================
const ControlButton = memo(({ label, active, onClick, theme }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    style={{
      padding: '10px 16px', fontSize: '12px', fontWeight: 500, borderRadius: '8px',
      border: active ? `2px solid ${PORTDIVE_COLORS.primary}` : `1px solid ${theme.border}`,
      background: active ? 'rgba(31, 163, 155, 0.15)' : 'transparent',
      color: active ? PORTDIVE_COLORS.primary : theme.text,
      cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
    }}
  >
    {label}
  </button>
));

// ============================================================================
// CHART CANVAS COMPONENT
// ============================================================================
const ChartCanvas = memo(({ data, analysisState, theme, isDarkMode }) => {
  const W = 900, H = 450;
  const M = { t: 50, r: 80, b: 60, l: 65 };
  const cW = W - M.l - M.r;
  const cH = H - M.t - M.b - 50;
  const vH = 40;

  const processedData = useMemo(() => data.map(d => ({ ...d, date: new Date(d.timestamp * 1000) })), [data]);
  const pMin = useMemo(() => Math.min(...data.map(d => d.low)) * 0.92, [data]);
  const pMax = useMemo(() => Math.max(...data.map(d => d.high)) * 1.05, [data]);
  const vMax = useMemo(() => Math.max(...data.map(d => d.volume)), [data]);

  const priceToY = useCallback(p => M.t + cH * (1 - (p - pMin) / (pMax - pMin)), [pMin, pMax, cH]);
  const idxToX = useCallback(i => M.l + (i + 0.5) * (cW / data.length), [cW, data.length]);
  const candleW = Math.max(2, cW / data.length - 1.5);

  const calcMA = useCallback((period) => {
    const result = [];
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
      result.push({ idx: i, ma: sum / period });
    }
    return result;
  }, [data]);

  const ma50 = useMemo(() => calcMA(50), [calcMA]);
  const ma200 = useMemo(() => calcMA(200), [calcMA]);

  const wavePivots = useMemo(() => ({
    wave1Start: { idx: 1, price: 18.31 },
    wave1Peak: { idx: 58, price: 55.75 },
    wave2Low: { idx: 66, price: 43.89 },
    wave3Peak: { idx: 130, price: 141.10 },
    wave4Low: { idx: 177, price: 75.25 },
    minorIPeak: { idx: 197, price: 110.50 },
    minorIILow: { idx: 199, price: 93.10 },
  }), []);

  const fibLevels = useMemo(() => {
    const peak = 141.10, low = 75.25, range = peak - low;
    return [
      { ratio: 0, price: peak }, { ratio: 0.236, price: peak - range * 0.236 },
      { ratio: 0.382, price: peak - range * 0.382 }, { ratio: 0.5, price: peak - range * 0.5 },
      { ratio: 0.618, price: peak - range * 0.618 }, { ratio: 0.786, price: peak - range * 0.786 },
      { ratio: 1, price: low },
    ];
  }, []);

  const fibExtensions = useMemo(() => {
    const wave1Length = 55.75 - 18.31, wave4Low = 75.25;
    return [
      { ratio: 1.0, price: wave4Low + wave1Length * 1.0, label: '1.0×' },
      { ratio: 1.272, price: wave4Low + wave1Length * 1.272, label: '1.272×' },
      { ratio: 1.618, price: wave4Low + wave1Length * 1.618, label: '1.618×' },
    ];
  }, []);

  const priceGrid = [20, 40, 60, 80, 100, 120, 140].filter(p => p >= pMin && p <= pMax);
  
  const monthMarkers = useMemo(() => {
    const markers = [];
    let lastMonth = null;
    processedData.forEach((d, i) => {
      const month = d.date.getMonth();
      if (month !== lastMonth) {
        markers.push({ i, label: d.date.toLocaleDateString('en-US', { month: 'short' }) });
        lastMonth = month;
      }
    });
    return markers;
  }, [processedData]);

  const currentPrice = data[data.length - 1]?.close || 98.87;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ background: theme.surface, borderRadius: '12px', border: `1px solid ${theme.border}` }}>
      {/* Grid */}
      {priceGrid.map(p => (
        <g key={p}>
          <line x1={M.l} x2={W - M.r} y1={priceToY(p)} y2={priceToY(p)} stroke={theme.grid} strokeWidth="1" />
          <text x={M.l - 10} y={priceToY(p) + 4} textAnchor="end" fill={theme.textSecondary} fontSize="10" fontFamily="system-ui">${p}</text>
        </g>
      ))}

      {/* Month markers */}
      {monthMarkers.map(({ i, label }) => (
        <g key={`${label}-${i}`}>
          <line x1={idxToX(i)} x2={idxToX(i)} y1={M.t} y2={H - M.b} stroke={theme.grid} strokeWidth="1" strokeDasharray="4,8" />
          <text x={idxToX(i)} y={H - M.b + 25} textAnchor="middle" fill={theme.textSecondary} fontSize="10" fontFamily="system-ui">{label}</text>
        </g>
      ))}

      {/* Fibonacci Retracement */}
      {analysisState.showFibRetracements && fibLevels.map(({ ratio, price }) => {
        const y = priceToY(price);
        const isSolid = ratio === 0 || ratio === 1;
        const isKey = ratio === 0.618;
        return (
          <line key={`fib-${ratio}`} x1={M.l} x2={W - M.r} y1={y} y2={y}
            stroke={PORTDIVE_COLORS.primary} strokeWidth={isKey ? 1.5 : 1}
            strokeDasharray={isSolid ? '' : '6,4'} opacity={isKey ? 0.6 : 0.3} />
        );
      })}

      {/* Fibonacci Extensions */}
      {analysisState.showFibExtensions && fibExtensions.map(({ ratio, price, label }) => {
        const y = priceToY(price);
        if (y < M.t - 20) return null;
        return (
          <g key={`ext-${ratio}`}>
            <line x1={M.l} x2={W - M.r} y1={y} y2={y} stroke="#00D9D9" strokeWidth={ratio === 1.618 ? 1.5 : 1} strokeDasharray="8,4" opacity={0.4} />
            <text x={W - M.r + 5} y={y + 4} fill="#00D9D9" fontSize="9" fontFamily="system-ui">{label} ${price.toFixed(0)}</text>
          </g>
        );
      })}

      {/* Target band */}
      {analysisState.showTargetBand && (
        <rect x={M.l} y={priceToY(141)} width={cW} height={priceToY(130) - priceToY(141)} fill={PORTDIVE_COLORS.primary} opacity={0.08} />
      )}

      {/* Invalidation line */}
      {analysisState.showInvalidationLevel && (
        <g>
          <line x1={M.l} x2={W - M.r} y1={priceToY(75.25)} y2={priceToY(75.25)} stroke={PORTDIVE_COLORS.secondary} strokeWidth="2" strokeDasharray="10,5" opacity={0.8} />
          <text x={M.l + 5} y={priceToY(75.25) - 6} fill={PORTDIVE_COLORS.secondary} fontSize="10" fontWeight="600" fontFamily="system-ui">INVALIDATION $75.25</text>
        </g>
      )}

      {/* Moving Averages */}
      {ma50.length > 1 && (
        <path d={`M ${ma50.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(' L ')}`} fill="none" stroke={PORTDIVE_COLORS.movingAverage.fast} strokeWidth="1.5" />
      )}
      {ma200.length > 1 && (
        <path d={`M ${ma200.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(' L ')}`} fill="none" stroke={PORTDIVE_COLORS.movingAverage.slow} strokeWidth="1.5" />
      )}

      {/* Candlesticks */}
      {processedData.map((d, i) => {
        const x = idxToX(i);
        const isGreen = d.close >= d.open;
        const bodyColor = isGreen ? PORTDIVE_COLORS.candleUp : PORTDIVE_COLORS.candleDown;
        const yO = priceToY(d.open), yC = priceToY(d.close), yH = priceToY(d.high), yL = priceToY(d.low);
        return (
          <g key={i}>
            <line x1={x} y1={yH} x2={x} y2={yL} stroke={bodyColor} strokeWidth={1} />
            <rect x={x - candleW / 2} y={Math.min(yO, yC)} width={candleW} height={Math.max(Math.abs(yC - yO), 1)} fill={bodyColor} />
          </g>
        );
      })}

      {/* Wave lines */}
      {analysisState.showMotiveWaves && (
        <g>
          <path
            d={`M ${idxToX(wavePivots.wave1Start.idx)},${priceToY(wavePivots.wave1Start.price)}
                L ${idxToX(wavePivots.wave1Peak.idx)},${priceToY(wavePivots.wave1Peak.price)}
                L ${idxToX(wavePivots.wave2Low.idx)},${priceToY(wavePivots.wave2Low.price)}
                L ${idxToX(wavePivots.wave3Peak.idx)},${priceToY(wavePivots.wave3Peak.price)}
                L ${idxToX(wavePivots.wave4Low.idx)},${priceToY(wavePivots.wave4Low.price)}`}
            fill="none" stroke={PORTDIVE_COLORS.primary} strokeWidth="2" opacity="0.7" />
          
          {[
            { pivot: wavePivots.wave1Peak, label: '①', above: true },
            { pivot: wavePivots.wave2Low, label: '②', above: false },
            { pivot: wavePivots.wave3Peak, label: '③', above: true },
            { pivot: wavePivots.wave4Low, label: '④', above: false },
          ].map(({ pivot, label, above }) => (
            <g key={label}>
              <circle cx={idxToX(pivot.idx)} cy={priceToY(pivot.price) + (above ? -18 : 18)} r="12" fill={PORTDIVE_COLORS.primary} opacity="0.9" />
              <text x={idxToX(pivot.idx)} y={priceToY(pivot.price) + (above ? -14 : 22)} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">{label}</text>
            </g>
          ))}
        </g>
      )}

      {/* Minor waves */}
      {analysisState.showMinorWaves && (
        <g>
          <path
            d={`M ${idxToX(wavePivots.wave4Low.idx)},${priceToY(wavePivots.wave4Low.price)}
                L ${idxToX(wavePivots.minorIPeak.idx)},${priceToY(wavePivots.minorIPeak.price)}
                L ${idxToX(wavePivots.minorIILow.idx)},${priceToY(wavePivots.minorIILow.price)}
                L ${idxToX(data.length - 1)},${priceToY(currentPrice)}`}
            fill="none" stroke={PORTDIVE_COLORS.primary} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8" />
          <text x={idxToX(wavePivots.minorIPeak.idx)} y={priceToY(wavePivots.minorIPeak.price) - 10} textAnchor="middle" fill={PORTDIVE_COLORS.primary} fontSize="11" fontWeight="600">i</text>
          <text x={idxToX(wavePivots.minorIILow.idx)} y={priceToY(wavePivots.minorIILow.price) + 14} textAnchor="middle" fill={PORTDIVE_COLORS.primary} fontSize="11" fontWeight="600">ii</text>
        </g>
      )}

      {/* Volume */}
      <rect x={M.l} y={H - M.b - vH} width={cW} height={vH} fill={isDarkMode ? '#0f1a1f' : '#f0f4f2'} />
      {processedData.map((d, i) => {
        const x = idxToX(i);
        const h = (d.volume / vMax) * vH * 0.85;
        const isGreen = d.close >= d.open;
        return <rect key={`vol-${i}`} x={x - candleW / 2} y={H - M.b - h} width={candleW} height={h} fill={isGreen ? PORTDIVE_COLORS.volume.up : PORTDIVE_COLORS.volume.down} />;
      })}

      {/* Current price marker */}
      <g>
        <line x1={W - M.r - 50} x2={W - M.r} y1={priceToY(currentPrice)} y2={priceToY(currentPrice)}
          stroke={currentPrice >= data[data.length - 2]?.close ? PORTDIVE_COLORS.candleUp : PORTDIVE_COLORS.candleDown} strokeDasharray="3,3" />
        <rect x={W - M.r + 2} y={priceToY(currentPrice) - 12} width={60} height={24} rx="4"
          fill={currentPrice >= data[data.length - 2]?.close ? PORTDIVE_COLORS.candleUp : PORTDIVE_COLORS.candleDown} />
        <text x={W - M.r + 32} y={priceToY(currentPrice) + 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600" fontFamily="system-ui">
          ${currentPrice.toFixed(2)}
        </text>
      </g>

      {/* Logo watermark */}
      <g transform={`translate(${W - M.r - 55}, ${M.t + 8})`} opacity={0.3}>
        <circle cx="20" cy="20" r="18" fill="none" stroke={PORTDIVE_COLORS.primary} strokeWidth="2" />
        <text x="20" y="25" textAnchor="middle" fill={PORTDIVE_COLORS.primary} fontSize="14" fontWeight="700">PD</text>
      </g>

      {/* MA Legend */}
      <g transform={`translate(${M.l + 10}, ${M.t + 12})`}>
        <line x1="0" y1="0" x2="16" y2="0" stroke={PORTDIVE_COLORS.movingAverage.fast} strokeWidth="2" />
        <text x="22" y="4" fill={theme.textSecondary} fontSize="10" fontFamily="system-ui">50-MA</text>
        <line x1="70" y1="0" x2="86" y2="0" stroke={PORTDIVE_COLORS.movingAverage.slow} strokeWidth="2" />
        <text x="92" y="4" fill={theme.textSecondary} fontSize="10" fontFamily="system-ui">200-MA</text>
      </g>
    </svg>
  );
});

// ============================================================================
// WAVE TIMELINE COMPONENT
// ============================================================================
const WaveTimeline = memo(({ theme }) => {
  const waves = [
    { label: 'Wave 1', range: '$88.65 - $93.56', status: 'complete', color: PORTDIVE_COLORS.primary },
    { label: 'Wave 2', range: '$20.90 - $92.68', status: 'complete', color: PORTDIVE_COLORS.primary },
    { label: 'Wave 3', range: '$20.50 - $141.08', status: 'progress', color: '#F59E0B' },
    { label: 'Wave 5', range: '', status: 'projected', color: PORTDIVE_COLORS.secondary },
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
      {waves.map((wave, idx) => (
        <div key={idx} style={{
          flex: '1 0 auto', minWidth: '120px', padding: '12px', borderRadius: '8px',
          background: wave.status === 'progress' ? `${wave.color}15` : theme.surface,
          border: `1px solid ${wave.status === 'progress' ? wave.color : theme.border}`,
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: wave.color }}>{wave.label}</div>
          <div style={{ fontSize: '10px', color: theme.textSecondary, marginTop: '4px' }}>{wave.range}</div>
        </div>
      ))}
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function NBISElliottWaveChart() {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [activeWaveCount, setActiveWaveCount] = useState('primary');
  
  const [analysisState, setAnalysisState] = useState({
    showMotiveWaves: true, showMinorWaves: true, showAlt1: false, showAlt2: false,
    showFibRetracements: true, showFibExtensions: true, showInvalidationLevel: true, showTargetBand: true,
  });

  const toggleAnalysis = useCallback((key) => setAnalysisState(prev => ({ ...prev, [key]: !prev[key] })), []);

  const currentPrice = OHLCV_DATA[OHLCV_DATA.length - 1].close;
  const prevClose = OHLCV_DATA[OHLCV_DATA.length - 2].close;
  const priceChange = ((currentPrice - prevClose) / prevClose) * 100;
  const targetPrice = 135.83;

  return (
    <div style={{
      background: theme.bg, minHeight: '100vh', padding: '20px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', color: theme.text,
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke={PORTDIVE_COLORS.primary} strokeWidth="4" />
              <circle cx="35" cy="40" r="6" fill={PORTDIVE_COLORS.primary} />
              <circle cx="65" cy="40" r="6" fill={PORTDIVE_COLORS.primary} />
              <path d="M30 60 Q50 80 70 60" fill="none" stroke={PORTDIVE_COLORS.primary} strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '20px', fontWeight: 700, color: PORTDIVE_COLORS.primary }}>PortDive</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: theme.text }}>NBIS Elliott Wave Analysis</span>
              <span style={{ fontSize: '11px', padding: '3px 8px', background: theme.surface, borderRadius: '4px', color: theme.textSecondary, fontWeight: 500, border: `1px solid ${theme.border}` }}>1D</span>
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: theme.textSecondary }}>
              Apr 2025 → Jan 2026 | Target: ${targetPrice.toFixed(2)} | ATH: $141.10
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px 16px', borderRadius: '8px', background: PORTDIVE_COLORS.primary,
            color: '#fff', fontSize: '16px', fontWeight: 700,
          }}>
            ${currentPrice.toFixed(2)}
          </div>
          <button onClick={toggleTheme} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              padding: '10px 16px', borderRadius: '8px', border: `1px solid ${theme.border}`,
              background: theme.surface, color: theme.text, cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease',
            }}>
            {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      {/* Control Panel */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', padding: '14px',
        background: theme.surface, borderRadius: '12px', border: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <ControlButton label="Motive Waves" active={analysisState.showMotiveWaves} onClick={() => toggleAnalysis('showMotiveWaves')} theme={theme} />
          <ControlButton label="Minor Waves" active={analysisState.showMinorWaves} onClick={() => toggleAnalysis('showMinorWaves')} theme={theme} />
        </div>
        <div style={{ width: '1px', background: theme.border, margin: '0 6px' }} />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <ControlButton label="Fib Retracements" active={analysisState.showFibRetracements} onClick={() => toggleAnalysis('showFibRetracements')} theme={theme} />
          <ControlButton label="Fib Extensions" active={analysisState.showFibExtensions} onClick={() => toggleAnalysis('showFibExtensions')} theme={theme} />
        </div>
        <div style={{ width: '1px', background: theme.border, margin: '0 6px' }} />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <ControlButton label="Invalidation $75.25" active={analysisState.showInvalidationLevel} onClick={() => toggleAnalysis('showInvalidationLevel')} theme={theme} />
          <ControlButton label="Target Band" active={analysisState.showTargetBand} onClick={() => toggleAnalysis('showTargetBand')} theme={theme} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Chart Section */}
        <div style={{ flex: '1 1 62%', minWidth: '320px' }}>
          <ChartCanvas data={OHLCV_DATA} analysisState={analysisState} theme={theme} isDarkMode={isDarkMode} />
          <div style={{ marginTop: '16px' }}>
            <WaveTimeline theme={theme} />
          </div>
        </div>

        {/* Info Panel */}
        <div style={{ flex: '1 1 32%', minWidth: '300px', maxWidth: '380px' }}>
          <CurrentPriceCard price={currentPrice} change={priceChange} target={targetPrice} theme={theme} isDarkMode={isDarkMode} />
          <WaveCountSelector activeCount={activeWaveCount} onChange={setActiveWaveCount} theme={theme} />
          <FibonacciLevelsPanel currentPrice={currentPrice} theme={theme} />
          <AnalysisMetricsRow theme={theme} />
          <TechnicalAlertsPanel theme={theme} />
        </div>
      </div>

      {/* Footer Legend */}
      <footer style={{
        marginTop: '24px', padding: '16px', background: theme.surface, borderRadius: '12px',
        border: `1px solid ${theme.border}`, display: 'flex', flexWrap: 'wrap', gap: '20px',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '18px', height: '3px', background: PORTDIVE_COLORS.primary, borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: theme.textSecondary }}>Primary (60%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '18px', height: '3px', background: PORTDIVE_COLORS.secondary, borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: theme.textSecondary }}>Alt #1 (30%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '18px', height: '3px', background: '#00D9D9', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: theme.textSecondary }}>Extensions</span>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: theme.textSecondary }}>
          <span style={{ color: theme.text, fontWeight: 500 }}>Target:</span> $135.83 (1.618×) | 
          <span style={{ color: PORTDIVE_COLORS.secondary, fontWeight: 500, marginLeft: '8px' }}>Invalidation:</span> $75.25
        </div>
      </footer>

      <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', color: theme.textSecondary }}>
        PortDive Elliott Wave Analysis • {OHLCV_DATA.length} daily candles • Last updated: Jan 22, 2026
      </div>
    </div>
  );
}
