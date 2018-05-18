
var g_Util = function(){
	var NumberWithCommas = function(x){
		if(!x) return "";
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	var ColorCategory = function(size){
		var step = 360.0/size;
		var arr = [];
		for(var i=0;i<size;i++){
			arr.push(d3.hsl(i*step,0.6,0.7));
		}
		return function(i){return arr[i].toString();};
	};
	var GetUrlParameter = function(){
		var queryStr = decodeURIComponent(window.location.search.substring(1));
		var paramArr = queryStr.split('&');

		var result = {};
		for (var i=0; i<paramArr.length; i++) {
			var param = paramArr[i].split('=');
			result[param[0]] = param[1];
		}
		return result;
	};
	var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

	return {
		NumberWithCommas: NumberWithCommas,
		ColorCategory: ColorCategory,
		GetUrlParameter: GetUrlParameter
	};
}();