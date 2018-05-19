# -*- coding: utf-8 -*-
"""
Created on Mon Apr 30 15:08:14 2018

@author: aga
"""

import csv
import os
import json
import pymysql
import DataCollectUtil as util
from openpyxl import load_workbook
import warnings

def CreateHeader():
    header = {}
    header["gender"] = [{"id":0,"name":"姓別無資料"},
          {"id":1,"name":"男"},{"id":2,"name":"女"}]
    header["age"] = [{"id":0,"name":"年齡無資料","minAge":0,"maxAge":0},
       {"id":1,"name":"20-24歲","minAge":20,"maxAge":24},
       {"id":2,"name":"25-29歲","minAge":25,"maxAge":29},
       {"id":3,"name":"30-34歲","minAge":30,"maxAge":34},
       {"id":4,"name":"35-39歲","minAge":35,"maxAge":39},
       {"id":5,"name":"40-44歲","minAge":40,"maxAge":44},
       {"id":6,"name":"45-49歲","minAge":45,"maxAge":49},
       {"id":7,"name":"50-54歲","minAge":50,"maxAge":54},
       {"id":8,"name":"55-59歲","minAge":55,"maxAge":59},
       {"id":9,"name":"60-64歲","minAge":60,"maxAge":64},
       {"id":10,"name":"65-69歲","minAge":65,"maxAge":69},
       {"id":11,"name":"70-74歲","minAge":70,"maxAge":74},
       {"id":12,"name":"75-79歲","minAge":75,"maxAge":79},
       {"id":13,"name":"80歲以上","minAge":80,"maxAge":100}]

    header["county"] = [{"id":0,"name":"縣市無資料"},
       {"id":1,"name":"臺北市"},{"id":2,"name":"新北市"},
       {"id":3,"name":"基隆市"},{"id":4,"name":"桃園市"},
       {"id":5,"name":"新竹縣"},{"id":6,"name":"新竹市"},
       {"id":7,"name":"苗栗縣"},{"id":8,"name":"臺中市"},
       {"id":9,"name":"彰化縣"},{"id":10,"name":"南投縣"},
       {"id":11,"name":"雲林縣"},{"id":12,"name":"嘉義縣"},
       {"id":13,"name":"嘉義市"},{"id":14,"name":"臺南市"},
       {"id":15,"name":"高雄市"},{"id":16,"name":"屏東縣"},
       {"id":17,"name":"宜蘭縣"},{"id":18,"name":"花蓮縣"},
       {"id":19,"name":"臺東縣"},{"id":20,"name":"澎湖縣"},
       {"id":21,"name":"金門縣"},{"id":22,"name":"連江縣"}]
    
    header["living"] = [
       {"id":0,"name":"居住無資料"},{"id":1,"name":"自己一個人住"},
       {"id":2,"name":"與親友同住"},{"id":3,"name":"養老院、養老住宅"}]
    
    header["lang"] = [
        {"id":0,"name":"語言無資料"},
        {"id":1,"name":"國語"},
        {"id":2,"name":"台語"},
        {"id":3,"name":"客語"}]
    
    header["livewith"] = [
        {"id":"liv_w_parents","name":"父母"},
        {"id":"liv_w_hw","name":"伴侶"},
        {"id":"liv_w_kid","name":"子女"},
        {"id":"liv_w_grandk","name":"孫子女"},
        {"id":"liv_w_others","name":"其他親友"}]
    
    header["need"] = [
        {"id":"n3_health_risk","name":"健康風險預告"},
        {"id":"n3_eat_nutri","name":"吃得營養健康"},
        {"id":"n3_med_diagno","name":"有效就醫診斷"},
        {"id":"n3_safe_drive","name":"安全騎車開車"},
        {"id":"n3_safe_walk","name":"輕鬆安全行走"},
        {"id":"n3_conv_transp","name":"方便大眾運輸"},
        {"id":"n3_learn_activ","name":"交流學習活動"},
        {"id":"n3_aging_travel","name":"適合長者旅遊環境"},
        {"id":"n3_self_living","name":"自己打理生活"},
        {"id":"n3_tech_learn","name":"學習數位科技"}]
    
    #健康風險預告
    header["need"][0]["risk"] = [
        {"id":"health_risk1","name":"我常忘記量血壓什麼的，資料不完整就沒用，健康手環也會忘記戴。",
         "solution":[
            {"id":"h_r1_s1","name":"手機定時提醒量測"},
            {"id":"h_r1_s2","name":"日常配戴首飾就有量測功能"},
            {"id":"h_r1_s3","name":"社區內有護理師幫忙量測、紀錄"},
            {"id":"h_r1_s4","name":"有專人打電話提醒量測"}]
         },
        {"id":"health_risk2","name":"就算測量到健康數字異常，若沒有人知道，就不會來關心我。",
         "solution":[
            {"id":"h_r2_s1","name":"健康量測結果用顏色表達警示"},
            {"id":"h_r2_s2","name":"健康量測結果用圖片顯示身體狀況"},
            {"id":"h_r2_s3","name":"健康量測結果有專家幫忙分析解說"}]
         },
        {"id":"health_risk3","name":"運動過量或動作不對就會受傷，我都不敢亂做運動。",
         "solution":[
            {"id":"h_r3_s1","name":"健康量測設備會把數據傳給家人"},
            {"id":"h_r3_s2","name":"健康量測設備可選擇要分享的量測結果"},
            {"id":"h_r3_s3","name":"健康量測設備可提醒家人關心長輩"},
            {"id":"h_r3_s4","name":"有護理師定期關心健康狀況"}]
         },
        {"id":"health_risk4","name":"運動過量或動作不對就會受傷，我都不敢亂做運動。",
         "solution":[
            {"id":"h_r4_s1","name":"專家在旁指導正確運動姿勢"},
            {"id":"h_r4_s2","name":"有專家可請教合適的運動組合"},
            {"id":"h_r4_s3","name":"健康設備有運動過量的警告"},
            {"id":"h_r4_s4","name":"健康設備可分析個人最適運動量"}]
         },
        {"id":"health_risk5","name":"看到自己的健康數字異常，卻不知道怎麼做才能改善健康。",
         "solution":[
            {"id":"h_r5_s1","name":"健康量測設備，有作息改善建議"},
            {"id":"h_r5_s2","name":"健康量測設備，有飲食改善建議"},
            {"id":"h_r5_s3","name":"健康量測設備，有運動改善建議"},
            {"id":"h_r5_s4","name":"健康量測設備，有不當飲食作息警示"}]
         },
        {"id":"health_risk6","name":"身體突然不舒服，我不會自救，也無法通知別人來救我。",
         "solution":[
            {"id":"h_r6_s1","name":"健康偵測配備要給予自救建議"},
            {"id":"h_r6_s2","name":"健康偵測配備能發出警報請路人協助"},
            {"id":"h_r6_s3","name":"健康偵測配備有定位系統直接通報醫院"},
            {"id":"h_r6_s4","name":"健康偵測配備有定位系統自動通報家人"}]
         }]
         
    #吃得營養健康
    header["need"][1]["risk"] = [
        {"id":"eat_nutri1","name":"年紀大有很多不能吃的，跟別人一起吃飯好像會給人添麻煩。",
         "solution":[
            {"id":"e_n1_s1","name":"補充長輩營養所需的食材包"},
            {"id":"e_n1_s2","name":"添加營養素的正餐配菜或點心"},
            {"id":"e_n1_s3","name":"滿足長輩營養所需的套餐"},
            {"id":"e_n1_s4","name":"適合長輩的專用食譜"}]
         },
        {"id":"eat_nutri2","name":"一兩個人吃只能簡單煮、很難營養均衡。",
         "solution":[
            {"id":"e_n2_s1","name":"小份量的各式食材包"},
            {"id":"e_n2_s2","name":"添加營養素的正餐配菜或點心"},
            {"id":"e_n2_s3","name":"加熱即可食用的營養套餐"},
            {"id":"e_n2_s4","name":"社區開設共食餐廳"}]
         },
        {"id":"eat_nutri3","name":"不知道怎麼吃才夠營養，又不會過量。",
         "solution":[
            {"id":"e_n3_s1","name":"長輩營養所需的綜合食材包"},
            {"id":"e_n3_s2","name":"補充長輩營養所需的食材包"},
            {"id":"e_n3_s3","name":"身體偵測提醒缺少的營養素"},
            {"id":"e_n3_s4","name":"營養師諮詢個人專屬的食譜"}]
         },
        {"id":"eat_nutri4","name":"蔬果看不出有沒有農藥污染，吃得不安心。",
         "solution":[
            {"id":"e_n4_s1","name":"便宜的有機蔬果"},
            {"id":"e_n4_s2","name":"可清除農藥的洗劑"},
            {"id":"e_n4_s3","name":"簡易家用殘留農藥測試"},
            {"id":"e_n4_s4","name":"可靠的農產品安心標章"}]
         },
        {"id":"eat_nutri5","name":"年紀大反應變慢，在廚房煮菜變得比較危險。",
         "solution":[
            {"id":"e_n5_s1","name":"洗切妥當的食材包"},
            {"id":"e_n5_s2","name":"加熱即可食用的營養套餐"},
            {"id":"e_n5_s3","name":"社區開設共食餐廳"},
            {"id":"e_n5_s4","name":"用預熱過的食材來料理，減少時間和步驟"}]
         },
        {"id":"eat_nutri6","name":"煮飯有夠麻煩，菜色要有變化，又要兼顧營養。",
         "solution":[
            {"id":"e_n6_s1","name":"小份量的各式食材包"},
            {"id":"e_n6_s2","name":"菜色多樣的加熱即食套餐"},
            {"id":"e_n6_s3","name":"滿足營養需求的多樣食譜"},
            {"id":"e_n6_s4","name":"社區開設共食餐廳"}]
         }]
         
    #有效就醫診斷
    header["need"][2]["risk"] = [
        {"id":"med_diagno1","name":"身體不舒服要去看醫生，光要找對科別掛號就很難。",
         "solution":[
            {"id":"m_d1_s1","name":"就醫諮詢電話"},
            {"id":"m_d1_s2","name":"社區就醫諮詢中心"},
            {"id":"m_d1_s3","name":"社區醫生問診轉介專科醫生"}]
         },
        {"id":"med_diagno2","name":"小病小痛不檢查不放心，怕醫生覺得小題大作，我自己又很難判斷。",
         "solution":[
            {"id":"m_d2_s1","name":"社區設立健康諮詢中心"},
            {"id":"m_d2_s2","name":"醫生護理師巡迴簡易問診"}]
         },
        {"id":"med_diagno3","name":"讓身體不舒服的原因太多，醫生說不確定，我自己也找不出原因。",
         "solution":[
            {"id":"m_d3_s1","name":"生活作息偵測裝置"},
            {"id":"m_d3_s2","name":"配戴身體狀態偵測裝置"},
            {"id":"m_d3_s3","name":"家中安裝環境偵測裝置"},
            {"id":"m_d3_s4","name":"社區安裝環境偵測裝置"}]
         },
        {"id":"med_diagno4","name":"從候診、檢查到拿藥，每一關都要花時間等待。",
         "solution":[
            {"id":"m_d4_s1","name":"醫院主動通知等候進度"},
            {"id":"m_d4_s2","name":"社區設立檢驗中心"},
            {"id":"m_d4_s3","name":"有自助結帳機器"},
            {"id":"m_d4_s4","name":"在住家附近藥局取藥"}]
         },
        {"id":"med_diagno5","name":"年紀大記性沒有以前好，醫生給的建議回家就忘記。",
         "solution":[
            {"id":"m_d5_s1","name":"醫囑錄音"},
            {"id":"m_d5_s2","name":"醫囑印在藥袋上"},
            {"id":"m_d5_s3","name":"醫囑傳送給家屬"},
            {"id":"m_d5_s4","name":"專人陪伴就醫，協助記錄醫囑"}]
         },
        {"id":"med_diagno6","name":"醫生叮嚀的健康生活習慣，要立刻做到真的很困難。",
         "solution":[
            {"id":"m_d6_s1","name":"隨身配戴生活作息偵測與提醒器"},
            {"id":"m_d6_s2","name":"偵測與提醒喝水量的水杯"},
            {"id":"m_d6_s3","name":"偵測與警示不良姿勢的座椅"}]
         }]
         
    #安全騎車開車
    header["need"][3]["risk"] = [
        {"id":"safe_drive1","name":"適合長輩的電動車看起來安全，但坐上去就像不會走的老人。",
         "solution":[
            {"id":"s_d1_s1","name":"機車造型般的三或四輪車"},
            {"id":"s_d1_s2","name":"不像輪椅的座椅造型"}]
         },
        {"id":"safe_drive2","name":"騎車時反應比較慢，經常被其他汽機車嫌。",
         "solution":[
            {"id":"s_d2_s1","name":"有語音導航系統的安全帽"},
            {"id":"s_d2_s2","name":"機車自動駕駛"},
            {"id":"s_d2_s3","name":"危險路段語音提醒"},
            {"id":"s_d2_s4","name":"道路標示加大、加亮"}]
         },
        {"id":"safe_drive3","name":"年紀大就怕駕車途中，人不舒服或突然病發。",
         "solution":[
            {"id":"s_d3_s1","name":"汽機車有駕駛人生理監控"},
            {"id":"s_d3_s2","name":"汽機車有駕駛人生理異常警示"},
            {"id":"s_d3_s3","name":"汽機車自動駕駛"},
            {"id":"s_d3_s4","name":"汽機車可發出警報請附近路人協助"}]
         },
        {"id":"safe_drive4","name":"未來有自動駕駛幫我開車，要是我和它的判斷不一樣，會很混亂。",
         "solution":[
            {"id":"s_d4_s1","name":"汽車自動駕駛使用訓練"},
            {"id":"s_d4_s2","name":"汽車學習駕駛人的習慣"},
            {"id":"s_d4_s3","name":"專人即時諮詢服務"}]
         },
        {"id":"safe_drive5","name":"搬動機車好吃力，一不小心可能閃到腰、拉傷手。",
         "solution":[
            {"id":"s_d5_s1","name":"機車車體輕量化"},
            {"id":"s_d5_s2","name":"電動輔助移車系統"},
            {"id":"s_d5_s3","name":"足夠的機車停車格"}]
         },
        {"id":"safe_drive6","name":"想更快知道突發路況，一邊開車一邊看導航，反而更危險。",
         "solution":[
            {"id":"s_d6_s1","name":"導航系統自動提示路況"},
            {"id":"s_d6_s2","name":"導航系統自動建議換路"}]
         }]
         
    #輕鬆安全行走
    header["need"][4]["risk"] = [
        {"id":"safe_walk1","name":"穿裙子或短褲就會露出護膝，別人看到就知道我老了膝蓋沒力。",
         "solution":[
            {"id":"s_w1_s1","name":"美觀的輔具"},
            {"id":"s_w1_s2","name":"有支撐功能的長褲"},
            {"id":"s_w1_s3","name":"不像傳統拐杖的輔具"},
            {"id":"s_w1_s4","name":"有輔助行走功能的鞋襪"}]
         },
        {"id":"safe_walk2","name":"出門要帶好多東西，加上買菜、購物就提不太動，上下樓梯好費力。",
         "solution":[
            {"id":"s_w2_s1","name":"可上下樓梯的購物推車"},
            {"id":"s_w2_s2","name":"公寓增設樓梯升降椅"},
            {"id":"s_w2_s3","name":"自動跟隨購物車"},
            {"id":"s_w2_s4","name":"專人陪同採買和提重物"}]
         },
        {"id":"safe_walk3","name":"人行道停機車、堆東西路面不平，我得小心走路免得發生意外。",
         "solution":[
            {"id":"s_w3_s1","name":"巷弄夜間照明"},
            {"id":"s_w3_s2","name":"政府鋪平行人專用道"},
            {"id":"s_w3_s3","name":"高低差警示裝置"},
            {"id":"s_w3_s4","name":"政府規定人行道淨空"}]
         },
        {"id":"safe_walk4","name":"如果有天得坐輪椅，外出還得要挑裝得下也願意載輪椅的交通工具。",
         "solution":[
            {"id":"s_w4_s1","name":"小轎車的後行李箱加大"},
            {"id":"s_w4_s2","name":"可輪椅直入的後座空間"},
            {"id":"s_w4_s3","name":"自動折疊功能的輪椅、代步車"},
            {"id":"s_w4_s4","name":"收合超小型輪椅"}]
         },
        {"id":"safe_walk5","name":"我擔心更老以後，走動得用助行器，可是家裡空間和動線不太方便。",
         "solution":[
            {"id":"s_w5_s1","name":"居家用輕便助行輔具"},
            {"id":"s_w5_s2","name":"家事機器人"},
            {"id":"s_w5_s3","name":"將家裡改造成無障礙空間"},
            {"id":"s_w5_s4","name":"不用走動操作就能自動運作的家電"}]
         }]
         
    #方便大眾運輸
    header["need"][5]["risk"] = [
        {"id":"conv_transp1","name":"公車時間沒抓準，車子跑掉要等很久，還沒搭車就覺得疲累。",
         "solution":[
            {"id":"c_t1_s1","name":"社區到車站的巡迴接駁車"},
            {"id":"c_t1_s2","name":"隨招隨停的車站接駁車"},
            {"id":"c_t1_s3","name":"方便短程移動的代步工具"},
            {"id":"c_t1_s4","name":"可預約的短程接駁"}]
         },
        {"id":"conv_transp2","name":"遇到沒有電扶梯的出入口，要繞路搭電梯或走樓梯，吃力又怕跌倒。",
         "solution":[
            {"id":"c_t2_s1","name":"每個車站出口增設電扶梯"},
            {"id":"c_t2_s2","name":"清楚的電扶梯標示"},
            {"id":"c_t2_s3","name":"專人指引最佳路線"}]
         },
        {"id":"conv_transp3","name":"坐在公車、客運上的時間一長，擔心突然想上廁所怎麼辦。",
         "solution":[
            {"id":"c_t3_s1","name":"公車上增設廁所"},
            {"id":"c_t3_s2","name":"公車站增設廁所"},
            {"id":"c_t3_s3","name":"標出車站附近友善廁所店家"},
            {"id":"c_t3_s4","name":"公廁增加適合長輩的設備"}]
         },
        {"id":"conv_transp4","name":"一起坐計程車可以省錢，可是要跟陌生人一起坐會怕怕的。",
         "solution":[
            {"id":"c_t4_s1","name":"可預約的共乘車"},
            {"id":"c_t4_s2","name":"有政府或企業背書的共乘服務"},
            {"id":"c_t4_s3","name":"有媒合的共乘服務中心"}]
         },
        {"id":"conv_transp5","name":"子女不准我再開車，只好學搭大眾交通工具，出門一趟不容易。",
         "solution":[
            {"id":"c_t5_s1","name":"長途共乘服務中心"},
            {"id":"c_t5_s2","name":"大眾交通工具轉接協助"}]
         },
        {"id":"conv_transp6","name":"年輕人說用手機叫車很方便，我總是學不會。",
         "solution":[
            {"id":"c_t6_s1","name":"簡單友善的交通APP"},
            {"id":"c_t6_s2","name":"晚輩可替長輩遠端叫車的APP"},
            {"id":"c_t6_s3","name":"一鍵叫車的簡易設備"}]
         }]
         
    #交流學習活動
    header["need"][6]["risk"] = [
        {"id":"learn_activ1","name":"家人常不在身邊，我常找不到人可以說說話。",
         "solution":[
            {"id":"l_a1_s1","name":"陪伴機器人"},
            {"id":"l_a1_s2","name":"陪聊天客服"},
            {"id":"l_a1_s3","name":"鄰里社區活動中心"},
            {"id":"l_a1_s4","name":"社區揪眾聊天"}]
         },
        {"id":"learn_activ2","name":"通常白天有活動，到晚上一個人看電視吃飯真無聊。",
         "solution":[
            {"id":"l_a2_s1","name":"社區共煮共食晚餐"},
            {"id":"l_a2_s2","name":"送餐到家服務"},
            {"id":"l_a2_s3","name":"延長社區活動中心營運時間"},
            {"id":"l_a2_s4","name":"專人到府指導營養餐烹調"}]
         },
        {"id":"learn_activ3","name":"老師上課教很快，我學習的速度跟不上。",
         "solution":[
            {"id":"l_a3_s1","name":"依照長者學習能力規劃進度"},
            {"id":"l_a3_s2","name":"能力相似的團體學習"},
            {"id":"l_a3_s3","name":"彈性安排每日課程"},
            {"id":"l_a3_s4","name":"沒有進度壓力的課程"}]
         },
        {"id":"learn_activ4","name":"沒機會再發揮自己的專長，覺得自己好沒價值。",
         "solution":[
            {"id":"l_a4_s1","name":"長者能力交流、交換平台"},
            {"id":"l_a4_s2","name":"長輩開課給年輕人傳授經驗"},
            {"id":"l_a4_s3","name":"志工招募資訊平台"}]
         },
        {"id":"learn_activ5","name":"在臉書、Line發照片、發文章的按讚數和回應越來越少，好沒成就感。",
         "solution":[
            {"id":"l_a5_s1","name":"網路社群技巧教學"},
            {"id":"l_a5_s2","name":"簡單好操作的修圖軟體"}]
         }]
         
    #適合長者旅遊環境
    header["need"][7]["risk"] = [
        {"id":"aging_travel1","name":"事先不知道有些景點要爬坡、路難走，早知道就留在原地等大家。",
         "solution":[
            {"id":"a_t1_s1","name":"風景區介紹標註詳細"},
            {"id":"a_t1_s2","name":"適合長輩的旅遊建議路線"},
            {"id":"a_t1_s3","name":"適合長輩的旅遊團"}]
         },
        {"id":"aging_travel2","name":"好多活動都是辦給年輕人玩的，不適合長輩參加。",
         "solution":[
            {"id":"a_t2_s1","name":"適合長輩的旅遊建議路線"},
            {"id":"a_t2_s2","name":"適合長輩的旅遊團"},
            {"id":"a_t2_s3","name":"專為長者設計的遊樂園"}]
         },
        {"id":"aging_travel3","name":"出去玩越來越不方便，得到處找廁所。",
         "solution":[
            {"id":"a_t3_s1","name":"風景區介紹標註詳細"},
            {"id":"a_t3_s2","name":"適合長輩的旅遊建議路線"},
            {"id":"a_t3_s3","name":"風景區增設適合長輩的公共廁所"}]
         },
        {"id":"aging_travel4","name":"一群人出去玩，大家的喜好、習慣都不同，沒配合好就不好玩。",
         "solution":[
            {"id":"a_t4_s1","name":"行前有團員介紹活動"},
            {"id":"a_t4_s2","name":"照團員喜好配對成團"}]
         },
        {"id":"aging_travel5","name":"出去玩一趟照片一大堆，要花很多時間整理。",
         "solution":[
            {"id":"a_t5_s1","name":"照相軟體自動刪除閉眼功能"},
            {"id":"a_t5_s2","name":"相片自動歸檔"},
            {"id":"a_t5_s3","name":"照相軟體辨識臉自動分送檔案"}]
         }]
         
    #自己打理生活
    header["need"][8]["risk"] = [
        {"id":"self_living1","name":"老擔心忘記關火、關瓦斯，就怕發生意外。",
         "solution":[
            {"id":"s_l1_s1","name":"爐火連結手機通知自己"},
            {"id":"s_l1_s2","name":"可以遠端關閉爐火"},
            {"id":"s_l1_s3","name":"可遠端監看家內狀況"},
            {"id":"s_l1_s4","name":"定時自動關閉爐火"}]
         },
        {"id":"self_living2","name":"常常忘東忘西，沒寫下來就會忘記。",
         "solution":[
            {"id":"s_l2_s1","name":"記錄工具可以隨身攜帶"},
            {"id":"s_l2_s2","name":"記錄工具要方便使用"},
            {"id":"s_l2_s3","name":"記錄工具有自動提醒功能"}]
         },
        {"id":"self_living3","name":"常常坐著就打瞌睡，冷氣、電視都沒關，好浪費電。",
         "solution":[
            {"id":"s_l3_s1","name":"冷氣自動偵測與關閉"},
            {"id":"s_l3_s2","name":"電燈自動偵測與關閉"},
            {"id":"s_l3_s3","name":"家電自動偵測與關閉"}]
         },
        {"id":"self_living4","name":"年紀大體力大不如前，打掃家裡容易腰痠背痛。",
         "solution":[
            {"id":"s_l4_s1","name":"掃拖地機器人"},
            {"id":"s_l4_s2","name":"自動擦灰機"},
            {"id":"s_l4_s3","name":"家事服務員"},
            {"id":"s_l4_s4","name":"家具有自動升降功能"}]
         },
        {"id":"self_living5","name":"年紀大手腳不俐落，要爬高、出力的家事做不來。",
         "solution":[
            {"id":"s_l5_s1","name":"簡易居家修繕服務"},
            {"id":"s_l5_s2","name":"家事服務員"},
            {"id":"s_l5_s3","name":"大樓管理公司有修繕服務"}]
         },
        {"id":"self_living6","name":"我不想裝監視器，但又想讓兒女放心，知道我好好的。",
         "solution":[
            {"id":"s_l6_s1","name":"自動定時報平安"},
            {"id":"s_l6_s2","name":"居家動態自動通知"},
            {"id":"s_l6_s3","name":"監視器裝在客、餐廳"},
            {"id":"s_l6_s4","name":"自己報平安的簡易設備"}]
         }]
         
    #學習數位科技
    header["need"][9]["risk"] = [
        {"id":"tech_learn1","name":"我不太會操作3C產品，孩子被我問得不耐煩，嫌我學很慢又記不住。",
         "solution":[
            {"id":"t_l1_s1","name":"電話客服提供諮詢"},
            {"id":"t_l1_s2","name":"數位裝置內建隨身數位助教"},
            {"id":"t_l1_s3","name":"影片教學操作步驟"}]
         },
        {"id":"tech_learn2","name":"我不敢亂點亂按手機，怕按錯出問題。",
         "solution":[
            {"id":"t_l2_s1","name":"回到初始畫面的按鍵"},
            {"id":"t_l2_s2","name":"電話客服提供諮詢"}]
         },
        {"id":"tech_learn3","name":"政府和廠商有些消息只公告在網路上，我哪會知道。",
         "solution":[
            {"id":"t_l3_s1","name":"鄰里長幫忙通知"},
            {"id":"t_l3_s2","name":"手機簡訊通知"},
            {"id":"t_l3_s3","name":"郵寄紙本通知"},
            {"id":"t_l3_s4","name":"手機中有數位佈告欄"}]
         },
        {"id":"tech_learn4","name":"網路消息傳來傳去，都不知道是真是假。",
         "solution":[
            {"id":"t_l4_s1","name":"政府主動刪除假消息"},
            {"id":"t_l4_s2","name":"政府主動通知訊息為假"},
            {"id":"t_l4_s3","name":"政府在假消息後加正確訊息連結"},
            {"id":"t_l4_s4","name":"可訂閱經過檢驗的資訊"}]
         },
        {"id":"tech_learn5","name":"上網查資料好難，要打什麼字才找得到？",
         "solution":[
            {"id":"t_l5_s1","name":"專人協助查詢資訊服務"},
            {"id":"t_l5_s2","name":"語音搜尋比對服務"}]
         }]
         
    
    
    return header

