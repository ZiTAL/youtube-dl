youtube-dl
==========

youtube download library for node.js

example
=======
```
npm install youtube-dl
```

```
var youtube = require('youtube-dl');

youtube(
{
	path: '/tmp',
	links:
	[
		'https://www.youtube.com/watch?v=1XYMzAIj7BQ',
		'https://www.youtube.com/watch?v=OBR-A_YfxJ8'
	],
	//	proxy: 'http://10.126.1.4:8080'
});
```

license
=======

AGPL: http://www.gnu.org/licenses/agpl-3.0.txt

thanks to
=========

http://coding-everyday.blogspot.com.es/2013/03/how-to-grab-youtube-playback-video-files.html

https://github.com/edse/keepvideos