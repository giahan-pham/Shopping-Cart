Note:
Record store application with the following features:
Feature to add for backend: file upload, save to backend media folder and save the file path to database, so that frontend can display the image for each record.
Frontend:
1. Record store page, guest can view records and search records but can't add to cart until they log in
+ when guest click add to cart, show a pop up to ask them to log in or register
+ redirect to Login and register page, or close the pop up and stay on the record store page if guest choose "continue browsing"
2. Login and register page
user able to change login and register, after that redirect to record store page
+ admin: redirect to admin record management page
3. Cart side panel: to ensure user experience, use side panel instead of separate cart page, so that user can easily view and edit their cart without leaving the record store page
4. Admin record management page: navigate to manage records page first when admin log in, and provide a link to navigate to record store page and a link to cart management page
5. optional: a dedicated cart viewing page for user for larger screen
6. Live search: a div above record listing and under navbar, with search bar for artist name or record name
7. Sorting: a dropdown to sort by price low to high, price high to low, release year new to old, release year old to new on the listing area
8. pop up when admin add or edit or delete record, to show success.
9. when record was updated/add, it first appear with a slightly different background color to indicate it's new or updated, and then fade back to normal background color after 5 seconds, so that user can easily notice the change. default sorting for admin is therefore by day added/updated

Note: for flexibility, when screen size is small, cart will still be a panel but span the whole screen, and when screen size is large, cart will be a side panel. This way we can ensure good user experience on both mobile and desktop devices.

admin dashboard navbar on smaller screen should have a hamburger menu to toggle the navigation links, and on larger screen, the navigation links should be displayed vertically on the left side of the screen. The main content area should adjust accordingly to ensure a responsive design.

when admin click on browse store, they are redirected to normal user store page, but on nav bar where there's "Hi, [username], normal user have "log out" link only, but admin have both "Admin Dashboard" and "log out" links. when admin click on "Admin Dashboard", they are redirected to admin dashboard page, and when they click on "log out", they are logged out and redirected to login page.

Note: when user add an item to cart, open the cart side panel to show item was added