// http://coding-everyday.blogspot.com.es/2013/03/how-to-grab-youtube-playback-video-files.html
// https://github.com/edse/keepvideos

// npm install request
var request = require('request');

// npm install mime
var mime = require('mime');
//mime.load('/etc/mime.types');
mime.load('./mime.types');

var fs = require('fs');

var youtube = function(config)
{
	var params = {};

	this.init = function(config)
	{
		params = config;
		if(params['proxy']!==null)
		{
			r = request.defaults(
			{
				proxy: params['proxy']
			});
		}
		else
			r = request.defaults();
	};

	this.getInfo = function(array, callback)
	{
		var self = this;
		var info = {};
		var video_ids = this.getVideoIds(array);
		var tmp = 0;

		for(var i in video_ids)
		{
			(function(j)
			{
				r("http://www.youtube.com/get_video_info?video_id="+video_ids[i], function(error, response, body)
				{
					info[video_ids[j]] = self.getVideoInfo(body);
					tmp++;
					if(tmp==video_ids.length && typeof callback ==='function')
						callback(info);
				});
			})(i);
		}
	};

	this.getVideoIds = function(array)
	{
		var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
		var ids = [];

		for(var i in array)
		{
			var match = array[i].match(regExp);
			if(match)
				ids.push(match[1]);
		}

		return ids;
	};

	this.getVideoInfo = function(str)
	{
		var info = {};
		this.parseStr(str, info);

		var streams = info['url_encoded_fmt_stream_map'].split(',');

		var results = [];
		for(var i=0; i<streams.length; i++)
		{
			var real_stream = {};
			this.parseStr(streams[i], real_stream);
			real_stream['url'] += '&signature=' + real_stream['sig'];
			results.push(real_stream);
		}

		return results;
	};

	this.getVideo = function(url, callback)
	{
		r(url, function(error, response, body)
		{
			if(typeof callback === 'function')
				callback(body);
		});
	};

	this.parseStr = function(str, array)
	{
		// https://github.com/kvz/phpjs/blob/master/functions/strings/parse_str.js
		var strArr = String(str).replace(/^&/, '').replace(/&$/, '').split('&'),
		sal = strArr.length,
		i, j, ct, p, lastObj, obj, lastIter, undef, chr, tmp, key, value,
		postLeftBracketPos, keys, keysLen,
		fixStr = function (str)
		{
			return decodeURIComponent(str.replace(/\+/g, '%20'));
		};

		if (!array)
			array = this.window;

		for (i = 0; i < sal; i++)
		{
			tmp = strArr[i].split('=');
			key = fixStr(tmp[0]);
			value = (tmp.length < 2) ? '' : fixStr(tmp[1]);

			while (key.charAt(0) === ' ')
				key = key.slice(1);

			if (key.indexOf('\x00') > -1)
				key = key.slice(0, key.indexOf('\x00'));

			if (key && key.charAt(0) !== '[')
			{
				keys = [];
				postLeftBracketPos = 0;
				for (j = 0; j < key.length; j++)
				{
					if (key.charAt(j) === '[' && !postLeftBracketPos)
						postLeftBracketPos = j + 1;

					else if (key.charAt(j) === ']')
					{
						if (postLeftBracketPos)
						{
							if (!keys.length)
								keys.push(key.slice(0, postLeftBracketPos - 1));

							keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
							postLeftBracketPos = 0;
							if (key.charAt(j + 1) !== '[')
								break;
						}
					}
				}
			}
			if (!keys.length)
				keys = [key];

			for (j = 0; j < keys[0].length; j++)
			{
				chr = keys[0].charAt(j);
				if (chr === ' ' || chr === '.' || chr === '[')
					keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);

				if (chr === '[')
					break;
			}

			obj = array;
			for (j = 0, keysLen = keys.length; j < keysLen; j++)
			{
				key = keys[j].replace(/^['"]/, '').replace(/['"]$/, '');
				lastIter = j !== keys.length - 1;
				lastObj = obj;
				if ((key !== '' && key !== ' ') || j === 0)
				{
					if (obj[key] === undef)
						obj[key] = {};

					obj = obj[key];
				}
				else
				{ // To insert new dimension
					ct = -1;
					for (p in obj)
					{
						if (obj.hasOwnProperty(p))
						{
							if (+p > ct && p.match(/^\d+$/g))
								ct = +p;
						}
					}
					key = ct + 1;
				}
			}
			lastObj[key] = value;
		}
	};

	this.init(config);
};

module.exports = youtube;