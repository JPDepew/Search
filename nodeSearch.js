// 11/16/2016 John Paul Depew   Ryan Taylor   Jordan Reyna
// nodeSearch.js

var express = require('express');
var http = require('http');
var lineReader = require('line-reader');
var url  = require('url');
var include = require("underscore.string/include");  // A way to require just one function.
var fs = require('fs');
/*
var options = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem')
};
*/

/* Given: res	the response
	  key	variable containing the valid search term
   Task: Formats the key so that it can be used with the function include 
	 to search for matching substrings in the keywordfile3.
	 Format the matching strings to be readable on a webpage.
	 Displays the results in a list on the webpage.
   Return: Nothing

*/
function validSearch(res, key){
   	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Search Results</title></head><body><h2>Search Results</h2><ol>');
        //**** Insert one or more newlines in long strings of output. It may make it easier for the HTML to get interpreted if it gets newlines to flush things out. **
		 
	var resultLower = key.toLowerCase();
	var target = /*"%" + */resultLower;// + "%";
	var count = 0;

	lineReader.eachLine('keywordfile', function(line, last){
		console.log('got inside line reader');
		// Checks if target is a substring in line
		if(include(line, target)){
			var tarArray = line.split("|");
			//console.log("tarArray: " + tarArray);
			var address = tarArray[2]; //"http://10.188.140.212/" + tarArray[3];
			//console.log("address: " + address);
			var Description = tarArray[1].split("|");
			res.write('<li><a href="' + address + '">' + address + '</a>' + ' '  + tarArray[1] + '</li>');  //**** End it with a newline. ***
			count++;
		}
		if(last){
			if (count == 0){
				res.end('<li>No matches found.</li></ol></body></html>\n');
			}
			else{
				res.end('</ol></body></html>\n');
			}
				    
		}
	});

}

// Express app
var app = express()

	app.get('/nodeSearch', function(req, res, next){
				

		var parts = url.parse(req.url, true);
		var key = parts.query.searchTerm;
		console.log(key);
                if(key != null){
                       // res.write('Search: ' + key + '\n');

			if( key === null || key === "null" || key.length < 2
			 || key.length > 48 || key.search(/^[A-Za-z _0-9\+-\.=#:]+$/) != 0 )
			{
			   res.send(400, {status: 'Invalid Search Term'});
			}

			else
			{
			   // If it is a valid search key, proceed to display the list of web pages with matching terms
			   validSearch(res, key);
			}

                }
		else{
			res.end('Body does not have search.');  //*** Does not have a search term. ********************

		}
	})
	
	app.all('/nodeSearch', function (req, res, next) {
		res.send(501, {status: 'Invalid Behavior (Put, Post, Delete)'});
	})



// Register with http
http.createServer(/*options, // used for https */app)
        .listen(3000);
