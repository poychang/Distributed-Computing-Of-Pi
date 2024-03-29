# 分散式計算 π

這個範例專案展示了如何使用瀏覽器分散式計算來估計 π 的值，瀏覽器端計算的**樣本數**和**落在圓內的點數**，將會被傳送到伺服器端進行加總，最後將全域的**樣本數**和**落在圓內的點數**做最終計算，最後得到更精準的 π 估計值。

## 蒙特卡羅方法

計算 π 的方法有很多，若是要利用瀏覽器分散式計算，可以選擇適合於大量獨立運行且易於分割任務的蒙特卡羅方法 (Monte Carlo Method)

蒙特卡羅方法是一種利用隨機數來估計數值解的方法，特別適用於 π 的計算。這個方法的基本思想是隨機地生成點在一個正方形內，然後計算落在內切圓內的點的比例，這個比例與 π 有關。

- 優點：易於實現，特別適合於分散式或並行處理，因為每次的點生成和判斷都是獨立的
- 缺點：準確度與隨機數的數量有很大關係，需要非常大量的數據才能達到較高的準確度

蒙特卡羅方法的基本思想是隨機生成一對點`(x,y)`，看這些點是否落在單位圓內。具體來說，單位圓的方程是 `x^2 + y^2 = 1`。我們可以通過計算落在圓內的點與總點數的比例，然後乘以 4 來估計 π 的值，因為落在四分之一單位圓內的點佔正方形的比例可以推導出 π/4。

以下是一個使用 C# 實現蒙特卡羅方法的基本範例：

```csharp
using System;

class Program
{
    static void Main()
    {
        int totalPoints = 1_000_000; // 總點數
        int pointsInsideCircle = 0;

        Random random = new Random();

        for (int i = 0; i < totalPoints; i++)
        {
            // 生成一個隨機點 (x,y)，範圍在 [0,1)
            double x = random.NextDouble();
            double y = random.NextDouble();

            // 檢查點是否落在單位圓內
            if (x * x + y * y <= 1)
            {
                pointsInsideCircle++;
            }
        }

        // 計算 pi 的估計值
        double piEstimate = 4.0 * pointsInsideCircle / totalPoints;

        Console.WriteLine($"Estimate of PI: {piEstimate}");
    }
}
```

這段程式定義了一個總點數，這裡假設是一百萬，然後使用 Random 類生成隨機點。接著，對於每個點，程序檢查它是否落在單位圓內，並基於這些點計算 π 的一個估計值。可以根據需要調整 `totalPoints` 的值，以找到準確度和計算時間之間的最佳平衡點。
