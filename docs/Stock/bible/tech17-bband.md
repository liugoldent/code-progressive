---
description: 技術分析：布林通道 - BBand
tags:
  - stock
  - technicalAnalysis
keywords: [布林通道, 布林通道如何使用, BBand, BBand如何使用, 技術分析]
---

# [技術分析] 布林通道 - BBand

## 全名 & 提出者
* Boll - Bollinger on Bollinger Bands
* 提出者：John Bollinger

## 重點筆記
* σ：標準差：standard deviation 
* 意義在於：在股價走勢圖價格結構上建立的帶狀BBands
* 功能在於：將高低價提供相對的定義
  * 位在帶狀上限20MA+2σ附近稱高價
  * 在帶狀下限附近20MA-2σ稱為低價
* 中心線為20MA均線。而上下限的標準差，就是2σ
* 傳統參數有三種
  * 10MA+1.5σ or +1.9σ
  * 20MA+2σ
  * 50MA+2.5σ or +2.1σ
* 衍生指標：%b指標、帶狀寬度指標bands width
  * %b指標
    * 代表現在價格與帶狀之間的位置關係
    * 可以配合其他指標運用，或者辨識型態與作為判斷牛市背離的功能
  * 帶狀寬度
    * 告訴投資人帶狀寬度資訊。為辨識擠壓的重要資訊，有助於判斷趨勢的開始or結束。
    * 在強勁的漲勢中，一但帶狀下限向上反轉，往往代表這段漲勢要結束了
    * 一但帶狀寬度增加速度趨緩，甚至寬度開始縮小，代表趨勢有機會結束了



## 應用原則
* 使用情況主要有三種
  * 帶狀寬度縮小，隨後經常會爆發激烈價格走勢
  * 價格穿越帶狀，既有趨勢應該會延續
  * 價格由外往內超越帶狀後，價格本身形成反轉，趨勢有可能轉變（可配合KD、MACD、RSI、KST）
* 「帶狀寬度」一般交易法則
  * 一但穿越帶狀上限則買進，價格跌破帶狀下限則放空
* 「帶狀寬度」順勢交易法則  
  * 建議當價格接近帶狀上限時，而且上漲力道經過技術指標確認，順勢買進
  * 當價格接近帶狀下限時，而且下跌力道經過技術指標確認，順勢賣出
  * 屬於買進強者，賣出弱者
  * %b指標讀數大於0.8，代表買進
  * %b指標讀數小於0.3，代表賣出
* 「帶狀寬度」逆勢操作法則
  * 當價格帶在帶狀下限附近，透過W底型態與技術指標釐清結構而買進
  * 在觸及上軌時，透過M頭型態，與技術指標釐清結構轉弱而賣出
  * %b < 0.05 則代表買進
  * %b > 0.95 則賣出
* %b指標提供協助建立交易系統，建立交易訊號
* bands width：提供帶狀方面相對資訊，可以用來辨識擠壓
  * 也可辨識其他資訊：判定連續趨勢、界定橫向交易區間、辨識擠壓狀況
* bands width型態辨識：
  * W底的第一個低點通常會落到下軌之外，但是第二個低點不會跌破帶狀下軌
  * 第一波跌勢成交量大於第二波跌勢
* 價格突破系統：
  * 採用帶狀寬度指標設定前提條件後，然後等待突破發生時建立部位。
  * 當價格觸及上軌，可以做為空頭部位出場訊號。當價格碰觸下軌，可以作為多頭部位出場訊號


## 優點
* 結合傳統長條圖&K線圖的優點
* 20天期的MA參數，是很好的著手點
* 使用20MA+-2σ、10MA+-1.5σ、50MA+-2.5σ，績效差不多，也顯示此指標的穩定性
* 使用日線圖or10分鐘走勢圖，或其他區間，結果沒有太大差異
* 可以尋找風險、報酬性質絕佳的機會
* 以簡單平均線計算價格波動率，藉以設定寬度，所以採用相同方法來設定中心點，似乎比較具備內在一至性。如果採用指數，有機會增添一項內在或沒有考慮的外在因素
* 嚴格來說，金融市場沒有明顯循環，但是價格波動率確實有明顯循環，可以透過循環來預測。
* 對於典型的M頭orW底，在一般頭部或底型型態中，動能峰谷可能穿越上下軌，但第二峰位谷底就會在帶狀內
* 國內有人採用20MA+-2σ & 20MA+-1σ當作上下限參考點

## 缺點
* 採用非常短期的走勢圖，經常也會不當縮短帶狀寬度，或許使因為這些人將bband視為一種價格波動系統
* +-2σ可以涵蓋約88%的價格，但無法覆蓋全部。要覆蓋全部可以使用STARC-平均區間通道指標

## 使用限制
* +-2σ只能涵蓋88%的股價資料點
* %b指標是一種相對工具，沒有辦法提供絕對資訊，只能顯示當時情況在上下軌的相對位置。

## 結論
* 2個標準差涵蓋88%的資料點
* 如果將天數改為10day，標準差將需要減少到1.9，並且使用小時走勢圖，以收盤價突破上限為買進時機，收盤價突破下限為賣出時機
* 如果延長到50day，標準差需要增加到2.1
* 主要是利用此指標來達到底部反轉or擴張反轉現象，找到反轉趨勢。

## 實證
* 20MA+-2σ最佳
* 10MA+-1.9σ比10MA+-1.5σ好
* 50MA+-2.5σ比50MA+-2.1σ好
* %b>1.1時，賣出持股，有極高機率之後下跌
* %b<0，買進持股，有極高機率之後上漲
* bands width
  * 25以上，超買時賣出持股，高機率之後下跌
  * 3以下，超賣時買進持股，高機率之後上漲
* 辨識型態
  * W底
    * 第一個低點會觸及下軌
    * 反彈過程中，價格會回到區間，正常還會穿越中心線
    * 接著在價格拉回時重新測試先前底部的過程，但是不會跌出嚇鬼
    * 故可以判斷是否為W底orM頭
  * 頭肩頂
    * 左肩通常會穿越上軌，頭部則會觸及上軌
    * 右肩則不會到達中心點附近（理想情況右肩的頸線，應該在帶狀中心點附近）
    * 貫穿的第一波跌勢應該在下軌停頓
    * 折返漲勢通常會在中心線停下，待在頸線被壓回之後，第二波跌勢會穿越帶狀下軌
  * 漫步帶中
    * 通常觸及上限or下限，本身不代表任何交易訊號
    * 可用其他指標判斷

