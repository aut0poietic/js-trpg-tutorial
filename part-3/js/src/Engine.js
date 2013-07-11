
trpg.Engine = function(){
	"use strict";
	this.stage      = undefined ;
	this.canvas     = undefined ;
	this.loadQueue  = undefined ;
	this.board      = undefined ;
};

trpg.Engine.prototype  =  {

	initialize : function(){
		"use strict";
		_.bindAll( this );
		this.canvas = document.getElementById( "game" );
		this.stage = new createjs.Stage( this.canvas );
		createjs.Ticker.setFPS( trpg.FPS );
		createjs.Ticker.addEventListener( "tick" , this.stage );

		this.beginPreload() ;
	},

	beginPreload : function(){
		"use strict";
		var manifest = [
			{ src:"img/terrain-map.jpg" , id:"gameboard" }
		];
		this.loadQueue = new createjs.LoadQueue( false );
		this.loadQueue.addEventListener( "complete" , _.bind( this.preloadComplete , this ) );
		this.loadQueue.loadManifest( manifest );
	} ,

	preloadComplete : function(){
		"use strict";
		this.onWindowResize() ;
		var img = this.loadQueue.getResult( "gameboard" ) ;
		this.board = new trpg.Board( img );
		this.stage.addChild( this.board ) ;
		this.addEvents() ;
	},

	addEvents: function(){
		"use strict";
		window.onresize = _.throttle( this.onWindowResize , 100 );
	},

	onWindowResize : function( e ){
		"use strict";
		var tilesW = Math.floor( document.documentElement.clientWidth / trpg.GRID ),
			tilesH = Math.floor( document.documentElement.clientHeight / trpg.GRID ) ;
		if( tilesW > trpg.MAX_TILES_W ) {
			tilesW = trpg.MAX_TILES_W ;
		}
		if( tilesH > trpg.MAX_TILES_H ) {
			tilesH = trpg.MAX_TILES_H ;
		}
		trpg.viewport.width = tilesW - 1;
		trpg.viewport.height = tilesH - 1 ;

		this.canvas.height = trpg.GRID * tilesH ;
		this.canvas.width = trpg.GRID * tilesW ;
	}
} ;