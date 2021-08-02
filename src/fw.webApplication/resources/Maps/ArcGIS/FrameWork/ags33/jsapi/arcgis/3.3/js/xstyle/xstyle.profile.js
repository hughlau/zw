var profile = (function(){
  var testResourceRe = /\/test\//,

    copyOnly = function(filename, mid){
      var list = {
        "xstyle/package.json":1,
        "xstyle/xstyle.profile":1
      };
      
      return (mid in list);
    };

  return {
    resourceTags:{
      test: function(filename, mid){
        return testResourceRe.test(mid);
      },

      copyOnly: function(filename, mid){
        return copyOnly(filename, mid);
      },

      amd: function(filename, mid){
        return !testResourceRe.test(mid) && !copyOnly(filename, mid) && /\.js$/.test(filename);
      }
    }
  };
})();
