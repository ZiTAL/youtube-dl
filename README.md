youtube-dl
==========

youtube download library for node.js


dependencies
============

```
npm install request
npm install mime
```

example
=======

```
var youtube = require('./youtube-dl');

new youtube(
{
    path: '/tmp',
    links:
    [
    	'https://www.youtube.com/watch?v=fSUFdW-U7mY', // sepultura orgasmatron
//        'https://www.youtube.com/watch?v=1XYMzAIj7BQ', // sepultura barcelona
        'https://www.youtube.com/watch?v=OBR-A_YfxJ8' // iron maiden (error)
    ],
    //  proxy: 'http://10.126.1.4:8080',
    onError: function(id, error)
    {
    	console.log("Error downloading id:"+id);
    	console.log("Message: "+error['reason'].replace(/<[\s\S]+>/, '')+"\n");
    },
    onStart: function(id)
    {
    	console.log("Start downloading: "+id);
    },
    onFinish: function(id, filename)
    {
    	console.log("Finished downloading, file "+filename+" saved\n");
    }
});

```

license
=======

AGPL: http://www.gnu.org/licenses/agpl-3.0.txt

thanks to
=========

http://coding-everyday.blogspot.com.es/2013/03/how-to-grab-youtube-playback-video-files.html

https://github.com/edse/keepvideos