def CreateEmptyStruct():
    obj = {}
    obj["gender"] = ""
    obj["age"] = ""
    obj["county"] = ""
    obj["living"] = ""
    obj["num"] = 0
    obj["lang"] = [0,0,0,0]
    obj["livewith"] = [0,0,0,0,0]
    obj["need"] = [{"num":0},{"num":0},{"num":0},{"num":0},{"num":0},
       {"num":0},{"num":0},{"num":0},{"num":0},{"num":0}]
    
    #健康風險預告
    obj["need"][0]["risk"] = [
        {"num":0, #health_risk1
         "solution":[
            {"num":[0,0,0,0,0]}, #h_r1_s1
            {"num":[0,0,0,0,0]}, #h_r1_s2
            {"num":[0,0,0,0,0]}, #h_r1_s3
            {"num":[0,0,0,0,0]}] #h_r1_s4
         },
        {"num":0, #health_risk2
         "solution":[
            {"num":[0,0,0,0,0]}, #h_r2_s1
            {"num":[0,0,0,0,0]}, #h_r2_s2
            {"num":[0,0,0,0,0]}] #h_r2_s3
         },
        {"num":0, #health_risk3
         "solution":[
            {"num":[0,0,0,0,0]}, #h_r3_s1
            {"num":[0,0,0,0,0]}, #h_r3_s2
            {"num":[0,0,0,0,0]}, #h_r3_s3
            {"num":[0,0,0,0,0]}] #h_r3_s4
         },
        {"num":0, #health_risk4
         "solution":[
            {"num":[0,0,0,0,0]}, #h_r4_s1
            {"num":[0,0,0,0,0]}, #h_r4_s2
            {"num":[0,0,0,0,0]}, #h_r4_s3
            {"num":[0,0,0,0,0]}] #h_r4_s4
         },
        {"num":0, #health_risk5
         "solution":[
            {"num":[0,0,0,0,0]}, #h_r5_s1
            {"num":[0,0,0,0,0]}, #h_r5_s2
            {"num":[0,0,0,0,0]}, #h_r5_s3
            {"num":[0,0,0,0,0]}] #h_r5_s4
         },
        {"num":0, #health_risk6
         "solution":[
            {"num":[0,0,0,0,0]}, #h_r6_s1
            {"num":[0,0,0,0,0]}, #h_r6_s2
            {"num":[0,0,0,0,0]}, #h_r6_s3
            {"num":[0,0,0,0,0]}] #h_r6_s4
         }]
         
    #吃得營養健康
    obj["need"][1]["risk"] = [
        {"num":0, #eat_nutri1
         "solution":[
            {"num":[0,0,0,0,0]}, #e_n1_s1
            {"num":[0,0,0,0,0]}, #e_n1_s2
            {"num":[0,0,0,0,0]}, #e_n1_s3
            {"num":[0,0,0,0,0]}] #e_n1_s4
         },
        {"num":0, #eat_nutri2
         "solution":[
            {"num":[0,0,0,0,0]}, #e_n2_s1
            {"num":[0,0,0,0,0]}, #e_n2_s2
            {"num":[0,0,0,0,0]}, #e_n2_s2
            {"num":[0,0,0,0,0]}] #e_n2_s4
         },
        {"num":0, #eat_nutri3
         "solution":[
            {"num":[0,0,0,0,0]}, #e_n3_s1
            {"num":[0,0,0,0,0]}, #e_n3_s2
            {"num":[0,0,0,0,0]}, #e_n3_s3
            {"num":[0,0,0,0,0]}] #e_n3_s4
         },
        {"num":0, #eat_nutri4
         "solution":[
            {"num":[0,0,0,0,0]}, #e_n4_s1
            {"num":[0,0,0,0,0]}, #e_n4_s2
            {"num":[0,0,0,0,0]}, #e_n4_s3
            {"num":[0,0,0,0,0]}] #e_n4_s4
         },
        {"num":0, #eat_nutri5
         "solution":[
            {"num":[0,0,0,0,0]}, #e_n5_s1
            {"num":[0,0,0,0,0]}, #e_n5_s2
            {"num":[0,0,0,0,0]}, #e_n5_s3
            {"num":[0,0,0,0,0]}] #e_n5_s4
         },
        {"num":0, #eat_nutri6
         "solution":[
            {"num":[0,0,0,0,0]}, #e_n6_s1
            {"num":[0,0,0,0,0]}, #e_n6_s2
            {"num":[0,0,0,0,0]}, #e_n6_s3
            {"num":[0,0,0,0,0]}] #e_n6_s4
         }]
         
    #有效就醫診斷
    obj["need"][2]["risk"] = [
        {"num":0, #med_diagno1
         "solution":[
            {"num":[0,0,0,0,0]}, #m_d1_s1
            {"num":[0,0,0,0,0]}, #m_d1_s2
            {"num":[0,0,0,0,0]}] #m_d1_s3
         },
        {"num":0, #med_diagno2
         "solution":[
            {"num":[0,0,0,0,0]}, #m_d2_s1
            {"num":[0,0,0,0,0]}] #m_d2_s2
         },
        {"num":0, #med_diagno3
         "solution":[
            {"num":[0,0,0,0,0]}, #m_d3_s1
            {"num":[0,0,0,0,0]}, #m_d3_s2
            {"num":[0,0,0,0,0]}, #m_d3_s3
            {"num":[0,0,0,0,0]}] #m_d3_s4
         },
        {"num":0, #med_diagno4
         "solution":[
            {"num":[0,0,0,0,0]}, #m_d4_s1
            {"num":[0,0,0,0,0]}, #m_d4_s2
            {"num":[0,0,0,0,0]}, #m_d4_s3
            {"num":[0,0,0,0,0]}] #m_d4_s4
         },
        {"num":0, #med_diagno5
         "solution":[
            {"num":[0,0,0,0,0]}, #m_d5_s1
            {"num":[0,0,0,0,0]}, #m_d5_s2
            {"num":[0,0,0,0,0]}, #m_d5_s3
            {"num":[0,0,0,0,0]}] #m_d5_s4
         },
        {"num":0, #med_diagno6
         "solution":[
            {"num":[0,0,0,0,0]}, #m_d6_s1
            {"num":[0,0,0,0,0]}, #m_d6_s2
            {"num":[0,0,0,0,0]}] #m_d6_s3
         }]
         
    #安全騎車開車
    obj["need"][3]["risk"] = [
        {"num":0, #safe_drive1
         "solution":[
            {"num":[0,0,0,0,0]}, #s_d1_s1
            {"num":[0,0,0,0,0]}] #s_d1_s2
         },
        {"num":0, #safe_drive2
         "solution":[
            {"num":[0,0,0,0,0]}, #s_d2_s1
            {"num":[0,0,0,0,0]}, #s_d2_s2
            {"num":[0,0,0,0,0]}, #s_d2_s3
            {"num":[0,0,0,0,0]}] #s_d2_s4
         },
        {"num":0, #safe_drive3
         "solution":[
            {"num":[0,0,0,0,0]}, #s_d3_s1
            {"num":[0,0,0,0,0]}, #s_d3_s2
            {"num":[0,0,0,0,0]}, #s_d3_s3
            {"num":[0,0,0,0,0]}] #s_d3_s4
         },
        {"num":0, #safe_drive4
         "solution":[
            {"num":[0,0,0,0,0]}, #s_d4_s1
            {"num":[0,0,0,0,0]}, #s_d4_s2
            {"num":[0,0,0,0,0]}] #s_d4_s3
         },
        {"num":0, #safe_drive5
         "solution":[
            {"num":[0,0,0,0,0]}, #s_d5_s1
            {"num":[0,0,0,0,0]}, #s_d5_s2
            {"num":[0,0,0,0,0]}] #s_d5_s3
         },
        {"num":0, #safe_drive6
         "solution":[
            {"num":[0,0,0,0,0]}, #s_d6_s1
            {"num":[0,0,0,0,0]}] #s_d6_s2
         }]
         
    #輕鬆安全行走
    obj["need"][4]["risk"] = [
        {"num":0, #safe_walk1
         "solution":[
            {"num":[0,0,0,0,0]}, #s_w1_s1
            {"num":[0,0,0,0,0]}, #s_w1_s2
            {"num":[0,0,0,0,0]}, #s_w1_s3
            {"num":[0,0,0,0,0]}] #s_w1_s4
         },
        {"num":0, #safe_walk2
         "solution":[
            {"num":[0,0,0,0,0]}, #s_w2_s1
            {"num":[0,0,0,0,0]}, #s_w2_s2
            {"num":[0,0,0,0,0]}, #s_w2_s3
            {"num":[0,0,0,0,0]}] #s_w2_s4
         },
        {"num":0, #safe_walk3
         "solution":[
            {"num":[0,0,0,0,0]}, #s_w3_s1
            {"num":[0,0,0,0,0]}, #s_w3_s2
            {"num":[0,0,0,0,0]}, #s_w3_s3
            {"num":[0,0,0,0,0]}] #s_w3_s4
         },
        {"num":0, #safe_walk4
         "solution":[
            {"num":[0,0,0,0,0]}, #s_w4_s1
            {"num":[0,0,0,0,0]}, #s_w4_s2
            {"num":[0,0,0,0,0]}, #s_w4_s3
            {"num":[0,0,0,0,0]}] #s_w4_s4
         },
        {"num":0, #safe_walk5
         "solution":[
            {"num":[0,0,0,0,0]}, #s_w5_s1
            {"num":[0,0,0,0,0]}, #s_w5_s2
            {"num":[0,0,0,0,0]}, #s_w5_s3
            {"num":[0,0,0,0,0]}] #s_w5_s4
         }]
         
    #方便大眾運輸
    obj["need"][5]["risk"] = [
        {"num":0, #conv_transp1
         "solution":[
            {"num":[0,0,0,0,0]}, #c_t1_s1
            {"num":[0,0,0,0,0]}, #c_t1_s2
            {"num":[0,0,0,0,0]}, #c_t1_s3
            {"num":[0,0,0,0,0]}] #c_t1_s4
         },
        {"num":0, #conv_transp2
         "solution":[
            {"num":[0,0,0,0,0]}, #c_t2_s1
            {"num":[0,0,0,0,0]}, #c_t2_s2
            {"num":[0,0,0,0,0]}] #c_t2_s3
         },
        {"num":0, #conv_transp3
         "solution":[
            {"num":[0,0,0,0,0]}, #c_t3_s1
            {"num":[0,0,0,0,0]}, #c_t3_s2
            {"num":[0,0,0,0,0]}, #c_t3_s3
            {"num":[0,0,0,0,0]}] #c_t3_s4
         },
        {"num":0, #conv_transp4
         "solution":[
            {"num":[0,0,0,0,0]}, #c_t4_s1
            {"num":[0,0,0,0,0]}, #c_t4_s2
            {"num":[0,0,0,0,0]}] #c_t4_s3
         },
        {"num":0, #conv_transp5
         "solution":[
            {"num":[0,0,0,0,0]}, #c_t5_s1
            {"num":[0,0,0,0,0]}] #c_t5_s2
         },
        {"num":0, #conv_transp6
         "solution":[
            {"num":[0,0,0,0,0]}, #c_t6_s1
            {"num":[0,0,0,0,0]}, #c_t6_s2
            {"num":[0,0,0,0,0]}] #c_t6_s3
         }]
         
    #交流學習活動
    obj["need"][6]["risk"] = [
        {"num":0, #learn_activ1
         "solution":[
            {"num":[0,0,0,0,0]}, #l_a1_s1
            {"num":[0,0,0,0,0]}, #l_a1_s2
            {"num":[0,0,0,0,0]}, #l_a1_s3
            {"num":[0,0,0,0,0]}] #l_a1_s4
         },
        {"num":0, #learn_activ2
         "solution":[
            {"num":[0,0,0,0,0]}, #l_a2_s1
            {"num":[0,0,0,0,0]}, #l_a2_s2
            {"num":[0,0,0,0,0]}, #l_a2_s3
            {"num":[0,0,0,0,0]}] #l_a2_s4
         },
        {"num":0, #learn_activ3
         "solution":[
            {"num":[0,0,0,0,0]}, #l_a3_s1
            {"num":[0,0,0,0,0]}, #l_a3_s2
            {"num":[0,0,0,0,0]}, #l_a3_s3
            {"num":[0,0,0,0,0]}] #l_a3_s4
         },
        {"num":0, #learn_activ4
         "solution":[
            {"num":[0,0,0,0,0]}, #l_a4_s1
            {"num":[0,0,0,0,0]}, #l_a4_s2
            {"num":[0,0,0,0,0]}] #l_a4_s3
         },
        {"num":0, #learn_activ5
         "solution":[
            {"num":[0,0,0,0,0]}, #l_a5_s1
            {"num":[0,0,0,0,0]}] #l_a5_s2
         }]
         
    #適合長者旅遊環境
    obj["need"][7]["risk"] = [
        {"num":0, #aging_travel1
         "solution":[
            {"num":[0,0,0,0,0]}, #a_t1_s1
            {"num":[0,0,0,0,0]}, #a_t1_s2
            {"num":[0,0,0,0,0]}] #a_t1_s3
         },
        {"num":0, #aging_travel2
         "solution":[
            {"num":[0,0,0,0,0]}, #a_t2_s1
            {"num":[0,0,0,0,0]}, #a_t2_s2
            {"num":[0,0,0,0,0]}] #a_t2_s3
         },
        {"num":0, #aging_travel3
         "solution":[
            {"num":[0,0,0,0,0]}, #a_t3_s1
            {"num":[0,0,0,0,0]}, #a_t3_s2
            {"num":[0,0,0,0,0]}] #a_t3_s3
         },
        {"num":0, #aging_travel4
         "solution":[
            {"num":[0,0,0,0,0]}, #a_t4_s1
            {"num":[0,0,0,0,0]}] #a_t4_s2
         },
        {"num":0, #aging_travel5
         "solution":[
            {"num":[0,0,0,0,0]}, #a_t5_s1
            {"num":[0,0,0,0,0]}, #a_t5_s2
            {"num":[0,0,0,0,0]}] #a_t5_s3
         }]
         
    #自己打理生活
    obj["need"][8]["risk"] = [
        {"num":0, #self_living1
         "solution":[
            {"num":[0,0,0,0,0]}, #s_l1_s1
            {"num":[0,0,0,0,0]}, #s_l1_s2
            {"num":[0,0,0,0,0]}, #s_l1_s3
            {"num":[0,0,0,0,0]}] #s_l1_s4
         },
        {"num":0, #self_living2
         "solution":[
            {"num":[0,0,0,0,0]}, #s_l2_s1
            {"num":[0,0,0,0,0]}, #s_l2_s2
            {"num":[0,0,0,0,0]}] #s_l2_s3
         },
        {"num":0, #self_living3
         "solution":[
            {"num":[0,0,0,0,0]}, #s_l3_s1
            {"num":[0,0,0,0,0]}, #s_l3_s2
            {"num":[0,0,0,0,0]}] #s_l3_s3
         },
        {"num":0, #self_living4
         "solution":[
            {"num":[0,0,0,0,0]}, #s_l4_s1
            {"num":[0,0,0,0,0]}, #s_l4_s2
            {"num":[0,0,0,0,0]}, #s_l4_s3
            {"num":[0,0,0,0,0]}] #s_l4_s4
         },
        {"num":0, #self_living5
         "solution":[
            {"num":[0,0,0,0,0]}, #s_l5_s1
            {"num":[0,0,0,0,0]}, #s_l5_s2
            {"num":[0,0,0,0,0]}] #s_l5_s3
         },
        {"num":0, #self_living6
         "solution":[
            {"num":[0,0,0,0,0]}, #s_l6_s1
            {"num":[0,0,0,0,0]}, #s_l6_s2
            {"num":[0,0,0,0,0]}, #s_l6_s3
            {"num":[0,0,0,0,0]}] #s_l6_s4
         }]
         
    #學習數位科技
    obj["need"][9]["risk"] = [
        {"num":0, #tech_learn1
         "solution":[
            {"num":[0,0,0,0,0]}, #t_l1_s1
            {"num":[0,0,0,0,0]}, #t_l1_s2
            {"num":[0,0,0,0,0]}] #t_l1_s3
         },
        {"num":0, #tech_learn2
         "solution":[
            {"num":[0,0,0,0,0]}, #t_l2_s1
            {"num":[0,0,0,0,0]}] #t_l2_s2
         },
        {"num":0, #tech_learn3
         "solution":[
            {"num":[0,0,0,0,0]}, #t_l3_s1
            {"num":[0,0,0,0,0]}, #t_l3_s2
            {"num":[0,0,0,0,0]}, #t_l3_s3
            {"num":[0,0,0,0,0]}] #t_l3_s4
         },
        {"num":0, #tech_learn4
         "solution":[
            {"num":[0,0,0,0,0]}, #t_l4_s1
            {"num":[0,0,0,0,0]}, #t_l4_s2
            {"num":[0,0,0,0,0]}, #t_l4_s3
            {"num":[0,0,0,0,0]}] #t_l4_s4
         },
        {"num":0, #tech_learn5
         "solution":[
            {"num":[0,0,0,0,0]}, #t_l5_s1
            {"num":[0,0,0,0,0]}] #t_l5_s1
         }]
    
    return obj

