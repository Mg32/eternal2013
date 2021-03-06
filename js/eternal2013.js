﻿
// エターナル2013年
// eternal2013.js

new function() {
	var date_orig = new Date(2013, 12-1, 1);	// 初日

	function get_realmsec()  { return (new Date()).getTime(); }
	function get_realyear()  { return (new Date()).getFullYear(); }
	function get_realmonth() { return (new Date()).getMonth() + 1; }
	function get_realday()   { return (new Date()).getDate(); }
	function get_realhour()   { return ("0" + (new Date()).getHours()).slice(-2); }
	function get_realminute() { return ("0" + (new Date()).getMinutes()).slice(-2); }
	function get_realsecond() { return ("0" + (new Date()).getSeconds()).slice(-2); }

	function get_msec()  { return date_orig.getTime(); }
	function get_year()  { return date_orig.getFullYear(); }
	function get_month() { return date_orig.getMonth() + 1; }
	function get_day() {
		var msec2day = function (msec) {
			return Math.floor(msec/1000/60/60/24) + 1;
		};
		return msec2day(get_realmsec() - get_msec());
	}

	// Twitterボタンの更新
	function refresh_tweetbutton(y, m, d, real_y, real_m, real_d) {
		var text =
			"エターナル" + y + "年\n" +
			"本日は " + y + "年" + m + "月" + d + "日" + " です。\n";
		var html =
			"<a href=\"https://twitter.com/share\" " +
			"class=\"twitter-share-button\"{count} " +
			"data-url=\"https://mg32.github.io/eternal2013/\" " +
			"data-text=\"" + text + "\"data-lang=\"ja\">ツイート</a>\n";

		$("#twbtn").html(html);
		if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
			window.twttr.widgets.load();
		}
	}

	// 季節画像を表示・非表示する
	var season_opacity = 1.0;
	function season_showhide() {
		season_opacity = 1.0 - season_opacity;
		$(".season").animate({opacity: season_opacity}, 500);
	};

	// 鐘の音を鳴らす
	function season_playgong() {
		var audio = new Audio("audio/gong.ogg");
		audio.play();
	};

	// 季節画像の更新
	function refresh_season_images(y, m, d, real_y, real_m, real_d) {
		var filename = "";
		var onclick = null;

		switch (real_m) {
		case 7:
		case 8:
			// 7～8月は夏仕様
			filename = "natsu" + Math.floor(Math.random()*5) + ".png";
			onclick = season_showhide;
			break;

		case 12:
			if (real_d < 30) {					// 12月はクリスマス仕様
				filename = "xmas" + Math.round(Math.random()) + ".png";
				onclick = season_showhide;
			} else {							// 12/30, 12/31は大晦日仕様
				filename = "gong.png";
				onclick = season_playgong;
			}
			break;
		}

		// 画像ファイルを設定
		if (filename != "") {
			$(".seasonimg").each(function(i, elem) {
				$(elem).attr("src", "./image/" + filename);
			});
		}

		// 画像クリック時のイベントを設定
		$(".seasontop").unbind();
		if (onclick != null) {
			$(".seasontop").click(onclick);
		}
	};

	// 雪表示の更新
	function refresh_snow(y, m, d, real_y, real_m, real_d) {
		switch (real_m) {
		case 12:
		case 1:
		case 2:
			MgSnow.start();
			break;
		}
	};

	// 表示を更新する
	function refresh() {
		var y = get_year();
		var m = get_month();
		var d = get_day();
		var real_y = get_realyear();
		var real_m = get_realmonth();
		var real_d = get_realday();
		refresh_tweetbutton  (y, m, d, real_y, real_m, real_d);
		refresh_season_images(y, m, d, real_y, real_m, real_d);
		refresh_snow         (y, m, d, real_y, real_m, real_d);
	};

	// タイマのコールバック関数
	function on_timer() {
		var year   = get_year();
		var month  = get_month();
		var day    = get_day();
		var hour   = get_realhour();
		var minute = get_realminute();
		var second = get_realsecond();

		if ($("#day").text() != day) {	// 日付が変わった
			$("#year").html(year);
			$("#month").html(month);
			$("#day").html(day);
			refresh();
		}

		$("#hour").html(hour);
		$("#minute").html(minute);
		$("#second").html(second);
	};

	// タイマを開始する
	function start_timer() {
		on_timer(); setInterval(on_timer, 1000);
	}

	// エントリポイント
	$(function() {
		start_timer();
	});
};
