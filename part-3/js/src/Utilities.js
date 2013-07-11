trpg.Utilities = {
	perf_test : function ( method , context , flag ){
		"use strict" ;
		console.time( flag );
		method.call( context ) ;
		console.timeEnd(flag);
	},

	getRandomInt : function (min, max) {
		"use strict" ;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
};

// C-style array implementation
// Speed tests were only semi-conclusive, but we'll see how it works out down the road.
trpg.Utilities.CArray = function( numColumns , numRows ){
	"use strict";
	this.NCOLS = numColumns ;
	this.NROWS = numRows ;
	this.__vals = [] ;
};

trpg.Utilities.CArray.prototype = {
	get : function( row , col ){
		"use strict";
		return this.__vals[ row * this.NCOLS + col ] ;
	},
	set : function( row , col , value ){
		"use strict";
		this.__vals[ row * this.NCOLS + col ] = value  ;
	}
};
