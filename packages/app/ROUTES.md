# Routes

|route / params|description|
|---|---|
|`/`|home page<br />Show projects, if authenticated.<br />Show intro if not authenticated.|
|&nbsp;&nbsp;`[final=<url>]`|Directed here if opened with an URL and not authenticated. Forwards to `url` if authentication happens.|
|`/projects/<project-id>`|project page|
