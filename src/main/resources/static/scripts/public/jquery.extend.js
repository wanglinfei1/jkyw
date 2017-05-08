$.fn.form = function(option) {
	console.info(this);
	console.info(option);
}

$.fn.serializeObject = function() {
	var serializeArray = this.serializeArray();
	var inobject = {};
	$(serializeArray).each(function() {
		if (inobject[this.name]) {
			inobject[this.name] = this.value || "";
		} else {
			inobject[this.name] = this.value || "";
		}
	});
	return inobject;
}

$.fn.serializeObjectArray = function() {
	var serializeArray = this.serializeArray();
	var inobject = {};
	var inobjectArray = [];
	$(serializeArray).each(function() {
		if (inobject[this.name] != undefined) {
			inobjectArray.push(inobject);
			inobject = {};
			inobject[this.name] = this.value || "";
		} else {
			inobject[this.name] = this.value || "";
		}
	});
	inobjectArray.push(inobject);
	return inobjectArray;
}





