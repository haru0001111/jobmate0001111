# Deploy Checklist

## Firebase
- [ ] Firebase project created
- [ ] Authentication -> Google enabled
- [ ] Firestore created
- [ ] `.env.local` has Firebase Web config
- [ ] Admin credentials configured for server
- [ ] `JOBMATE_DATA_PROVIDER=firestore`

## Auth / API
- [ ] Login works in browser
- [ ] Bearer token is attached on protected API calls
- [ ] `GET /api/companies` returns only current user data
- [ ] `GET /api/essays` returns only current user data
- [ ] `GET /api/events` returns only current user data
- [ ] `GET /api/tasks` returns only current user data

## Firestore Rules
- [ ] rules deployed
- [ ] cross-user read blocked
- [ ] cross-user write blocked

## Chrome Extension
- [ ] extension loaded in Chrome
- [ ] base URL is set correctly
- [ ] ES field detection works on sample page
- [ ] loginId copy works
- [ ] loginId insert works on a sample login page

## Product
- [ ] Company Hub create / edit / read works
- [ ] ES create / edit / delete works
- [ ] companyId linked essays show in Company Hub
- [ ] tasks / events show correctly on dashboard

## Before public release
- [ ] remove demo fallbacks in production
- [ ] verify admin key handling
- [ ] verify extension permissions
- [ ] prepare privacy policy
- [ ] prepare terms of use
