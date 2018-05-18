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
    rankSolution: []
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
    UpdateRankGraph: function(){
      var url = "/need?summary=1";
      if(this.gender!="全部") url += "&gender="+this.gender;
      if(this.county!="全部") url += "&county="+this.county;
      var minAge = this.minAge>20?this.minAge:20;
      var maxAge = this.maxAge<100?this.maxAge:100;
      url += "&minAge="+minAge;
      url += "&maxAge="+maxAge;
      if(this.living!="全部") url += "&living="+this.living;

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
      this.wTotal = total["wNum"].toFixed(2);
      //console.log(total);
      
      $.get(url,function(data){
        var json = JSON.parse(data);
        if(json.length == 0){
          alert("查無資料，請修改篩選條件後重試一次");
          return;
        }
        
        var value = "wNum";
        var maxV = d3.max(json,function(d){return d[value];});
        var scaleW = total[value]/maxV;
        for(var i=0;i<json.length;i++){
          var nID = json[i].need;
          json[i].name = this.header.need[nID].name;
          json[i].ratio = (100*json[i][value]/total[value]).toFixed(1);
          json[i].image = "/static/Image/need/n"+(parseInt(nID)+1)+".jpg";
          json[i].width = "width:"+parseInt(json[i].ratio*scaleW)+"%";
          json[i].str = json[i][value].toFixed(2);
        }
        //console.log(url);
        //console.log(json);

        this.rankNeed = json.sort(function(a,b){
          return b[value]-a[value];
        });
        this.rankNeed = json;

      }.bind(this));
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
