/**
 * GitHub  https://github.com/tanaikech/RunAll<br>
 * Run RunAll<br>
 * @param {Object} Object Object
 * @return {Object} Return Object
 */
function Do(object) {
    return new RunAll().Do(object);
}
;
(function(r) {
  var RunAll;
  RunAll = (function() {
    RunAll.name = "RunAll";

    function RunAll() {
      this.projectId = ScriptApp.getScriptId();
      this.url = "https://script.googleapis.com/v1/scripts/" + this.projectId + ":run";
      this.at = ScriptApp.getOAuthToken();
    }

    RunAll.prototype.Do = function(p_) {
      var e, reqs, res;
      try {
        reqs = p_.map((function(_this) {
          return function(e) {
            return {
              muteHttpExceptions: true,
              url: _this.url,
              method: "post",
              contentType: "application/json",
              headers: {
                Authorization: "Bearer " + _this.at
              },
              payload: JSON.stringify({
                "function": e.functionName,
                parameters: e["arguments"],
                devMode: true
              })
            };
          };
        })(this));
        res = UrlFetchApp.fetchAll(reqs);
      } catch (error) {
        e = error;
        throw new Error(e);
      }
      return res;
    };

    return RunAll;

  })();
  return r.RunAll = RunAll;
})(this);
