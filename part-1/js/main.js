/**
 *	JavaScript originally posted on Irresponsible Art in
 *	the article "TRPG in Javascript 1" available at
 *	http://irresponsibleart.com/2013/03/trpg-in-javascript-1/.
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


var canvas ,
    stage,
    queue,
    gridSquare = 25 ;

window.onload = function(){
    canvas = document.getElementById( "game" );
    stage = new createjs.Stage( canvas );
    createjs.Ticker.setFPS( 24 );
    createjs.Ticker.addEventListener( "tick" , stage );
    var manifest = [
        { src:"img/cropped-bg-small.jpg" , id:"gameboard" }
    ];
    queue = new createjs.LoadQueue( false );
    queue.addEventListener( "complete" , handleComplete );
    queue.loadManifest( manifest );
};

function handleComplete()  {
    var img = queue.getResult( "gameboard" ) ,
        bitmap = new createjs.Bitmap( img );
    bitmap.x = bitmap.y = 0;
    stage.addChild( bitmap );
    drawGrid() ;
}

function drawGrid(){
    var grid = new createjs.Shape() ;
    grid.graphics.beginFill( createjs.Graphics.getRGB( 255, 255, 255 ) ) ;
    for( var i = gridSquare - 1 ; i < canvas.width ; i += gridSquare ){
        grid.graphics.drawRect( i  , 0 , 1 , canvas.height );
    }
    for( i = gridSquare - 1 ; i < canvas.height ; i += gridSquare ){
        grid.graphics.drawRect( 0  , i , canvas.width , 1 );
    }
    grid.alpha = 0.4 ;
    stage.addChild( grid ) ;
}