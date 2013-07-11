trpg.Board = function( image ){
	"use strict";
	this.x = 0 ;
	this.y = 0 ;
	this.gridX = 0 ;
	this.gridY = 0 ;
	this.tiles = undefined ;
	this.initialize( image ) ;
} ;

trpg.Board.prototype = _.extend( new createjs.Container() , {

	initialize : function( image ) {
		"use strict";
		_.bindAll( this ) ;
		trpg.bounds.bottom =  Math.floor( image.height / trpg.GRID ) - 1 ;
		trpg.bounds.right = Math.floor( image.width / trpg.GRID ) - 1 ;
		this.render( image );
		this.cursor = new trpg.Cursor() ;
		this.addChild( this.cursor ) ;
		this.tiles = new trpg.Utilities.CArray( 20, 40 ) ;

		window.onkeydown = _.throttle( this.onKeyPress , 100 );
	},

	render : function( image ) {
		"use strict";
		var board = new createjs.Container( ),
			bg = new createjs.Bitmap( image ) ,
			grid = new createjs.Shape() ;

		board.x = board.y = grid.x = grid.y = bg.x = bg.y = 0;

		grid.graphics.beginFill( createjs.Graphics.getRGB( 0, 0, 0 , 0.4 ) ) ;

		for( var i = trpg.GRID ; i <= image.width ; i += trpg.GRID ){
			grid.graphics.drawRect( i  , 0 , 1 , image.height );
		}
		for( i = trpg.GRID ; i < image.height ; i += trpg.GRID ){
			grid.graphics.drawRect( 0  , i , image.width , 1 );
		}
		board.addChild( bg ) ;
		board.addChild( grid ) ;
		board.cache( 0 , 0 , image.width , image.height ) ;
		this.addChild( board ) ;
	} ,

	onKeyPress : function( e ){
		"use strict";
		if( e.keyCode >= 37  && e.keyCode <= 40) {
			this.cursor.onKeyPress( e ) ;
			this.position( ) ;
			return false ;
		}
	},
	position : function( ){
		"use strict";
		var boundingbox = {
			top : this.gridY + 1 ,
			left : this.gridX + 1 ,
			bottom : this.gridY + trpg.viewport.height - 1 ,
			right : this.gridX + trpg.viewport.width - 1
		};

		if( this.cursor.gridY < boundingbox.top ){
			this.gridY = Math.max( trpg.bounds.top , this.gridY - 1 ) ;
		} else if( this.cursor.gridY > boundingbox.bottom ){
			this.gridY = Math.min( trpg.bounds.bottom - trpg.viewport.height , this.gridY + 1 ) ;
		}

		if( this.cursor.gridX < boundingbox.left ) {
			this.gridX = Math.max( trpg.bounds.left , this.gridX - 1 ) ;
		}
		else if( this.cursor.gridX > boundingbox.right ){
			this.gridX = Math.min( trpg.bounds.right - trpg.viewport.width , this.gridX + 1 ) ;
		}
		this.x = ( this.gridX * trpg.GRID ) * -1 ;
		this.y = ( this.gridY * trpg.GRID ) * -1 ;

	}
});