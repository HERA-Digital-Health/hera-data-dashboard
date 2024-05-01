# HERA Data Dashboard

## Local development

This is a Vite SPA so development is really easy. All you need to do is:

1. `yarn install`
2. `yarn dev`

## How do I add a new dashboard?

1. Go to the Dashboard Builder
2. Build your dashboard
3. Click on "Export Dashboard"
4. Save the JSON file in `src/dashboards` (name the JSON file however you'd like)
5. Add the JSON filename to `src/config/Constants.ts`
6. Rebuild and redeploy the app

## How do I add new indicators?

To do

## To do

- [ ] Store and load dashboards in a database instead of hardcoding JSONs
- [ ] Manage dashboards via CRUD API endpoints in the Django backend
- [ ] Add scripts to upgrade/downgrade dashboards when their schema changes
- [ ] Deploy to production and add documentation to Readme on how to deploy
- [ ] In DashboardViewer mode, show an error if a visualization tries to load without a valid QuerySpec
- [ ] Check for dashboard slug uniqueness before saving

## Stack

To do

## Code Architecture

To do
