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
	var address = new Array();
	var address2 = new Array();
	var resultLower = key.toLowerCase();
	var keyArray = new Array();
	var keyArrayCount = 1;
	var tarArray = new Array();
	var usedAddress = false;

	keyArray = resultLower.split(" ");

	for(var i = 0; i < keyArray.length; i++)
	{
	   keyArrayCount++
	   var count = 0;

	   console.log(keyArray);
	   var target = keyArray[i];
	   console.log(target);

	   // BUG: NOT GOING INTO LINE READER WITH FIRST SEARCH TERM WHEN MORE THAN 1 SEARCH TERM
	   lineReader.eachLine('keywordfile', function(line, last){
	      console.log(target);

	      // Checks if target is a substring in line
	      if(include(line, target)){
	        tarArray = line.split("|");
		address[i] = tarArray[2];
		if(address2 != null)
	        {
	          for(var j = 0; j < address2.length; j++)
	          {
	             if(address2[j] == address[i])
	             {
	                usedAddress = true;
	             }
	          }
                }
	        if(!usedAddress)
	        {
	           res.write('<li><a href="' + address[i] + '">' + address[i] + '</a>' + ' '  + tarArray[1] + '</li>');
	        }
	        usedAddress = false;
	        address2[i] = address[i];
	        count++;
	      }
	      if(last && (keyArrayCount <= keyArray.length)){
	         if (count == 0){
	            res.end('<li>No matches found.</li></ol></body></html>\n');
	         }
	         else
	         {
	            res.end('</ol></body></html>\n');	
	         }    
	      }
	   });
	}
/*
console.log(address[0]);
	for(var i = 0; i < address.length; i++)
	{
		for(var j = 0; j < address.length; i++)
		{
			if(address[i] == address[j])
			{
				i++;
			}
		}
console.log(address[i]);
		res.write('<li><a href="' + address[i] + '">' + address[i] + '</a>' + ' '  + tarArray[1] + '</li>');
	}

*/
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
