/*
* This is the function for dealing with history search
* Format:  history projectName xxxx/xx/xx
* */


var history = function(msg)
{
    this.searchHistory = function(msg) {

        console.log('The message is ' + msg);
        //Delete all blank space in msg
        var result;
        result = msg.replace(/(^\s+)|(\s+$)/g,"");
        result = result.replace(/\s/g,"");
        msg = result;
        var len = msg.length;
        //about the date format,people will tend to type 2015/1/1 instead of 2015/01/01
        //it has to be fixed
        console.log("second one is "+msg.substr(len-2,1));
        if(msg.substr(len-2,1) == '/')
        {
            var front = msg.substr(0,len-1);
            var middle = '0';
            var end = msg.substr(len-1,1);
            console.log('message fixing '+front+''+middle+''+end);
            msg = front+middle+end;
            len++;
        }
        if(msg.substr(len-5,1) =='/')
        {
            var front = msg.substr(0,len-4);
            var middle = '0';
            var end = msg.substr(len-4,4);
            console.log('message fixing '+front+''+middle+''+end);
            msg = front+middle+end;
            len++;
        }
        console.log("This is history "+msg.substr(0, 7).toLowerCase());
        console.log("This is Project name "+msg.substr(7, len-17).toLowerCase());
        console.log("This is Date "+msg.substr(len-10, len).toLowerCase());

        if (msg.substr(0, 7).toLowerCase() == 'history') {
            var date = msg.substr(8);

        }
        else {
            console.log('Wrong format,coming from history.js');
            return;
        }
    };
};




module.exports = new history();