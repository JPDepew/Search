// Filename:  search.js

function Validate(thisform)
   {
   var val = thisform.searchkey.value;
   //var obj = document.getElementById("searchkey");
   //var val = obj.value;

   if (val == "")
      {
      alert("Search key field not filled in.");
      return false;
      }

   if (val.search(/^[A-Za-z _0-9\+-\.=#:]+$/) != 0)
      {
      alert("Incorrect form for searchkey field.");
      return false;
      }

   return true;
   }

