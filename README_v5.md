# JobMate Prototype v5

## New in v5
- Added Company Portal data model for my page management
- Added v5 Company Hub detail mock page with portal and login ID sections
- Documented security policy for login IDs and passwords
- Clarified that MVP stores login IDs but not passwords

## Files added
- `types/index-v5.ts`
- `lib/mock-data-v5.ts`
- `app/companies/[id]/page-v5.tsx`
- `PRODUCT_SPEC_v5.md`

## Recommended next steps
1. Replace the current company detail page with the v5 version.
2. Add edit forms for portal URL, recruiting URL, and login ID.
3. Connect Firestore persistence for the `portal` object.
4. Surface `loginId` suggestions in the Chrome extension when a matching company portal URL is open.
