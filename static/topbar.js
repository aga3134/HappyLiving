
Vue.component('topbar', {
	data: function () {
		return {
			logoImg: "/static/Image/logo.png",
			menuImg: "/static/Image/menu-button.png",
			version: "1.0.0",
			isOpen: false,
    		itemList: [{name:"資料分析",link:"/analysis"},
    					{name:"研究方法",link:"/method"},
    					{name:"開放資料",link:"/opendata"},
    					{name:"關於本站",link:"/about"}]
		};
	},
	template: '\
		<div>\
			<div class="topbar">\
				<a href="/"><img class="logo" v-bind:src="BindVersion(logoImg,version)"></a>\
				<img class="menu-bt" v-bind:src="BindVersion(menuImg,version)" v-on:click="ToggleMenu();">\
				<div class="bt-container">\
					<a v-for="item in itemList" v-bind:href="item.link">\
						<div class="bt">{{item.name}}</div>\
					</a>\
				</div>\
			</div>\
			<ul class="menu-container" v-bind:class="OpenClass">\
				<li v-for="item in itemList">\
					<a v-bind:href="item.link">{{item.name}}</a>\
				</li>\
			</ul>\
		</div>',
	created: function(){
		window.addEventListener('resize', this.OnWinResize);
	},
	methods: {
		ToggleMenu: function(){
			this.isOpen = !this.isOpen;
		},
		BindVersion: function(src,version){
			return src+"?v="+version;
		},
		OnWinResize: function(){
			this.isOpen = false;
		}
	},
	computed: {
		OpenClass: function () {
			return {
				"open": this.isOpen	
			};
		}
	}
});