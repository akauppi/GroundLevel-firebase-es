# Approach

## Isolating the `package.json`s

In many web projects, one sees the same `package.json` being used for multiple things.

This is not cool. Putting different kinds of beans in the same bag makes maintenance and understanding the code (same thing?) difficult.

We've tried to separate `package.json`s so that one only has a single role (eg. developing of the front end code; developing the back-end; managing deployments).

This means more `package.json`s and sometimes more tediousness when one needs to update a dependency in multiple places. But the alternative would be worse.

In practise, separating `package.json`s can be done by placing subprojects in the `packages` subproject.

<!--
tbd. add more details - about 'file:' references etc.
-->

