# Security Policy

## Supported Versions

This is a personal portfolio project. Security fixes are applied to the latest version on the `main` branch.

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it privately.

**Do not open a public GitHub issue for security vulnerabilities.**

### Contact

Email: mhjn.varun@gmail.com

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

I will acknowledge your report within 48 hours and aim to release a fix within 7 days of confirmation.

## Scope

The following are **in scope**:
- Authentication bypass on the admin panel
- Injection vulnerabilities (XSS, SQLi, prompt injection with harmful output)
- Exposure of secrets or personal data via API responses
- Rate limiting bypass leading to LLM cost abuse

The following are **out of scope**:
- Vulnerabilities in third-party dependencies (report to the dependency maintainer)
- Denial-of-service via public endpoints (portfolio projects have limited resources)
- Missing security headers on non-sensitive static assets
