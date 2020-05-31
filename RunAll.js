/**
 * GitHub  https://github.com/tanaikech/RunAll<br>
 * Parallel processing the method of scripts.run of Google Apps Script API.<br>
 * @param {Object} Object Object
 * @return {Object} Return Object
 */
function Do(object) {
    return new RunAll().Do(object);
}

/**
 * Parallel processing Web Apps.<br>
 * @param {Object} Object Object
 * @return {Object} Return Object
 */
function DoWebApps(object) {
    return new RunAll().DoWebApps(object);
}

/**
 * Parallel processing Web Apps. Providing script for doPost().<br>
 * @param {Object} Object objectThis
 * @param {Object} Object objectParams
 * @return {Object} Return Object
 */
function RunFunctionsByDoPost(objectThis, objectParams) {
    return new RunAll().RunFunctionsByDoPost(objectThis, objectParams);
}
;
(function(r) {
  var RunAll;
  RunAll = (function() {
    RunAll.name = "RunAll";

    function RunAll() {
      this.url = "https://script.googleapis.com/v1/scripts/";
    }

    RunAll.prototype.Do = function(p_) {
      var err, reqs, res;
      try {
        reqs = p_.map((function(_this) {
          return function(e) {
            return {
              muteHttpExceptions: true,
              url: _this.url + (e.projectId || ScriptApp.getScriptId()) + ":run",
              method: "post",
              contentType: "application/json",
              headers: {
                Authorization: "Bearer " + (e.accessToken || ScriptApp.getOAuthToken())
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
        err = error;
        throw new Error(err);
      }
      return res;
    };

    RunAll.prototype.DoWebApps = function(p_) {
      var err, reqs, res;
      try {
        reqs = p_.map((function(_this) {
          return function(e) {
            var obj;
            obj = {
              muteHttpExceptions: true,
              url: e.webAppsURL,
              method: "POST",
              contentType: "application/json",
              payload: JSON.stringify({
                "function": e.functionName,
                "arguments": e["arguments"]
              })
            };
            if (e.accessToken) {
              obj.headers = {
                Authorization: "Bearer " + e.accessToken
              };
            }
            return obj;
          };
        })(this));
        res = UrlFetchApp.fetchAll(reqs);
      } catch (error) {
        err = error;
        throw new Error(err);
      }
      return res;
    };

    RunAll.prototype.RunFunctionsByDoPost = function(t_, e_) {
      var a, f, obj, result;
      obj = JSON.parse(e_.postData.contents);
      f = obj["function"] || null;
      a = "arguments" in obj ? obj["arguments"] : null;
      result = {};
      if (f) {
        if (f in t_ && typeof t_[f] === "function") {
          result.FunctionName = f;
          result.Arguments = a;
          result.Result = t_[f](a);
        } else {
          result.Error = "Function of '" + f + "' was not found.";
        }
      } else {
        result.Error = "Function name was not given.";
      }
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    };

    return RunAll;

  })();
  return r.RunAll = RunAll;
})(this);
