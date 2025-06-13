# Frontend UI/UX Issues

## Issue #1: Notification Panel Button Layout

**Problem:** The "Refresh" and "View all" buttons are overlapping or visually disconnected from the notifications content area (10 notifications shown).

**Screenshot:**

![Notification Panel Button Layout Issue](screenshots/notification-panel-issue.png)

**Expected Fix:** 
- Properly align buttons with adequate spacing
- Ensure buttons are visually connected to the notification content
- Maintain responsive design

**Component Location:** `src/components/profile/profileFormNav/nav/notifications/Notifications/Notifications.tsx`

---

## Issue #2: Notification Dropdown Auto-Close Behavior

**Problem:** When clicking "View all" in the notifications dropdown, the dropdown doesn't automatically close. Users expect the dropdown to close when navigating to the full notifications page, but it remains open creating a poor UX.

**Screenshot:**

![Notification Dropdown Auto-Close Issue](screenshots/notification-dropdown-issue.png)

**Expected Fix:**
- Automatically close notification dropdown when "View all" is clicked
- Ensure smooth transition to notifications page
- Maintain consistent dropdown behavior across all navigation actions

**Component Location:**
- Notification dropdown component (likely in header/layout area)
- "View all" button handler needs to trigger dropdown close

---

## Issue #5: Payment Notifications Pagination Stuck on Page 2 ✅ RESOLVED

**Problem:** When viewing payment notifications on the payments page, the pagination gets stuck on page 2. Users can navigate to page 2, but attempting to move forward or backward from page 2 doesn't work - the pagination controls become unresponsive. Additionally, page scrolling was blocked due to infinite re-renders.

**Screen Recording:**

![Payment Pagination Issue](screenshots/Screen%20Recording%202025-06-09%20at%2010.14.54.mov)

**Steps to Reproduce:**
1. Click "View all" in the payment notifications dropdown
2. Navigate to the payments page
3. Go to page 2 using pagination controls
4. Try to navigate to any other page (forward/backward)
5. Pagination controls become unresponsive
6. Page scrolling stops working after reload

**Root Cause:**
- Pagination state was being reset due to 204 responses always returning `currentPage: 1`
- Constant state syncing (every 1 second) was causing infinite re-renders that blocked the browser's main thread
- Global state management conflicts between dropdown and main page usage

**Solution Implemented:**
- Fixed pagination by preserving requested page number in 204 responses
- Disabled constant syncing on main payment notifications page to prevent scroll blocking
- Improved state synchronization to only update when data actually changes
- Reduced sync frequency from 1s to 5s for dropdown usage
- Enhanced pagination display for empty result sets

**Files Modified:**
- `src/hooks/usePaymentNotifications.ts` - Fixed pagination state management and syncing
- `src/components/payment/PaymentNotifications/PaymentNotifications.tsx` - Improved pagination display

**Status:** ✅ **RESOLVED** - Pagination now works correctly and page scrolling is restored

---

## Note

Hey, just play around with the panel a bit - I may have missed some other issues that need fixing.
