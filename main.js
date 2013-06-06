
mime.load('/etc/mime.types');

//var async = require('async');
var youtube = require('./youtube');
var fs = require('fs');

var video_urls =
[
	'http://www.youtube.com/watch?v=AaXgxUZ4r9k',
	'http://www.youtube.com/watch?v=vq8MTRtt7NM'
];

var yt = new youtube(
{
//	proxy: 'http://10.126.1.4:8080'
});

yt.getInfo(video_urls, function(response)
{
	// all videos
	for(var i in response)
	{
//		console.log("id: "+i);
		// all versions of all videos
		for(var j in response[i])
		{
/*			
			console.log("type: "+response[i][j]['type']);
			console.log("quality: "+response[i][j]['quality']);
*/
			get(i, response[i][j]);

			// break to get only the first version
			break;
		}
	}
});

function get(index, obj)
{
	var ext = obj['type'];
	ext = obj['type'].replace(/;[^$]+$/, '');
	ext = mime.extension(ext);
	if(ext=='webm' || ext=='mp4')
	{
		var filename = "/tmp/"+index+"."+ext;
		yt.getVideo(obj['url'], function(response)
		{
			fs.writeFile(filename, response);
		});
	}
}