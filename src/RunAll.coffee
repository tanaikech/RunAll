# --- RunAll ---
# v1.0.0 Initial release.
# v1.1.0 New method for achieving the parallel processing with Web Apps was added.
# v1.1.1 When the number of `0` was used as the argument, `null` was returned. This bug was removed.
# v1.1.2 When the access token and project ID are not included in the object, `getOAuthToken()` and `getScriptId()`. By this, an error is removed.

`
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
`

do(r=@)->
    class RunAll
        @name = "RunAll"


        constructor: () ->
            @url       = "https://script.googleapis.com/v1/scripts/"


        Do: (p_) ->
            try
                reqs = p_.map (e) =>
                    muteHttpExceptions : true
                    url                : @url + (e.projectId or ScriptApp.getScriptId()) + ":run"
                    method             : "post"
                    contentType        : "application/json"
                    headers            :
                        Authorization: "Bearer " + (e.accessToken or ScriptApp.getOAuthToken())
                    payload            : JSON.stringify
                        "function" : e.functionName
                        parameters : e.arguments
                        devMode    : true

                res = UrlFetchApp.fetchAll reqs

            catch err
                throw new Error err
            return res


        DoWebApps: (p_) ->
            try
                reqs = p_.map (e) =>
                    obj =
                        muteHttpExceptions : true
                        url                : e.webAppsURL
                        method             : "POST"
                        contentType        : "application/json"
                        payload            : JSON.stringify
                            function : e.functionName
                            arguments : e.arguments

                    if e.accessToken
                        obj.headers  =
                            Authorization: "Bearer " + e.accessToken
                    obj

                res = UrlFetchApp.fetchAll reqs

            catch err
                throw new Error err
            return res


        RunFunctionsByDoPost: (t_, e_) ->
            obj = JSON.parse e_.postData.contents
            f = obj.function or null
            a = if "arguments" of obj then obj.arguments else null
            result = {}
            if f
                if f of t_ and typeof t_[f] is "function"
                    result.FunctionName = f
                    result.Arguments = a
                    result.Result = t_[f](a)
                else
                    result.Error = "Function of '" + f + "' was not found."
            else
                result.Error = "Function name was not given."

            ContentService
            .createTextOutput JSON.stringify(result)
            .setMimeType ContentService.MimeType.JSON


    r.RunAll = RunAll