def GenHashID(gender,age,countycode,livingstatus):
    return str(gender)+"-"+str(age)+"-"+str(countycode)+"-"+str(livingstatus)

def DataToJSON(f):
    print("Data to json")
    result = {}
    header = CreateHeader()
    result["header"] = header
    result["data"] = []
    hashObj = {}
    
    for gender in header["gender"]:
        for age in header["age"]:
            for countycode in header["county"]:
                for livingstatus in header["living"]:
                    obj = CreateEmptyStruct()
                    obj["gender"] = gender["id"]
                    obj["age"] = age["id"]
                    obj["county"] = countycode["id"]
                    obj["living"] = livingstatus["id"]
                    result["data"].append(obj)
                    hashID = GenHashID(gender["id"],age["id"],countycode["id"],livingstatus["id"])
                    hashObj[hashID] = obj
                    
    #print(hashObj.keys())
    needSize = len(header["need"])
    riskSize = 0
    for s in header["need"]:
        riskSize += len(s["risk"])
    solutionSize = 0
    for n in header["need"]:
        for r in n["risk"]:
            solutionSize += len(r["solution"])
    
    needStart = 11
    riskStart = needStart+needSize
    solutionStart = riskStart+riskSize
    infoStart = solutionStart+solutionSize    
    #print(str(needStart)+","+str(needSize))
    #print(str(riskStart)+","+str(riskSize))
    #print(str(solutionStart)+","+str(solutionSize))
    #print(str(infoStart))
    
    #skip first line
    f.readline()
    row = 1
    total = 0
    for d in csv.reader(f):
        lang = d[0]
        gender = d[infoStart]
        age = d[infoStart+1]
        livingstatus = d[infoStart+2]
        countycode = d[infoStart+11]
        
        row += 1
        if not gender:
            gender = 0
        if not age:
            age = 0
        if not countycode:
            countycode = 0
        if not livingstatus:
            livingstatus = 0
        
        total += 1
        need = d[needStart:needStart+needSize]
        risk = d[riskStart:riskStart+riskSize]
        solution = d[solutionStart:solutionStart+solutionSize]
        livingwith = d[infoStart+3:infoStart+8]
        
        hashID = GenHashID(gender,age,countycode,livingstatus)
        obj = hashObj[hashID]
        obj["num"] += 1
        
        if util.IsNumber(lang):
            obj["lang"][int(lang)] += 1
        else:
            obj["lang"][0] += 1
            
        #update living with num
        for i in range(0,len(obj["livewith"])):    
            obj["livewith"][i] += int(livingwith[i])

        #update need num
        for nIndex in range(0,len(obj["need"])):
            dIndex = nIndex
            #question n3 swtiches positions for need 3,8 and 4,9
            if(dIndex == 3):
                dIndex = 8
            elif(dIndex == 4):
                dIndex = 9
            elif(dIndex == 8):
                dIndex = 3
            elif(dIndex == 9):
                dIndex = 4
            
            n = obj["need"][dIndex]
            if not util.IsNumber(need[nIndex]):
                continue
            n["num"] += int(need[nIndex])
            
        #update risk num
        offset = 0
        for nIndex in range(0,len(obj["need"])):
            n = obj["need"][nIndex]
            for rIndex in range(0,len(n["risk"])):
                r = n["risk"][rIndex]
                if not util.IsNumber(risk[offset+rIndex]):
                    continue
                r["num"] += int(risk[offset+rIndex])
            offset += len(n["risk"])

        #update solution num
        offset = 0
        for nIndex in range(0,len(obj["need"])):
            n = obj["need"][nIndex]
            for rIndex in range(0,len(n["risk"])):
                r = n["risk"][rIndex]
                for solIndex in range(0,len(r["solution"])):
                    sol = r["solution"][solIndex]
                    if not util.IsNumber(solution[offset+solIndex]):
                        continue
                    degree = int(solution[offset+solIndex])
                    sol["num"][degree-1] += 1
                offset += len(r["solution"])
        #print(d)
        #print(obj)
        #os.system("pause")
    result["total"] = total
    #print(len(result["data"]))
    #print(total)
    return result
   

