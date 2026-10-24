# Customer portal

The portal is the private page where a customer follows what they have bought. It is at `/portal`.

<p align="center"><a href="images/portal.jpg"><img src="images/portal.jpg" alt="The customer portal" width="100%"></a></p>

## Signing in

Customers do not register themselves. The agency creates the account (see the [Admin guide](Admin%20guide.md#after-sales-customers-and-purchases)) and gives the customer their email and a temporary password. They sign in at `/login`, and are sent to the portal.

## What a customer sees

For each purchase:

* **The project and plot** they bought.
* **The numbers:** the total price, what they have paid, the balance, and the next instalment date.
* **Handover progress** in five stages: Booking confirmed, Agreement signed, Payments in progress, Deed preparation and Handover.
* **Payment history:** the date, a description and the amount of every payment, with a link to the receipt where there is one.
* **Documents:** the agreement, the deed and anything else the agency has added.
* **Support:** a form to open a ticket about a purchase, and the list of their tickets with the replies.

## Privacy

* A customer sees only their own purchases.
* Receipts and documents are stored privately. A link only works for the customer it belongs to, and for an admin. For anyone else it answers **Forbidden**.
* Portal pages are never cached by the browser or Cloudflare.
* A session lasts 14 days.
