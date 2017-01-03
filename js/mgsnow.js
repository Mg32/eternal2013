
// エターナル2013年
// mgsnow.js

var MgSnow = {};

new function() {
	var _count = 100;
	var _pobj = [];
	var _pd = [{}];

	MgSnow._width = 0;
	MgSnow._height = 0;

	// 雪を降らせる
	MgSnow.start = function() {
		onresize(); $(window).resize = onresize;

		for (var i = 0; i < _count; i++) {
			create(i);
		}
		move(); setInterval(move, 40);
	};

	// イベント: リサイズ
	function onresize() {
		MgSnow._width = $(window).width();
		MgSnow._height = $(window).height();
	};

	// 雪パーティクル作成
	function create(id) {
		var sz = Math.floor(Math.random() * 10 + 1);
		var d = Math.floor(Math.random() * 8 + 1);
		var r = Math.random() * Math.PI / 18;

		var p = $("<div>").attr("class", "particle").css({
			"z-index": d, width: sz + "px", height: sz + "px"
		});

		_pobj[id] = p;
		_pd[id] = {px: 0, py: 0, size: sz, dist: d, rad: r, phase: 0};
		reset(id);

		$("#snow").append(p);
	};

	// 雪: 移動
	function move() {
		for (var i = 0; i < _count; i++) {
			fall(i);
			if (_pd[i].py > MgSnow._height) {
				reset(i);
			}
		}
	};

	// 雪: 位置初期化
	function reset(id) {
		_pd[id].px = Math.floor(Math.random() * (MgSnow._width + 40) - 20);
		_pd[id].py = -Math.floor(Math.random() * MgSnow._height);

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
