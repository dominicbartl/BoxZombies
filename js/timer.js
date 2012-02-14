var Timer = function() {
    this._lastTick = (new Date()).getTime();
};
 
Timer.prototype = {
    getMilliSeconds: function() {
        var seconds = this._frameSpacing;
        if(isNaN(seconds)) {
            return 0;
        }
 
        return seconds;
    },
 
    tick: function() {
        var currentTick = (new Date()).getTime();
        this._frameSpacing = currentTick - this._lastTick;
        this._lastTick = currentTick;
        return this._frameSpacing/100;
    }
};