
// エターナル2013年
// eternal2013.js

new function() {
	// ブラウザが対応しているオーディオ形式を選択
	var audio_ext = (function() {
		var audio = new Audio();
		if (audio.canPlayType("audio/ogg") != "") { return "ogg"; }
		return "mp3";
	})();

	var play_gong = function() {
		var audio = new Audio("gong." + audio_ext);
		audio.play();
	};

	// 普段クリックしたときの関数
	var season_opacity = 1.0;
	var season_delete = function() {
		season_opacity = 1.0 - season_opacity;
		$(".season").animate({opacity: season_opacity}, 500);
	};

	// 日付表示の更新
	var refresh_time = function() {
		var now = new Date();
		var orig = new Date(2013, 12-1, 1);
		var lapse_ms = now.getTime() - orig.getTime();
		var lapse = Math.floor(lapse_ms/1000/60/60/24) + 1;
		
		var ymd = "2013/12/" + lapse;
		var hms =
			("0" + now.getHours()).slice(-2) + ":" +
			("0" + now.getMinutes()).slice(-2) + ":" +
			("0" + now.getSeconds()).slice(-2);
		
		if ($("#dt").text() != ymd) {
			// 日付が変わった
			$("#dt").html(ymd);
			$("#twbtn").html(
				"<a href=\"https://twitter.com/share\" " +
				"class=\"twitter-share-button\"{count} " +
				"data-url=\"https://mg32.github.io/eternal2013/\" " +
				"data-text=\"エターナル2013年\n本日は 2013年12月" + lapse +
				"日 です。\n\"data-lang=\"ja\">ツイート</a>\n");
			if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
				window.twttr.widgets.load();
			}
			refresh_image();
			refresh_snow();
		}
		
		$("#tm").html(hms);
	};

	var refresh_image = function() {
		var now = new Date();
		var m = now.getMonth() + 1;
		var d = now.getDate();
		
		var filename = "";
		var clickfunc = null;
		switch (m) {
		case 7:
		case 8:
			// 7～8月は夏仕様
			filename = "image/natsu" + Math.floor(Math.random()*5) + ".png";
			clickfunc = season_delete;
			break;
			
		case 12:
			if (d >= 30) {
				// 12/30, 12/31は大晦日仕様
				filename = "image/gong.png";
				clickfunc = play_gong;
			} else {
				// 12月はクリスマス仕様
				filename = "image/xmas" + Math.round(Math.random()) + ".png";
				clickfunc = season_delete;
			}
			break;
		}
		
		// 画像ファイルを設定
		if (filename != "") {
			$(".seasonimg").each(function(i, elem) {
				$(elem).attr("src", filename);
			});
		}
		
		// 画像クリック時のイベントを設定
		if (clickfunc != null) {
			$(".seasontop").unbind().click(clickfunc);
		}
	};

	var refresh_snow = function() {
		var now = new Date();
		var m = now.getMonth() + 1;
		
		switch (m) {
		case 12:
		case 1:
		case 2:
			MgSnow.start();
			break;
		}
	};

	$(function() {
		refresh_time(); setInterval(refresh_time, 1000);
		refresh_image();
		refresh_snow();
	});
};
