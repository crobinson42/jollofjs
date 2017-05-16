var objectEquals = function(obj1, obj2, fn) {

	var keys = Object.keys(obj1);

	arrayEquals(Object.keys(obj1), Object.keys(obj2), function(res) {

		if (!res) return fn(false);

		(function testNext(idx) {
			if (idx == keys.length) return fn(true);
			var key = keys[idx];
			equals(obj1[key], obj2[key], function(res) {
				if (!res) return fn(false);
				process.nextTick(function () {
					testNext(idx + 1);
				});
			});
		})(0);

	});

};

var arrayEquals = function(obj1, obj2, fn) {

	if (obj1.length != obj2.length) return fn(false);

	var o1 = obj1.sort();
	var o2 = obj2.sort();

	(function testNext(idx) {
		if (idx == o1.length) return fn(true);
		equals(o1[idx], o2[idx], function(res) {
			if (!res) return fn(false);
			process.nextTick(function() {
				testNext(idx+1);
			});
		});
	})(0);

};

var equals = function(obj1, obj2, fn) {

	if ((obj1 && !obj2) || (!obj1 && obj2)) return fn(false);
	if (typeof obj1 !== typeof obj2) return fn(false);

	if (typeof obj1 === 'object') return objectEquals(obj1, obj2, fn);
	if (typeof obj1 === 'array') return arrayEquals(obj1, obj2, fn);

	return fn(obj1 == obj2);

};

module.exports = function(arr, fn) {

	if (arr.length <= 1) return fn(true);

	(function testNext(idx1, idx2) {
		if (idx2 == arr.length) {
			idx1++;
			idx2 = idx1 + 1;
		}
		if (idx2 == arr.length) return fn(true);
		equals(arr[idx1], arr[idx2], function(res) {
			if (res) return fn(false);
			process.nextTick(function() {
				testNext(idx1, idx2 + 1);
			});
		});
	})(0, 1);

}

// We export equals so it can be unit tested.
module.exports.equals = equals;
