Hackathon Project – Prototype
# BagsRadar

BagsRadar is a lightweight monitoring tool that checks if services in the Bags ecosystem are running correctly.
It periodically checks different services (wallet, trading, token APIs) and records incidents in a database.

The goal is to give developers or operators a quick overview of which services are failing and when.

## Problem

When multiple services run in an ecosystem, failures are not always visible immediately.
Developers may notice issues only after users report them.

This project tries to solve that by automatically checking service endpoints and logging outages.

## Solution

BagsRadar runs periodic checks on service endpoints and stores the results.

If a service fails to respond correctly, the system records an incident in the database.

These incidents can then be used to visualize downtime patterns.

## Tech Stack

* Next.js
* TypeScript
* Supabase
* Vercel (deployment)
* REST API monitoring

## Features

* Automated service health checks
* Incident logging
* Simple API endpoint for reports
* Dashboard-ready data format
* Lightweight monitoring approach

## API Example

GET /api/reports

Returns a summary of service failures in a given time window.

Example response:

{
"counts": {
"wallet": 0,
"trading": 0,
"token": 0
},
"windowMinutes": 30
}

## Future Improvements

* Real-time dashboard visualization
* Alert notifications (email/Slack)
* More services monitored
* Historical downtime analytics

## Author

Built during a hackathon project.
does not currently have Node.js installed, dependency installation and runtime verification need to be done once Node is available.
