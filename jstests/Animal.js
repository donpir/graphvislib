function Animal() {
    this.name = "animal";
};

Animal.prototype = (function() {

    var hiddenvar = 5;

    var myfunc = function() {

    };

    return {
        constructor: Animal,

        sayHello: function() {
            console.log("Parent: " + this.name + " " + hiddenvar);
            myfunc();
        }
    };
})();


function Dog() {
    var animal = new Animal();
    animal.name = "dog";
    animal.prototype.sayHello = function() {
        console.log("Hi sub" + this.name);
    }
}

