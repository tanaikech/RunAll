# --- RunAll ---
# v1.0.0 Initial release.

`
/**
 * GitHub  https://github.com/tanaikech/RunAll<br>
 * Run RunAll<br>
 * @param {Object} Object Object
 * @return {Object} Return Object
 */
function Do(object) {
    return new RunAll().Do(object);
}
`

do(r=@)->
    class RunAll
        @name = "RunAll"


        constructor: () ->
            @projectId = ScriptApp.getScriptId()
            @url       = "https://script.googleapis.com/v1/scripts/" + @projectId + ":run"
            @at        = ScriptApp.getOAuthToken()


        Do: (p_) ->
            try
                reqs = p_.map (e) =>
                    muteHttpExceptions : true
                    url                : @url
                    method             : "post"
                    contentType        : "application/json"
                    headers            :
                        Authorization: "Bearer " + @at
                    payload            : JSON.stringify
                        function   : e.functionName
                        parameters : e.arguments
                        devMode    : true

                res = UrlFetchApp.fetchAll reqs

            catch e
                throw new Error e
            return res


    r.RunAll = RunAll
