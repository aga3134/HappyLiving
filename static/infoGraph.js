
Vue.component('info-graph', {
	data: function () {
		return {
			graphID:"",
			infoID:"",
			input: "",
			type: "gender",
			gender:"全部",
			minAge:20,
			maxAge: 100,
			county:"全部",
			living:"全部",
			graphTitle: "",
			graphDesc: "",
			unit: "人",
			header: "",
			isOpen: false,
			mapOption: 1,
			map: ""
		};
	},
	template: '\
		<div class="info-graph half-w">\
			<div class="panel-bt" v-on:click="OpenPanel();">篩選</div>\
			<div class="graph-title">{{graphTitle}}</div>\
			<div v-show="type === \'county\'" class="option-container">\
				<div class="option-bt"\
					v-bind:class="{selected: mapOption === 1}"\
					v-on:click="ChangeMapOption(1);">\
					地圖\
				</div>\
				<div class="option-bt"\
					v-bind:class="{selected: mapOption === 2}"\
					v-on:click="ChangeMapOption(2);">\
					排序\
				</div>\
			</div>\
			<svg v-bind:id="graphID"></svg>\
			<div class="center" v-bind:id="infoID">{{graphDesc}}</div>\
			<div class="option-panel" v-bind:class="OpenClass()">\
				<div class="graph-title">篩選</div>\
				<div v-show="type !== \'gender\'">\
					<div class="label">姓別</div>\
					<select v-model="gender" v-on:change="UpdateGraph();">\
						<option value="全部">全部</option>\
						<option v-for="g in header.gender" v-bind:value="g.id">{{g.name}}</option>\
					</select>\
				</div>\
				<div v-show="type !== \'county\'">\
					<div class="label">縣市</div>\
					<select v-model="county" v-on:change="UpdateGraph();">\
						<option value="全部">全部</option>\
						<option v-for="c in header.county" v-bind:value="c.id">{{c.name}}</option>\
					</select><br>\
				</div>\
				<div v-show="type !== \'age\'">\
					<div class="label">年齡</div>\
					<select v-model="minAge" v-on:change="UpdateGraph();">\
						<option v-for="a in header.age" v-if="a.minAge>0" v-bind:value="a.minAge">{{a.minAge}}</option>\
					</select> ~ \
					<select v-model="maxAge" v-on:change="UpdateGraph();">\
						<option v-for="a in header.age" v-if="a.maxAge>0" v-bind:value="a.maxAge">{{a.maxAge}}</option>\
					</select><br>\
				</div>\
				<div v-show="type !== \'living\'">\
					<div class="label">居住</div>\
					<select v-model="living" v-on:change="UpdateGraph();">\
						<option value="全部">全部</option>\
						<option v-for="l in header.living" v-bind:value="l.id">{{l.name}}</option>\
					</select>\
				</div>\
				<div class="bt-container">\
					<div class="bt" v-on:click="ResetValue();">重設</div>\
					<div class="bt" v-on:click="ClosePanel();">確定</div>\
				</div>\
			</div>\
		</div>',
	created: function(){
		this.map = new MapTW();
		this.graphID = "graph_"+this._uid;
		this.infoID = "info_"+this._uid;
		$.get("/static/header.json",function(data){
			this.header = data;
		}.bind(this));
		window.addEventListener('resize', this.UpdateGraph);
	},
	methods: {
		OpenPanel: function(){
			this.isOpen = true;
		},
		ClosePanel: function(){
			this.isOpen = false;
		},
		UpdateGraph: function(){
			$("#"+this.infoID).text("");
			switch(this.type){
				case "gender":
					this.DrawGender();
					break;
				case "county":
					this.DrawCounty();
					break;
				case "age":
					this.DrawAge();
					break;
				case "living":
					this.DrawLiving();
					break;
			}
		},
		FilterData: function(){
			var gender = this.gender;
			var minAge = this.minAge;
			var maxAge = this.maxAge;
			var county = this.county;
			var living = this.living;
			var header = this.header;
			var arr = this.input;

			switch(this.type){
				case "gender":
					this.graphTitle = "性別分佈";
					gender = "全部";
					break;
				case "county":
					this.graphTitle = "縣市分佈";
					county = "全部";
					break;
				case "age":
					this.graphTitle = "年齡分佈";
					minAge = 20;
					maxAge = 100;
					break;
				case "living":
					this.graphTitle = "居住型態分佈";
					living = "全部";
					break;
			}

			if(gender != "全部"){
				var gID = parseInt(gender);
				arr = arr.filter(function(d){
					return d.gender == gender;
				});
				this.graphTitle += " - "+header.county[gID].name;
			}
			if(county != "全部"){
				var cID = parseInt(county);
				arr = arr.filter(function(d){
					return d.county == county;
				});
				this.graphTitle += " - "+header.county[cID].name;
			}
			if(minAge != 20 || maxAge != 100){
				arr = arr.filter(function(d){
					var aID = parseInt(d.age);
					var age = header.age[aID];
					return age.minAge >= minAge && age.maxAge <= maxAge;
				});
				this.graphTitle += " - "+minAge+"歲 ~ "+maxAge+"歲";
			} 
			if(living != "全部"){
				var lID = parseInt(living);
				arr = arr.filter(function(d){
					return d.living == living;
				});
				this.graphTitle += " - "+header.living[lID].name;
			}
			return arr;
		},
		DrawGender: function(){
			var header = this.header;
			var arr = this.FilterData();

			var genderGroup = d3.nest()
				.key(function(d) {
					var gID = parseInt(d.gender);
					var gender = header.gender[gID].name;
					return gender;
				})
				.rollup(function(arr){
					return d3.sum(arr,function(d){
						return d.num;
					});
				})
				.entries(arr);

			var total = d3.sum(genderGroup,function(d){return d.values;});
			for(var i=0;i<genderGroup.length;i++){
				genderGroup[i].ratio = (100*genderGroup[i].values/total).toFixed(1);;
			}

			var param = {};
			param.selector = "#"+this.graphID;
			param.textInfo = "#"+this.infoID;
			param.value = "values";
			param.key = "key";
			param.data = genderGroup;
			param.inRadius = 50;
			param.color = function(i){
				var arr = ["#000000","#A1AFC9","#F47983"];
				return arr[i];
			};
			var unit = this.unit;
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.data.values);
				return d.data.key+" "+num+unit+" ("+d.data.ratio+"%)";
			};
			g_SvgGraph.PieChart(param);

		},
		DrawAge: function(){
			var header = this.header;
			var arr = this.FilterData();

			var ageGroup = d3.nest()
				.key(function(d) {return d.age;})
				.rollup(function(arr){
					return d3.sum(arr,function(d){
						return d.num;
					}); 
				})
				.entries(arr);

			var total = d3.sum(ageGroup,function(d){return d.values;});
			for(var i=0;i<ageGroup.length;i++){
				var ageID = parseInt(ageGroup[i].key);
				var age = header.age[ageID];
				ageGroup[i].minAge = age.minAge;
				ageGroup[i].maxAge = age.maxAge;
				ageGroup[i].ratio = (100*ageGroup[i].values/total).toFixed(1);
			}

			var maxV = d3.max(ageGroup,function(d){return d.values;});
			var param = {};
			param.selector = "#"+this.graphID;
			param.keyXMin = "minAge";
			param.keyXMax = "maxAge";
			param.minX = 20;
			param.maxX = 85;
			param.keyY = "values";
			param.minColor = "#FF9999";
			param.maxColor = "#996666";
			param.unitX = "歲";
			param.unitY = "人";
			param.textInfo = "#"+this.infoID;
			param.data = ageGroup;
			param.maxValue = maxV;
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.values);
				var str = d.minAge+"~"+d.maxAge+"歲 "+num+"人";
				str += " ("+d.ratio+"%)";
				return str;
			};
			g_SvgGraph.Histogram(param);
		},
		DrawCounty: function(){
			var header = this.header;
			var arr = this.FilterData();

			var countyGroup = d3.nest()
			.key(function(d) {
				var countyID = parseInt(d.county);
				var county = header.county[countyID].name;
				return county;
			})
			.rollup(function(arr){
				return d3.sum(arr,function(d){
					return d.num;
				}); 
			})
			.map(arr);

			var total = 0;
			for(v in countyGroup){
				total += countyGroup[v];
			}
			countyGroup["總計"] = total;

			var param = {};
			param.map = this.map;
			param.year = 2017;
			param.type = this.mapOption;
			param.selector = "#"+this.graphID;
			param.minBound = 100;
			param.maxBound = 20000;
			param.minColor = "#FFFFFF";
			param.maxColor = "#999999";
			param.textInfo = "#"+this.infoID;
			param.data = countyGroup;
			param.unit = "人";
			g_SvgGraph.MapTW(param);
		},
		DrawLiving: function(){
			var header = this.header;
			var arr = this.FilterData();

			var livingGroup = d3.nest()
				.key(function(d) {
					var liveID = parseInt(d.living);
					var living = header.living[liveID].name;
					return living;
				})
				.rollup(function(arr){
					return d3.sum(arr,function(d){
						return d.num;
					}); 
				})
				.entries(arr);
        
			var total = d3.sum(livingGroup,function(d){return d.values;});
			for(var i=0;i<livingGroup.length;i++){
				livingGroup[i].ratio = (100*livingGroup[i].values/total).toFixed(1);
			}

			var param = {};
			param.selector = "#"+this.graphID;
			param.textInfo = "#"+this.infoID;
			param.value = "values";
			param.key = "key";
			param.data = livingGroup;
			param.inRadius = 50;
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.data.values);
				return d.data.key+" "+num+"人 ("+d.data.ratio+"%)";
			};
			g_SvgGraph.PieChart(param);
		},
		OpenClass: function(){
			return {"open": this.isOpen};
		},
		ChangeMapOption: function(option){
			this.mapOption = option;
			this.UpdateGraph();
		},
		ResetValue: function(){
			this.gender = "全部";
			this.minAge = 20;
			this.maxAge = 100;
			this.county = "全部";
			this.living = "全部";
			this.UpdateGraph();
		}
	}
});