
// エターナル2013年
// mgsnow.js

var MgSnow = {};

new function () {
	var _width = 0;
	var _height = 0;
	var _count = 0;
	var _pobj = [];
	var _pd = [{}];

	// 雪を降らせる
	MgSnow.start = function () {
		onresize(); $(window).resize(onresize);

		move(); setInterval(move, 40);
	};

	// イベント: リサイズ
	function onresize() {
		_width = $(window).width();
		_height = $(window).height();

		var prev = _count;

		// 画面サイズにあわせて雪の数を調整する
		_count = Math.floor(_width * _height * 1e-4);

		if (_count > prev) {
			// 雪を増やす
			for (var i = prev; i < _count; i++) { create(i); }
		}
		else if (_count < prev) {
			// 雪を減らす
			for (var i = _count - 1; i < prev; i++) { hide(i); }
		}
	};

	// 雪: 作成
	function create(id) {
		var sz = Math.floor(Math.random() * 10 + 1);
		var d = Math.floor(Math.random() * 8 + 1);
		var r = Math.random() * Math.PI / 18;

		var p = $("<div>").attr("class", "particle").css({
			"display": "block", "z-index": d,
			width: sz + "px", height: sz + "px"
		});

		_pobj[id] = p;
		_pd[id] = { px: 0, py: 0, size: sz, dist: d, rad: r, phase: 0 };
		reset(id);

		$("#snow").append(p);
	};

	// 雪: 隠す
	function hide(id) {
		_pobj[id].css({ "display": "none" });
	}

	// 雪: 移動
	function move() {
		for (var i = 0; i < _count; i++) {
			fall(i);
			if (_pd[i].py > _height) {
				reset(i);
			}
		}
	};

	// 雪: 位置初期化
	function reset(id) {
		_pd[id].px = Math.floor(Math.random() * (_width + 40) - 20);
		_pd[id].py = -Math.floor(Math.random() * _height);

		_pobj[id].css({
			left: _pd[id].px + "px", top: _pd[id].py + "px"
		});
	};

	// 雪: 下へ
	function fall(id) {
		var x = _pd[id].px + _pd[id].dist * Math.cos(_pd[id].phase);
		_pd[id].py += _pd[id].size;
		_pd[id].phase += _pd[id].rad;

		_pobj[id].css({
			left: x + "px", top: _pd[id].py + "px"
		});
	};
};