def CreateTable(connection):
    with connection.cursor() as cursor:
        sql = "CREATE TABLE IF NOT EXISTS HLBasicInfo (\
            gender VARCHAR(4),\
            age VARCHAR(4),\
            county VARCHAR(16),\
            living VARCHAR(4),\
            num INT,\
            weight FLOAT,\
            lang_Mandarin INT,\
            lang_Taiwanese INT,\
            lang_Hakka INT,\
            liv_w_parents INT,\
            liv_w_hw INT,\
            liv_w_kid INT,\
            liv_w_grandk INT,\
            liv_w_others INT,\
            PRIMARY KEY (gender,age,county,living)\
            );"
        cursor.execute(sql)
        
        sql = "CREATE TABLE IF NOT EXISTS HLNeed (\
            gender VARCHAR(4),\
            age VARCHAR(4),\
            county VARCHAR(16),\
            living VARCHAR(4),\
            need VARCHAR(4),\
            num INT,\
            wNum FLOAT,\
            PRIMARY KEY (gender,age,county,living,need),\
            INDEX(need)\
            );"
        cursor.execute(sql)
        
        sql = "CREATE TABLE IF NOT EXISTS HLRisk (\
            gender VARCHAR(4),\
            age VARCHAR(4),\
            county VARCHAR(16),\
            living VARCHAR(4),\
            need VARCHAR(4),\
            risk VARCHAR(4),\
            num INT,\
            wNum FLOAT,\
            PRIMARY KEY (need,risk,gender,age,county,living)\
            );"
        cursor.execute(sql)
        
        sql = "CREATE TABLE IF NOT EXISTS HLSolution (\
            gender VARCHAR(4),\
            age VARCHAR(4),\
            county VARCHAR(16),\
            living VARCHAR(4),\
            need VARCHAR(4),\
            risk VARCHAR(4),\
            solution VARCHAR(4),\
            deg1 INT,\
            deg2 INT,\
            deg3 INT,\
            deg4 INT,\
            deg5 INT,\
            wDeg1 FLOAT,\
            wDeg2 FLOAT,\
            wDeg3 FLOAT,\
            wDeg4 FLOAT,\
            wDeg5 FLOAT,\
            PRIMARY KEY (need,risk,solution,gender,age,county,living)\
            );"
        cursor.execute(sql)

    connection.commit()
    
