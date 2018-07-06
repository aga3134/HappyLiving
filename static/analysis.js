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
    curDeg: "全部",
    header: "",
    basicInfo: "",
    distData: [],
    wTotal: 0,
    rankNeed: [],
    rankRisk: [],
    rankSolution: [],
    levelSelect: 0,
    needSelect: 0,
    riskSelect: 0,
    isMinimize: false
  },
  created: function () {
    var param = g_Util.GetUrlParameter();
    if(param["by"] == "need"){
      this.by = param["by"];
    }

    $.get("/static/header.json?v=1.0",function(data){
      this.header = data;

      //init distData
      this.distData = [];
      for(var n=0;n<data.need.length;n++){
        var need = {data:[],risk:[]};
        for(var r=0;r<data.need[n].risk.length;r++){
          var risk = {data:[],solution:[]};
          for(var s=0;s<data.need[n].risk[r].solution.length;s++){
            var solution = {data:[],deg:[]};
            for(var deg=0;deg<5;deg++){
              var degree = {data:[]};
              solution.deg.push(degree);
            }
            risk.solution.push(solution);
          }
          need.risk.push(risk);
        }
        this.distData.push(need);
      }
      //console.log(this.distData);

      $.get("/basicInfo",function(data){
        var json = JSON.parse(data);
        for(var i=0;i<json.length;i++){
          json[i].wNum = (json[i].weight*json[i].num);
        }
        this.basicInfo = json;
        this.UpdateGraph();
      }.bind(this));
    }.bind(this));

    window.addEventListener('resize', this.UpdateGraph);
  },
  methods: {
    UpdateGraph: function(){
      //console.log(this.header);
      //console.log(this.basicInfo);
      setTimeout(function(){
        switch(this.by){
          case "info": this.UpdateRankGraph(); break;
          case "need": this.UpdateDistGraph(); break;
        }
      }.bind(this),10);
      
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
    GetDegName: function(deg){
      var str = "";
      switch(deg){
        case 1: str="非常不喜歡"; break;
        case 2: str="不喜歡"; break;
        case 3: str="普通"; break;
        case 4: str="喜歡"; break;
        case 5: str="非常喜歡"; break;
      }
      return str;
    },
    //========================依基本資料分析=============================
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
        //var scaleW = total[value]/maxV;
        this.wTotal = total["wNum"].toFixed(2);

        switch(this.levelSelect){
          case 0:
            var scaleW = 2;
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
            var scaleW = 4;
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
              for(var deg=1;deg<=5;deg++){
                var num = {};
                num.minX = deg-1;
                num.maxX = deg-1;
                num.value = json[i]["deg"+(deg)];
                json[i].num.push(num);
                var wNum = {};
                wNum.minX = deg-1;
                wNum.maxX = deg-1;
                wNum.value = json[i]["wDeg"+(deg)];
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
      //average rank
      var avgRank = [];
      for(var i=0;i<this.rankSolution.length;i++){
        var solution = this.rankSolution[i];
        var sum = 0;
        var num = 0;
        for(var j=1;j<=5;j++){
          num += solution["wDeg"+j];
          sum += solution["wDeg"+j]*j;
        }
        var avg = 0;
        if(num > 0) avg = sum/num;
        avgRank.push({key:solution.name,value:avg});
      }

      var param = {};
      param.selector = "#avgRankGraph";
      param.textInfo = "#avgRankInfo";
      param.key = "key";
      param.value = "value";
      param.maxValue = 5;
      var color = "#73c0f4";
      param.minColor = d3.rgb(color).brighter(3);
      param.maxColor = color;
      param.unit = "平均值";
      param.data = avgRank;
      param.infoFn = function(d){
        var num = g_Util.NumberWithCommas(d.value.toFixed(2));
        var str = d.key+" 平均: "+num;
        return str;
      };
      g_SvgGraph.SortedBar(param);

      var maxV = 0;
      for(var i=0;i<this.rankSolution.length;i++){
        var s = this.rankSolution[i];
        var v = d3.max(s[key],function(d){return d.value;});
        if(v > maxV) maxV = v;
      }

      var colorArr = g_Util.ColorCategory(10);
      for(var i=0;i<this.rankSolution.length;i++){
        var s = this.rankSolution[i];
        //console.log(s[key]);
        var sum = d3.sum(s[key],function(d){return d.value;});
        var param = {};
        param.selector = "#degGraph"+i;
        param.minX = 0;
        param.maxX = 5;
        param.keyXMin = "minX";
        param.keyXMax = "maxX";
        param.keyY = "value";
        param.maxValue = maxV;
        var c = colorArr(i);
        param.minColor = d3.rgb(c).darker(1);
        param.maxColor = c;
        param.unitY = "人";
        param.unitX = "喜好程度";
        param.textInfo = "#degInfo"+i;
        param.data = s[key];
        param.infoFn = function(d){
          var num = g_Util.NumberWithCommas(d.value.toFixed(2));
          var str = g_Analysis.GetDegName(d.minX);
          var ratio = (100*(d.value/sum)).toFixed(2);
          return str+": "+num+"人"+"("+ratio+"%)";
        };
        g_SvgGraph.Histogram(param);
      }
    },
    SelectNeed: function(id,name){
      gtag('event', 'analysis-by-info', {
        'event_category': 'SelectNeed',
        'event_label': name
      });
      $("#switchH").css("left","-100%");
      this.levelSelect = 1;
      this.needSelect = id;
      this.UpdateRankGraph();
    },
    SelectRisk: function(id,name){
      gtag('event', 'analysis-by-info', {
        'event_category': 'SelectRisk',
        'event_label': name
      });
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
    //========================依問題需求分析=============================
    UpdateDistGraph: function(){
      var app = this;
      function UpdateRef(data){
        app.$refs.genderGraph.input = data;
        app.$refs.genderGraph.type = "gender";
        app.$refs.genderGraph.UpdateGraph();

        app.$refs.countyGraph.input = data;
        app.$refs.countyGraph.type = "county";
        app.$refs.countyGraph.UpdateGraph();

        app.$refs.ageGraph.input = data;
        app.$refs.ageGraph.type = "age";
        app.$refs.ageGraph.UpdateGraph();

        app.$refs.livingGraph.input = data;
        app.$refs.livingGraph.type = "living";
        app.$refs.livingGraph.UpdateGraph();

        app.$refs.genderRatio.input = data;
        app.$refs.genderRatio.total = app.basicInfo;
        app.$refs.genderRatio.type = "genderRatio";
        app.$refs.genderRatio.UpdateGraph();

        app.$refs.countyRatio.input = data;
        app.$refs.countyRatio.total = app.basicInfo;
        app.$refs.countyRatio.type = "countyRatio";
        app.$refs.countyRatio.UpdateGraph();

        app.$refs.ageRatio.input = data;
        app.$refs.ageRatio.total = app.basicInfo;
        app.$refs.ageRatio.type = "ageRatio";
        app.$refs.ageRatio.UpdateGraph();

        app.$refs.livingRatio.input = data;
        app.$refs.livingRatio.total = app.basicInfo;
        app.$refs.livingRatio.type = "livingRatio";
        app.$refs.livingRatio.UpdateGraph();
      }

      var json = [];
      if(this.curNeed == "全部"){
        json = this.basicInfo;
        UpdateRef(json);
      }
      else if(this.curRisk == "全部"){
        var json = this.distData[this.curNeed].data;
        if(json.length > 0){
          UpdateRef(json);
        }
        else{
          var url = "/need?need="+this.curNeed;
          $.get(url,function(data){
            json = JSON.parse(data);
            this.distData[this.curNeed].data = json;
            UpdateRef(json);
          }.bind(this));
        }
      }
      else if(this.curSolution == "全部"){
        var json = this.distData[this.curNeed].risk[this.curRisk].data;
        if(json.length > 0){
          UpdateRef(json);
        }
        else{
          var url = "/risk?need="+this.curNeed+"&risk="+this.curRisk;
          $.get(url,function(data){
            json = JSON.parse(data);
            this.distData[this.curNeed].risk[this.curRisk].data = json;
            UpdateRef(json);
          }.bind(this));
        }
      }
      else if(this.curDeg == "全部"){
        var json = this.distData[this.curNeed].risk[this.curRisk].solution[this.curSolution].data;
        if(json.length > 0){
          UpdateRef(json);
        }
        else{
          var url = "/solution?need="+this.curNeed+"&risk="+this.curRisk+"&solution="+this.curSolution;
          $.get(url,function(data){
            var json = JSON.parse(data);
            
            for(var i=0;i<json.length;i++){
              var num = 0;
              var wNum = 0;
              for(var j=1;j<=5;j++){
                num += json[i]["deg"+j];
                wNum += json[i]["wDeg"+j];
              }
              json[i].num = num;
              json[i].wNum = wNum;
            }
            this.distData[this.curNeed].risk[this.curRisk].solution[this.curSolution].data = json;
            UpdateRef(json);
          }.bind(this));
        }
      }
      else{
        var json = this.distData[this.curNeed].risk[this.curRisk].solution[this.curSolution].deg[this.curDeg-1].data;
        if(json.length > 0){
          UpdateRef(json);
        }
        else{
          json = this.distData[this.curNeed].risk[this.curRisk].solution[this.curSolution].data;
          var degArr = [];
          
          for(var i=0;i<json.length;i++){
            var deg = {};
            deg.gender = json[i].gender;
            deg.age = json[i].age;
            deg.county = json[i].county;
            deg.living = json[i].living;
            deg.num = json[i]["deg"+this.curDeg];
            deg.wNum = json[i]["wDeg"+this.curDeg];
            degArr.push(deg);
          }
          this.distData[this.curNeed].risk[this.curRisk].solution[this.curSolution].deg[this.curDeg-1].data = degArr;
          UpdateRef(degArr);
        }
      }

    },
    UpdateNeedOption: function(){
      this.SetMinimize(false);
      if(this.curNeed >= 0 && this.curNeed < this.header.need.length){
        this.needOption = this.header.need[this.curNeed].risk;
        gtag('event', 'analysis-by-need', {
          'event_category': 'UpdateNeedOption',
          'event_label': this.header.need[this.curNeed].name
        });
      }
      else{
        this.needOption = [];
      }
      this.curRisk = "全部";
      this.curSolution = "全部";
      this.curDeg = "全部";
      this.riskOption = [];
      this.UpdateGraph();
    },
    UpdateRiskOption: function(){
      this.SetMinimize(false);
      if(this.curRisk >= 0 && this.curRisk < this.needOption.length){
        this.riskOption = this.needOption[this.curRisk].solution;
        gtag('event', 'analysis-by-need', {
          'event_category': 'UpdateRiskOption',
          'event_label': this.needOption[this.curRisk].name
        });
      }
      else{
        this.riskOption = [];
      }
      this.curSolution = "全部";
      this.curDeg = "全部";
      this.UpdateGraph();
    },
    UpdateSolutionOption: function(){
      if(this.curSolution >= 0 && this.curSolution < this.riskOption.length){
        gtag('event', 'analysis-by-need', {
          'event_category': 'UpdateSolutionOption',
          'event_label': this.riskOption[this.curSolution].name
        });
      }
      this.SetMinimize(false);
      this.curDeg = "全部";
      this.UpdateGraph();
    },
    SetMinimize: function(value){
      this.isMinimize = value;
    }
  }
});

window.addEventListener('load', function() {

});
