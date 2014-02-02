var Starfield = function(element) {
	element = $(element)
	var starScale = new MappingJS.ValueScale(0,1,0,3)
	var screenScaleX = new MappingJS.ValueScale(0,1,0,element.innerWidth())
	var screenScaleY = new MappingJS.ValueScale(0,1,0,element.innerHeight())
	var speed = 500000
	var numberOfStars = 200

	var paper = Raphael(element[0], element.innerWidth(), element.innerHeight());
	var stars = paper.set();

	for (var i = 0; i < numberOfStars; i++) {
		var x = screenScaleX.scale(Math.random(Date.now()))
		var y = screenScaleY.scale(Math.random(Date.now()))
		var size = starScale.scale(Math.random(Date.now()))

		var circle = paper.circle(x, y, size);
		circle.attr("fill", "#fff");
		stars.push(circle)
	};


	var transString = "r" + (-360)+","+element.innerWidth()/2+","+element.innerHeight()/2;
	var aniObject = Raphael.animation( {transform: transString}, speed, "linear");
	stars.animate(aniObject.repeat(Infinity))

	var myS = new Sternschnuppe(paper)

	window.setInterval(yourfunction, 2000);
	function yourfunction() { 
		myS.fire()		
	}

}

var Sternschnuppe = function(paper) {
	this.paper = paper;
	var starScale = new MappingJS.ValueScale(0,1,0,3)
	var screenScaleX = new MappingJS.ValueScale(0,1,0,window.innerWidth)
	var screenScaleY = new MappingJS.ValueScale(0,1,0,window.innerHeight)

	this.fire = function() {
		var fx = screenScaleX.scale(Math.random(Date.now()))
		var fy = screenScaleY.scale(Math.random(Date.now()))
		var tx = screenScaleX.scale(Math.random(Date.now()))
		var ty = screenScaleY.scale(Math.random(Date.now()))
		var ssize = starScale.scale(Math.random(Date.now()))
		var sternSchnuppe = this.paper.circle(fx,fy,ssize)
		var sternSchnuppenAnimation = Raphael.animation( {cx: tx, cy:ty, fill:"#000"}, 1000, "easeOut");
		sternSchnuppe.attr("fill", "#fff");
		sternSchnuppe.animate(sternSchnuppenAnimation)
	}
}