def JSONToDB(conn,header,data):
    print("json to db")
    basicField = "gender,age,county,living,num,weight,lang_Mandarin,lang_Taiwanese,lang_Hakka,liv_w_parents,liv_w_hw,liv_w_kid,liv_w_grandk,liv_w_others"
    needField = "gender,age,county,living,need,num,wNum"
    riskField = "gender,age,county,living,need,risk,num,wNum"
    solutionField = "gender,age,county,living,need,risk,solution,deg1,deg2,deg3,deg4,deg5,wDeg1,wDeg2,wDeg3,wDeg4,wDeg5"
    
    wb = load_workbook(filename = 'data/全齡權重1021_Claudia.xlsx', data_only=True)
    sheet = wb["SPSS程式"]
    countyNum = len(header["county"])-1
    ageNum = len(header["age"])-1
        
    for d in data:
        #insert basic info
        basic = {}
        basic["gender"] = d["gender"]
        basic["age"] = d["age"]
        basic["county"] = d["county"]
        basic["living"] = d["living"]
        basic["num"] = d["num"]
        if d["gender"] == 0 or d["age"] == 0 or d["county"] == 0:
            weight = 0
        else:
            row = 1+(d["gender"]-1)*ageNum*countyNum+(d["age"]-1)*countyNum+(d["county"]-1)
            weight = sheet['O'+str(row)].value
        
        basic["weight"] = weight

        basic["lang_Mandarin"] = d["lang"][1]
        basic["lang_Taiwanese"] = d["lang"][2]
        basic["lang_Hakka"] = d["lang"][3]
        basic["liv_w_parents"] = d["livewith"][0]
        basic["liv_w_hw"] = d["livewith"][1]
        basic["liv_w_kid"] = d["livewith"][2]
        basic["liv_w_grandk"] = d["livewith"][3]
        basic["liv_w_others"] = d["livewith"][4]
        
        val = util.GenValue(basic,basicField)
        with connection.cursor() as cursor:
            sql = "INSERT IGNORE INTO HLBasicInfo ("+basicField+") VALUES ("+val+")"
            cursor.execute(sql)
           
        #insert need 
        for nIndex,n in enumerate(d["need"]):
            need = {}
            need["gender"] = d["gender"]
            need["age"] = d["age"]
            need["county"] = d["county"]
            need["living"] = d["living"]
            need["need"] = nIndex
            need["num"] = n["num"]
            need["wNum"] = n["num"]*weight
            
            val = util.GenValue(need,needField)
            with connection.cursor() as cursor:
                sql = "INSERT IGNORE INTO HLNeed ("+needField+") VALUES ("+val+")"
                cursor.execute(sql)
                
            #insert risk
            for rIndex,r in enumerate(n["risk"]):
                risk = {}
                risk["gender"] = d["gender"]
                risk["age"] = d["age"]
                risk["county"] = d["county"]
                risk["living"] = d["living"]
                risk["need"] = nIndex
                risk["risk"] = rIndex
                risk["num"] = r["num"]
                risk["wNum"] = r["num"]*weight
                
                val = util.GenValue(risk,riskField)
                with connection.cursor() as cursor:
                    sql = "INSERT IGNORE INTO HLRisk ("+riskField+") VALUES ("+val+")"
                    cursor.execute(sql)
                    
                #insert solution
                for sIndex,s in enumerate(r["solution"]):
                    solution = {}
                    solution["gender"] = d["gender"]
                    solution["age"] = d["age"]
                    solution["county"] = d["county"]
                    solution["living"] = d["living"]
                    solution["need"] = nIndex
                    solution["risk"] = rIndex
                    solution["solution"] = sIndex
                    for i in range(0,5):
                        solution["deg"+str(i+1)] =  s["num"][i]
                        solution["wDeg"+str(i+1)] =  s["num"][i]*weight
                    
                    val = util.GenValue(solution,solutionField)
                    with connection.cursor() as cursor:
                        sql = "INSERT IGNORE INTO HLSolution ("+solutionField+") VALUES ("+val+")"
                        cursor.execute(sql)
                    
    connection.commit()
            
   
if __name__ == "__main__":
    config = json.loads(open("config.json").read())
    auth = config["mysqlAuth"]
    connection = pymysql.connect(host=auth["host"],user=auth["username"],
            password=auth["password"],db=auth["dbName"],
            charset='utf8',cursorclass=pymysql.cursors.DictCursor)
    
    #ignore warning message
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', pymysql.Warning)
        CreateTable(connection)
        
        def SaveToJSON():
            with open("data/happylivingdata_allvalid_1021.csv","r", encoding="big5") as f:
                result = DataToJSON(f)
                with open('header.json', 'w') as outfile:
                    json.dump(result["header"], outfile)
                with open('data.json', 'w') as outfile:
                    json.dump(result["data"], outfile)
        SaveToJSON()
                
        def SaveToDB(): 
            with open("header.json","r", encoding="big5") as f:
                header = json.load(f)
            with open("data.json","r", encoding="big5") as f:
                data = json.load(f)
            JSONToDB(connection,header,data)
        SaveToDB()
    
    connection.close()