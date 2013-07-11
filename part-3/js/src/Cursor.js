trpg.Cursor = function() {
	"use strict";
	this.gridX = 0 ;
	this.gridY = 0 ;
	this.x = 0 ;
	this.y = 0 ;
	this.alpha = 0.8 ;
	this.render() ;
};
trpg.Cursor.prototype = _.extend( new createjs.Shape() , {

	render : function() {
		"use strict";
		var h_grid = trpg.GRID / 2 ;
		this.graphics.setStrokeStyle( 2 )
			.beginStroke( '#ffdb95' )
			.beginRadialGradientFill( [ "rgba(255,255,255,0.4)", "rgba(255,255,255,0.1)" ], [ 0, 1 ], h_grid, h_grid, 0, h_grid, h_grid, 50)
			.drawRect( 0 , 0 , trpg.GRID , trpg.GRID );
	},

	onKeyPress : function( e ){
		"use strict";
		if( e.keyCode === 38 ) { // up
			this.gridY = Math.max( trpg.bounds.top , this.gridY - 1 ) ;
			return this.position() ;
		} else if( e.keyCode === 40 ) { // down
			this.gridY = Math.min( trpg.bounds.bottom , this.gridY + 1 ) ;
			return this.position()  ;
		} else if( e.keyCode === 37 ) { // left
			this.gridX = Math.max( trpg.bounds.left , this.gridX - 1 ) ;
			return this.position()  ;
		} else if( e.keyCode === 39 ){  // right
			this.gridX = Math.min( trpg.bounds.right , this.gridX + 1 ) ;
			return this.position()  ;
		}
	},

	position : function( ){
		"use strict";
		this.x = ( this.gridX * trpg.GRID )  ;
		this.y = ( this.gridY * trpg.GRID )  ;
		return false ;
	}
});