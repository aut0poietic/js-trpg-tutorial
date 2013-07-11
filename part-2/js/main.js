/**
 *	JavaScript originally posted on Irresponsible Art in
 *	the article "TRPG in JavaScript 2" available at
 *	http://irresponsibleart.com/2013/03/trpg-in-javascript-2/.
 *
 *	Copyright (C) 2013, Jer Brand / Irresponsible Art (http://irresponsibleart.com).
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 *	documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 *	rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 *	permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all copies or substantial
 *	portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 *	THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var trpg = {
        GRID         : 50 ,
        MAX_TILES_W  : 20 ,
        MAX_TILES_H  : 10 ,
        FPS          : 60 ,
        viewport     : { width  : 0 , height : 0 , top    : 0 , left   : 0  } ,
        bounds       : { top : 0, left : 0 ,  bottom: 0 , right: 0 }
} ;
trpg.Utilities = {
    perf_test : function ( method , context , flag ){
        console.time( flag );
        method.call( context ) ;
        console.timeEnd(flag);
    },
    
    getRandomInt : function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

trpg.TilesArray = function( ){
    this.NCOLS = 20 ;
    this.NROWS = 40 ;
    this.tiles = [] ;
    
    this.initialize() ;
};
trpg.TilesArray.prototype = {
    initialize : function()
    {
        for( var c = 0 ; c < this.NCOLS ; c++ ){
            for( var r = 0 ; r < this.NROWS ; r++ ){
                var t = { 
                        cost : trpg.Utilities.getRandomInt( 1, 3 ) ,
                        row : r ,
                        col : c 
                    } ;
                this.set( r , c , t ) ;
            }   
        }
    },
    get : function( row , col ){
        return this.tiles[ row * this.NCOLS + col ] ;
    },
    set : function( row , col , value ){
        this.tiles[ row * this.NCOLS + col ] = value  ;
    }
};

trpg.Gameboard = function( image ){
    this.x = 0 ;
    this.y = 0 ;
    this.gridX = 0 ;
    this.gridY = 0 ;
    this.tiles = undefined ;
    this.initialize( image ) ;
} ;
trpg.Gameboard.prototype = _.extend( new createjs.Container() , {
    
    initialize : function( image )
    {
        _.bindAll( this ) ;
        trpg.bounds.bottom =  Math.floor( image.height / trpg.GRID ) - 1 ;
        trpg.bounds.right = Math.floor( image.width / trpg.GRID ) - 1 ;
        this.render( image );
        this.cursor = new trpg.Cursor() ;
        this.addChild( this.cursor ) ;
        this.tiles = new trpg.TilesArray() ;
        
        window.onkeydown = _.throttle( this.onKeyPress , 100 );
    },
    
    render : function( image )
    {
        var board = new createjs.Container( ),
            bg = new createjs.Bitmap( image ) , 
            grid = new createjs.Shape() ;
            
        board.x = board.y = grid.x = grid.y = bg.x = bg.y = 0;
            
        grid.graphics.beginFill( createjs.Graphics.getRGB( 255, 255, 255 , 0.4 ) ) ;
        
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
        if( e.keyCode >= 37  && e.keyCode <= 40) { 
            this.cursor.onKeyPress( e ) ;
            this.position( ) ;
            return false ;
        }
    },
    position : function( )
    {
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



trpg.Cursor = function() {
    this.gridX = 0 ;
    this.gridY = 0 ;
    this.x = 0 ;
    this.y = 0 ;
    this.alpha = 0.8 ;
    this.render() ;
};
trpg.Cursor.prototype = _.extend( new createjs.Shape() , {
    
    render : function()
    {
        this.graphics.setStrokeStyle( 2 );
        this.graphics.beginStroke( '#446cec' ) ;
        this.graphics.drawRect( 0 , 0 , trpg.GRID , trpg.GRID );
    },
    
    onKeyPress : function( e ){
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
    
    position : function( )
    {
        this.x = ( this.gridX * trpg.GRID )  ;
        this.y = ( this.gridY * trpg.GRID )  ;
        return false ;
    }
});

trpg.Engine = function(){
    this.tiles      = [];
    this.stage      = undefined ;
    this.canvas     = undefined ;
    this.loadQueue  = undefined ;
    this.board      = undefined ;
};

trpg.Engine.prototype  =  { 
        
    initialize : function(){
        _.bindAll( this );
        this.canvas = document.getElementById( "game" );
        this.stage = new createjs.Stage( this.canvas ); 
        createjs.Ticker.setFPS( trpg.FPS );
        createjs.Ticker.addEventListener( "tick" , this.stage );

        this.beginPreload() ;
    },
    
    beginPreload : function(){
        var manifest = [
            { src:"img/encounter-optimized.jpg" , id:"gameboard" }
        ];
        this.loadQueue = new createjs.LoadQueue( false );
        this.loadQueue.addEventListener( "complete" , _.bind( this.preloadComplete , this ) );
        this.loadQueue.loadManifest( manifest );
    } ,
    
    preloadComplete : function(){
        this.onWindowResize() ; 
        var img = this.loadQueue.getResult( "gameboard" ) ;
        this.board = new trpg.Gameboard( img );
        this.stage.addChild( this.board ) ;
        this.addEvents() ;
    },
    
    addEvents: function(){
        window.onresize = _.throttle( this.onWindowResize , 100 );
    },
    
    onWindowResize : function( e ){
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

window.onload = function(){ 
    trpg.instance = new trpg.Engine() ;
    trpg.instance.initialize() ; 
    window.focus() ;
}  ;