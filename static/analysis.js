var g_Analysis = new Vue({
  el: "#analysis",
  data: {
    by: "info",
    gender:"全部",
    minAge: 20,
    maxAge: 100,
    county:"全部",
    living:"全部",
    curNeed: "全部",
    needOption: [],
    curRisk: "全部",
    riskOption: [],
    curSolution: "全部",
    header: "",
    basicInfo: "",
    wTotal: 0,
    rankNeed: [],
    rankRisk: [],
    rankSolution: [],
    levelSelect: 0,
    needSelect: 0,
    riskSelect: 0
  },
  created: function () {
    var param = g_Util.GetUrlParameter();
    if(param["by"] == "need"){
      this.by = param["by"];
    }

    $.get("/static/header.json",function(data){
      this.header = data;
      $.get("/basicInfo?summary=1",function(data){
        this.basicInfo = JSON.parse(data);
        this.UpdateGraph();
      }.bind(this));
    }.bind(this));

    window.addEventListener('resize', this.UpdateGraph);
  },
  methods: {
    UpdateGraph: function(){
      //console.log(this.header);
      //console.log(this.basicInfo);
      switch(this.by){
        case "info": this.UpdateRankGraph(); break;
      }
    },
    ComputeTotalNum: function(){
      var minAge = this.minAge>20?this.minAge:20;
      var maxAge = this.maxAge<100?this.maxAge:100;

      var filtered = this.basicInfo.filter(function(d){
        var pass = true;
        if(this.gender != "全部"){
          pass = pass && d.gender == this.gender;
        }
        if(this.county != "全部"){
          pass = pass && d.county == this.county;
        }
        
        var aID = parseInt(d.age);
        var age = this.header.age[aID];
        pass = pass && (age.minAge >= minAge) && (age.maxAge <= maxAge);
        
        if(this.living != "全部"){
          pass = pass && d.living == this.living;
        }
        return pass;
      }.bind(this));

      var total = {};
      total["num"] = d3.sum(filtered,function(d){return d.num;});
      total["wNum"] = d3.sum(filtered,function(d){return d.num*d.weight;});
      total["weight"] = total["wNum"]/total["num"];
      
      //console.log(total);
      return total;
    },
    UpdateRankGraph: function(){
      var value = "wNum";
      //若資料已存在就不再load一次
      var url = "";
      switch(this.levelSelect){
        case 0:
          url = "/need?summary=1";
          break;
        case 1:
          url = "/risk?summary=1&need="+this.needSelect;
          break;
        case 2:
          url = "/solution?summary=1&need="+this.needSelect+"&risk="+this.riskSelect;
          break;
      }

      if(this.gender!="全部") url += "&gender="+this.gender;
      if(this.county!="全部") url += "&county="+this.county;
      var minAge = this.minAge>20?this.minAge:20;
      var maxAge = this.maxAge<100?this.maxAge:100;
      url += "&minAge="+minAge;
      url += "&maxAge="+maxAge;
      if(this.living!="全部") url += "&living="+this.living;
      
      $.get(url,function(data){
        var json = JSON.parse(data);
        if(json.length == 0){
          alert("查無資料，請修改篩選條件後重試一次");
          return;
        }
        //console.log(url);
        //console.log(json);
        
        var maxV = d3.max(json,function(d){return d[value];});
        var total = this.ComputeTotalNum();
        var scaleW = total[value]/maxV;
        this.wTotal = total["wNum"].toFixed(2);

        switch(this.levelSelect){
          case 0:
            for(var i=0;i<json.length;i++){
              var nID = json[i].need;
              json[i].name = this.header.need[nID].name;
              json[i].ratio = (100*json[i][value]/total[value]).toFixed(1);
              json[i].image = "/static/Image/need/n"+(parseInt(nID)+1)+".jpg";
              json[i].width = "width:"+parseInt(json[i].ratio*scaleW)+"%";
              json[i].str = json[i][value].toFixed(2);
            }
            this.rankNeed = json.sort(function(a,b){
              return b[value]-a[value];
            });
            this.rankRisk = [];
            this.rankSolution = [];

            break;
          case 1:
            for(var i=0;i<json.length;i++){
              var nID = json[i].need;
              var rID = json[i].risk;
              json[i].name = this.header.need[nID].risk[rID].name;
              json[i].ratio = (100*json[i][value]/total[value]).toFixed(1);
              json[i].image = "/static/Image/risk/n"+(parseInt(nID)+1)+"-"+(parseInt(rID)+1)+".jpg";
              json[i].width = "width:"+parseInt(json[i].ratio*scaleW)+"%";
              json[i].str = json[i][value].toFixed(2);
            }
            this.rankRisk = json.sort(function(a,b){
              return b[value]-a[value];
            });
            this.rankNeed = [];
            this.rankSolution = [];

            break;
          case 2:
            for(var i=0;i<json.length;i++){
              var nID = json[i].need;
              var rID = json[i].risk;
              var sID = json[i].solution;
              json[i].name = this.header.need[nID].risk[rID].solution[sID].name;
              json[i].ratio = (100*json[i][value]/total[value]).toFixed(1);
              json[i].num = [];
              json[i].wNum = [];
              for(var deg=0;deg<5;deg++){
                var num = {};
                num.minX = deg+1;
                num.maxX = deg+1;
                num.value = json[i]["deg"+(deg+1)];
                json[i].num.push(num);
                var wNum = {};
                wNum.minX = deg+1;
                wNum.maxX = deg+1;
                wNum.value = json[i]["wDeg"+(deg+1)];
                json[i].wNum.push(wNum);
                //console.log(json[i]);
              }
            }
            this.rankSolution = json;
            this.rankNeed = [];
            this.rankRisk = [];

            //waiting for svg graph update
            setTimeout(function(){
              this.UpdateDegreeGraph(value);
            }.bind(this),10);
            
            break;
        }

      }.bind(this));
    },
    UpdateDegreeGraph: function(key){
      var maxV = 0;
      for(var i=0;i<this.rankSolution.length;i++){
        var s = this.rankSolution[i];
        var v = d3.max(s[key],function(d){return d.value;});
        if(v > maxV) maxV = v;
      }

      for(var i=0;i<this.rankSolution.length;i++){
        var s = this.rankSolution[i];
        //console.log(s[key]);
        var param = {};
        param.selector = "#degGraph"+i;
        param.minX = 1;
        param.maxX = 6;
        param.keyXMin = "minX";
        param.keyXMax = "maxX";
        param.keyY = "value";
        param.maxValue = maxV;
        param.minColor = "#FF9999";
        param.maxColor = "#996666";
        param.unitY = "人";
        param.unitX = "喜好程度";
        param.textInfo = "#degInfo"+i;
        param.data = s[key];
        param.infoFn = function(d){
          var num = g_Util.NumberWithCommas(d.value.toFixed(2));
          var str = "";
          switch(d.minX){
            case 1: str="非常不喜歡"; break;
            case 2: str="不喜歡"; break;
            case 3: str="普通"; break;
            case 4: str="喜歡"; break;
            case 5: str="非常喜歡"; break;
          }
          return str+": "+num+"人";
        };
        g_SvgGraph.Histogram(param);
      }
    },
    SelectNeed: function(id){
      $("#switchH").css("left","-100%");
      this.levelSelect = 1;
      this.needSelect = id;
      this.UpdateRankGraph();
    },
    SelectRisk: function(id){
      $("#switchH").css("left","-200%");
      this.levelSelect = 2;
      this.riskSelect = id;
      this.UpdateRankGraph();
    },
    BackToPrev: function(){
      if(this.levelSelect > 0) this.levelSelect--;
      $("#switchH").css("left",(-this.levelSelect*100)+"%");
      this.UpdateRankGraph();
    },
    UpdateNeedOption: function(){
      if(this.curNeed > 0 && this.curNeed < this.header.need.length){
        this.needOption = this.header.need[this.curNeed].risk;
      }
      else{
        this.needOption = [];
      }
      this.curRisk = "全部";
      this.riskOption = [];
      this.UpdateGraph();
    },
    UpdateRiskOption: function(){
      if(this.curRisk > 0 && this.curRisk < this.needOption.length){
        this.riskOption = this.needOption[this.curRisk].solution;
      }
      else{
        this.riskOption = [];
      }
      this.curSolution = "全部";
      this.UpdateGraph();
    }
  }
});

window.addEventListener('load', function() {

});
