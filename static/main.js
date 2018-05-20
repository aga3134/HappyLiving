var g_APP = new Vue({
  el: "#app",
  data: {
    openNeed: -1,
    openRisk: -1,
    quest:{
      q:["1. 選出2項您自己生活中最關心的事？",
         "2. 你最擔心哪2個麻煩？",
         "3. 這樣解決這個麻煩，您喜歡嗎？"],
      need:[]
    },
  	header: {},
    map: "",
    genderGroup: "",
    ageGroup: "",
    countyGroup: "",
    livingGroup: "",
    mapOption: 1
  },
  created: function () {
    this.map = new MapTW();
  	$.get("/static/header.json",function(data){
      this.header = data;
      var need = data.need;
      this.quest.need = [];
      for(var i=0;i<need.length;i++){
        var n = {};
        n.title = need[i].name;
        n.image = "/static/Image/need/n"+(i+1)+".jpg";
        n.risk = [];
        for(var j=0;j<need[i].risk.length;j++){
          var risk = need[i].risk[j];
          var r = {};
          r.title = risk.name;
          r.image = "/static/Image/risk/n"+(i+1)+"-"+(j+1)+".jpg";
          r.solution = [];
          for(var k=0;k<risk.solution.length;k++){
            var solution = risk.solution[k];
            r.solution.push(solution.name);
          }
          n.risk.push(r);
        }
        this.quest.need.push(n);
      }
      //console.log(this.quest.need);
      this.DrawSummery();
    }.bind(this));
  },
  methods: {
    ToggleNeed: function(index,event){
      this.openRisk = -1;
      if(this.openNeed == index) this.openNeed = -1;
      else{
        app = this;

        var item = $(event.target);
        var scroll = $("body").scrollTop();
        var top = $(item).offset().top;
        $('body').animate({
            scrollTop: top+scroll-80
        }, 500, function(){
          app.openNeed = index;
          //更新index後元素位置會跑掉，重新調回正確位置
          setTimeout(function(){
            var top = $(item).offset().top;
            var scroll = $("body").scrollTop();
            $("body").scrollTop(top+scroll-80);
          },10);
        });
        
      }
      
    },
    ToggleRisk: function(index,event){
      if(this.openRisk == index) this.openRisk = -1;
      else{
        app = this;

        var item = $(event.target);
        var scroll = $("body").scrollTop();
        var top = $(item).offset().top;
        $('body').animate({
            scrollTop: top+scroll-80
        }, 500, function(){
          app.openRisk = index;
          //更新index後元素位置會跑掉，重新調回正確位置
          setTimeout(function(){
            var top = $(item).offset().top;
            var scroll = $("body").scrollTop();
            $("body").scrollTop(top+scroll-80);
          },10);
        });
        
      }
    },
    DrawSummery: function(){
      var header = this.header;

      $.get("/basicInfo?summary=1",function(data){
        var json = JSON.parse(data);

        this.$refs.genderGraph.input = json;
        this.$refs.genderGraph.type = "gender";
        this.$refs.genderGraph.UpdateGraph();

        this.$refs.countyGraph.input = json;
        this.$refs.countyGraph.type = "county";
        this.$refs.countyGraph.UpdateGraph();

        this.$refs.ageGraph.input = json;
        this.$refs.ageGraph.type = "age";
        this.$refs.ageGraph.UpdateGraph();

        this.$refs.livingGraph.input = json;
        this.$refs.livingGraph.type = "living";
        this.$refs.livingGraph.UpdateGraph();

        this.$refs.langGraph.input = json;
        this.$refs.langGraph.type = "lang";
        this.$refs.langGraph.UpdateGraph();

        this.$refs.livewithGraph.input = json;
        this.$refs.livewithGraph.type = "livewith";
        this.$refs.livewithGraph.UpdateGraph();

      }.bind(this));
    }
  }
});

window.addEventListener('load', function() {
  $('a').click(function(){
    var href = $.attr(this, 'href');
    if(href){
      var scroll = $("body").scrollTop();
      var index= href.indexOf("#");
      var anchor = $('[name="' + href.substr(index+1) + '"]');
      if(anchor.length == 0){
        anchor = $('a[id="' + href.substr(index+1) + '"]');
      }
      if(anchor.length > 0){
          $('body').animate({
              scrollTop: anchor.offset().top+scroll-80
          }, 500);
          return false;
      }
      return true;
    }
      return false;
  });

});

window.addEventListener('resize', function(e) {
  
});