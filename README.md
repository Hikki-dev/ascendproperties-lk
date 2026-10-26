# Ascend Properties

[![Checks](https://github.com/Hikki-dev/ascendproperties-lk/actions/workflows/checks.yml/badge.svg)](https://github.com/Hikki-dev/ascendproperties-lk/actions/workflows/checks.yml)
[![Live site](https://img.shields.io/badge/live-site-1D4ED8)](https://ascendproperties-lk.makkoacknowledgesstress.workers.dev)
[![Licence: MIT](https://img.shields.io/github/license/Hikki-dev/ascendproperties-lk)](LICENSE)
![Astro](https://img.shields.io/badge/Astro-server%20rendered-BC52EE?logo=astro&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers%20%7C%20D1%20%7C%20R2-F6821F?logo=cloudflare&logoColor=white)
![React](https://img.shields.io/badge/React-islands-61DAFB?logo=react&logoColor=black)

A website for selling land, houses and apartments in Sri Lanka. It comes with a simple admin that staff can use without touching code, and a private page where customers follow what they have bought.

<p align="center"><img src="docs/images/hero.jpg" alt="The home page on a desktop with listings and real photos, and a listing on a phone" width="100%"></p>

<p align="center"><sub>The site on a desktop and on a phone. <b><a href="https://ascendproperties-lk.makkoacknowledgesstress.workers.dev">Open the live site</a></b> and follow along. The listings are samples. The photos are real ones from Wikimedia Commons, credited in <a href="docs/Photo%20credits.md">Photo credits</a>.</sub></p>

A buyer picks a place and a budget, and sees the real price per perch and the payment plan. Staff add listings from their phone. A customer signs in and sees their balance, receipts and documents.

You do not need to know how any of it works. The screens use plain words and big buttons, and nearly every action ends in WhatsApp, which is how people here already talk to an agent.

## On this page

* [What you get](#what-you-get): who it is for, and what it is built with
* [How everything fits together](#how-everything-fits-together)
* [Try it first](#try-it-first)
* [The story, step by step](#the-story-step-by-step)
  * [Part 1: The buyer](#part-1-the-buyer): [1. Home](#1-home), [2. Find a place](#2-find-a-place), [3. Open a listing](#3-open-a-listing), [4. The details](#4-the-details), [5. What it would cost](#5-what-it-would-cost), [6. Ask, call or visit](#6-ask-call-or-visit), [7. The flyer](#7-the-flyer), [8. On a phone](#8-on-a-phone), [9. Sell your land](#9-sell-your-land)
  * [Part 2: The staff](#part-2-the-staff): [10. Sign in](#10-sign-in), [11. Today](#11-today), [12. Listings](#12-listings), [13. Add or edit a listing](#13-add-or-edit-a-listing), [14. Add from WhatsApp](#14-add-from-whatsapp), [15. Inquiries](#15-inquiries), [16. Sellers](#16-sellers), [17. Banners and ads](#17-banners-and-ads), [18. Contact and advisor](#18-contact-and-advisor), [19. My password](#19-my-password)
  * [Part 3: The customer](#part-3-the-customer): [20. Customers and purchases](#20-customers-and-purchases), [21. One customer](#21-one-customer), [22. The customer portal](#22-the-customer-portal), [23. Support tickets](#23-support-tickets)
* [Run it yourself](#run-it-yourself)
* [Put it online](#put-it-online)
* [Your privacy and safety](#your-privacy-and-safety)
* [Help and more reading](#help-and-more-reading)
* [Legal and responsibility](#legal-and-responsibility)

## What you get

One site, three kinds of people. Each sees only what they need.

| Who | What they do |
|---|---|
| **Buyers** | Search by type, place and budget, see the price per perch, in lakhs and as a monthly instalment, look at photos and plots, work out a payment plan, and ask on WhatsApp or call, with the listing name already in the message |
| **Staff** | Add, edit, hide or mark a listing sold, from a phone. Paste a WhatsApp post, or a whole exported chat, and get hidden draft listings back. Answer enquiries, run banners and ads, and look after customers |
| **Customers** | Sign in to see their purchases, payments, receipts, documents, the handover stage and the next instalment, and open support tickets |

It also has a form for owners who want to sell their land, a printable flyer for each listing, and sharing on WhatsApp. It is modelled on how primelands.lk works, and [the research](docs/PRIMELANDS-RESEARCH.md) shows the evidence.

### What it is built with

| Tool | What it does here |
|---|---|
| **Astro** | Draws the pages on the server, so they load fast and show up in search |
| **React** | Only for the few interactive parts: the photo uploader, the plots table, the payment calculator and the chat importer |
| **Cloudflare Workers** | Runs the whole site, with no separate server |
| **Cloudflare D1** | The database (SQLite): listings, enquiries, customers, payments |
| **Cloudflare R2** | Stores photos, brochures, receipts and documents |

All of it has a free tier that is enough for a growing agency.

## How everything fits together

There is one app and no separate API server. Buyers, customers and staff all use the same Worker. It keeps data in D1, files in R2, and sends people to WhatsApp with links.

<p align="center"><a href="docs/images/how-it-fits.svg"><img src="docs/images/how-it-fits.svg" alt="Diagram: buyers, customers and staff all use one Cloudflare Worker running Astro. It keeps data in D1, pictures and files in R2, and sends people to WhatsApp with links" width="100%"></a></p>

After a sale, the customer's journey looks like this:

<p align="center"><a href="docs/images/after-sales.svg"><img src="docs/images/after-sales.svg" alt="Diagram: an enquiry, a purchase added by staff, payments with receipts, documents, and handover in five stages" width="100%"></a></p>

The longer story is in [How it works](docs/How%20it%20works.md).

## Try it first

**[Open the live site](https://ascendproperties-lk.makkoacknowledgesstress.workers.dev).** It is the public site running on Cloudflare with four listings. The listings are made up, and the photos are real ones credited in [Photo credits](docs/Photo%20credits.md).

* Browse the listings, filter them, open one and try the buttons. The WhatsApp and call buttons open your phone's apps.
* The admin (`/admin`) and the customer portal (`/portal`) need a login, so they are not open to visitors. The story below shows every screen of them.
* Do not put anything private in the forms. This is a portfolio project.

## The story, step by step

Every picture below was taken from a copy of the site running on a computer, filled with the sample data in `sample-data/` (see [Run it yourself](#run-it-yourself)), at twice the normal sharpness. The live site looks the same but has fewer listings. The names in the pictures, such as Nimali Perera, are made up. Click a picture to see it full size. The same walk, with fewer words, is in [Getting started](docs/Getting%20started.md).

### Part 1: The buyer

It starts with someone who wants to buy a plot near Galle.

#### 1. Home

<a href="docs/images/buyer-home.jpg"><img src="docs/images/buyer-home.jpg" alt="The home page: a search for land by place and budget, with shortcut buttons" width="100%"></a>

The home page asks one question: *what kind of place are you looking for?* Choose what you want (land, a house or an apartment), where, and your budget per perch, then press **Show results**. The button already says how many results there are. Or tap a shortcut: **Ready to build**, **Near Colombo**, **Beach and waterfront** or **Instalments, no bank loan**.

<a href="docs/images/buyer-new.jpg"><img src="docs/images/buyer-new.jpg" alt="New this week: four listing cards, each with a photo, the place, the price and a monthly instalment" width="100%"></a>

Under the search, **New this week** lists the newest listings. Each card has a photo, the place, the price, the key facts and the monthly instalment, with **Ask on WhatsApp** and **View details**. **Save for later** keeps a listing for the visitor.

<a href="docs/images/buyer-advisor.jpg"><img src="docs/images/buyer-advisor.jpg" alt="A card saying Not sure what to pick? Message Adnan, with the advisor's photo and a Chat on WhatsApp button" width="100%"></a>

For people who do not want to search, a card offers to message the advisor on WhatsApp: tell them your budget and the area, and they send two or three plots that fit. The advisor's name, photo and hours come from the admin ([step 18](#18-contact-and-advisor)).

<a href="docs/images/buyer-how.jpg"><img src="docs/images/buyer-how.jpg" alt="How buying with us works: visit the plot, reserve it, pay monthly, get your deed" width="100%"></a>

The last part of the home page explains the four steps of buying in plain words: visit the plot, reserve it with a small deposit, pay monthly, and get your deed.

#### 2. Find a place

<a href="docs/images/buyer-lands.jpg"><img src="docs/images/buyer-lands.jpg" alt="Land results with filters for type, district, maximum price, keyword and must-have features, and three listings with photos" width="100%"></a>

The results show the price per perch, the same price in lakhs, and the monthly instalment, so a buyer can compare plots without a calculator. The filters are the things people really ask about: the type of land, the district, a maximum price per perch, a keyword, and **must have** boxes for a clear deed, electricity, water and an instalment plan. Results can be sorted by lowest price.

<a href="docs/images/buyer-houses.jpg"><img src="docs/images/buyer-houses.jpg" alt="The houses page with one house, its photo, bedrooms, plot size and total price" width="100%"></a>

Houses and apartments work the same way. A house card shows the bedrooms and the plot size, and the total price, here **LKR 22,500,000**.

<a href="docs/images/buyer-apartments.jpg"><img src="docs/images/buyer-apartments.jpg" alt="The apartments page with one apartment, its photo, bedrooms, size and total price" width="100%"></a>

An apartment card shows the bedrooms and the floor size, for example **3 bedrooms, 1,350 sq ft**.

#### 3. Open a listing

<a href="docs/images/buyer-listing.jpg"><img src="docs/images/buyer-listing.jpg" alt="A listing: a large photo, thumbnails, the title, price, highlights and the advisor card with WhatsApp buttons" width="100%"></a>

A listing opens with its photos, the price, short highlights and the key facts: the plot size, water, electricity and the road. The second thumbnail here is a drawn plot plan, not a photo. On the right, the advisor card has the advisor's name and reply hours, and a message that is already written for you, with the listing and its price in it.

#### 4. The details

<a href="docs/images/buyer-about.jpg"><img src="docs/images/buyer-about.jpg" alt="About this land: a short description" width="100%"></a>

**About this land** is a few simple sentences from the agency.

<a href="docs/images/buyer-plots.jpg"><img src="docs/images/buyer-plots.jpg" alt="Plots and prices: six numbered plots, one sold, one reserved and four available" width="100%"></a>

A listing can have a table of numbered plots. Each has its size in perches, its price, and a status. A **sold** plot is crossed out. A **reserved** one says **Reserved: ask**. An available one has **Ask about this**, which opens WhatsApp about that plot.

<a href="docs/images/buyer-nearby.jpg"><img src="docs/images/buyer-nearby.jpg" alt="What's nearby: places and how many minutes away they are" width="100%"></a>

**What's nearby** lists the places a buyer cares about and how far they are, such as the junction, the town and the beach.

#### 5. What it would cost

<a href="docs/images/buyer-pay.jpg"><img src="docs/images/buyer-pay.jpg" alt="What you'd pay: plot size, months to pay over, and the total, the deposit and the amount per month" width="100%"></a>

This small calculator answers the question buyers ask first. Type the size of the plot you want and the number of months, and it shows the **total**, the **deposit** and the amount **per month**. The deposit and the number of months it starts with are set by staff for each listing ([step 13](#13-add-or-edit-a-listing)).

#### 6. Ask, call or visit

The advisor card from step 3 has four things a buyer can do:

* **Send this on WhatsApp** opens WhatsApp with a message that already names the listing and its price.
* **Call** dials the agency.
* **Pick a day**, then **Ask for a site visit**, opens WhatsApp with a message asking to visit on that day.
* **Share with family on WhatsApp** sends the listing to someone else.

<a href="docs/images/buyer-callback.jpg"><img src="docs/images/buyer-callback.jpg" alt="Prefer a call back? A form with a name and a phone number and a Call me back button" width="100%"></a>

Lower on the page, **Prefer a call back?** takes a name and a phone number. The staff see it under **Inquiries** ([step 15](#15-inquiries)).

<a href="docs/images/buyer-similar.jpg"><img src="docs/images/buyer-similar.jpg" alt="You might also like: two more listings with photos" width="100%"></a>

At the bottom, **You might also like** shows more listings, so a buyer who is not sure about this one keeps looking.

#### 7. The flyer

<a href="docs/images/buyer-flyer.jpg"><img src="docs/images/buyer-flyer.jpg" alt="A one-page flyer for a listing with its photos, price, highlights, nearby places and plots table" width="100%"></a>

**Print or save as a PDF flyer** opens a clean one-page version of the listing: photos, price, highlights, what is nearby and the plots table. It is made to be printed or sent as a PDF.

#### 8. On a phone

Most buyers will be on a phone. Here is the whole journey on one, left to right. Click a picture to see it full size.

<table>
<tr>
<td valign="top" width="25%"><a href="docs/images/phone-home.jpg"><img src="docs/images/phone-home.jpg" alt="The home page on a phone with the search and shortcut buttons" width="185"></a></td>
<td valign="top" width="25%"><a href="docs/images/phone-lands.jpg"><img src="docs/images/phone-lands.jpg" alt="Land results on a phone with a Filters button and a listing with a photo" width="185"></a></td>
<td valign="top" width="25%"><a href="docs/images/phone-listing.jpg"><img src="docs/images/phone-listing.jpg" alt="A listing on a phone with a photo, the thumbnails, the title and the price" width="185"></a></td>
<td valign="top" width="25%"><a href="docs/images/phone-listing-2.jpg"><img src="docs/images/phone-listing-2.jpg" alt="Further down a listing on a phone: the description and the plots table" width="185"></a></td>
</tr>
<tr>
<td align="center" valign="top"><b>1</b><br><sub>Home</sub></td>
<td align="center" valign="top"><b>2</b><br><sub>Results</sub></td>
<td align="center" valign="top"><b>3</b><br><sub>A listing</sub></td>
<td align="center" valign="top"><b>4</b><br><sub>Plots and prices</sub></td>
</tr>
</table>

<table>
<tr>
<td valign="top" width="25%"><a href="docs/images/phone-portal.jpg"><img src="docs/images/phone-portal.jpg" alt="The customer portal on a phone with the total, paid, balance and next instalment" width="185"></a></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td align="center" valign="top"><b>5</b><br><sub>Customer portal</sub></td>
<td></td>
<td></td>
<td></td>
</tr>
</table>

**1. Home.** The menu folds into one button, and the search and shortcuts fill the screen. **2. Results.** The filters fold away behind **Filters**, so the listings come first. **3. A listing.** The photo, the price and the highlights, with a **WhatsApp** and **Call** bar that stays at the bottom, so the next step is always one tap away. **4. Plots and prices.** Further down, the plots table with its **Ask about this** buttons. **5. Customer portal.** A customer sees the same numbers on a phone as on a desktop ([step 22](#22-the-customer-portal)).

#### 9. Sell your land

<a href="docs/images/buyer-sell.jpg"><img src="docs/images/buyer-sell.jpg" alt="The sell your land form with contact information, land information and a photo box" width="100%"></a>

Owners can send their land to the agency. They give their name, mobile and email, then the address, town, size in perches, expected price and a description, and add up to five photos. The staff see it under **Sellers** ([step 16](#16-sellers)).

<a href="docs/images/buyer-contact.jpg"><img src="docs/images/buyer-contact.jpg" alt="The contact page" width="100%"></a>

The **Contact** page is a short form (name, phone, email and a message) for everything else. It arrives under **Inquiries**, the same as a call-back request.

That is the buyer's whole journey. Now the people behind the screen.

### Part 2: The staff

The staff have no code to touch. They sign in and see their own pages. Everything below is in plain words, on purpose.

#### 10. Sign in

<a href="docs/images/sign-in.jpg"><img src="docs/images/sign-in.jpg" alt="The sign-in page with an email and a password" width="100%"></a>

Staff and customers use the same sign-in page. An admin is sent to the admin, and a customer to their portal. Sessions last 14 days.

#### 11. Today

<a href="docs/images/admin-today.jpg"><img src="docs/images/admin-today.jpg" alt="Admin home: buyers who asked about a property, people who want to sell, and three steps to add a listing" width="100%"></a>

The admin opens on **Today**: who has asked about a property, who wants to sell, and which customers have an open support question. Buyers and sellers have **Reply on WhatsApp** and **Call** buttons, and **Done** when it has been dealt with. A customer question has an **Answer** button. At the bottom, three short steps remind staff how to add a listing. The menu on the left groups everything into **Website**, **Leads**, **After-sales** and **Account**.

#### 12. Listings

<a href="docs/images/admin-listings.jpg"><img src="docs/images/admin-listings.jpg" alt="The listings table with a photo, title, type, district, price and status for each listing" width="100%"></a>

All the listings in one table, with a photo, the type, the district, the price, and whether each is **Live**. A star marks the featured ones. **Edit** opens a listing, **View** shows it on the website, **Add from WhatsApp** and **Add listing** are at the top.

#### 13. Add or edit a listing

A listing is one page with numbered boxes, from the most important to the least. Staff fill in as much as they like. It is on the website as soon as they save.

<a href="docs/images/admin-edit-1-basics.jpg"><img src="docs/images/admin-edit-1-basics.jpg" alt="1. The basics: the name of the project, what you are selling, the district, the town, the price and how the price is counted" width="100%"></a>

**1. The basics.** The name, what is being sold, the district, the town, the price, and how the price is counted (here, per perch upwards).

<a href="docs/images/admin-edit-2-photos.jpg"><img src="docs/images/admin-edit-2-photos.jpg" alt="2. Photos and video: a drop area for photos, the photos with a cover label, and a video link" width="100%"></a>

**2. Photos and video.** Tap the box and choose photos from the phone or the computer. They are made smaller before they are uploaded, so the site stays fast. The first photo is the cover, and **Make cover** changes it. A video link is optional (YouTube, Facebook or TikTok).

<a href="docs/images/admin-edit-3-tell.jpg"><img src="docs/images/admin-edit-3-tell.jpg" alt="3. Tell buyers about it: the size, how far from town, and a few simple sentences" width="100%"></a>

**3. Tell buyers about it.** The size, how far it is from town, and a few simple sentences.

<a href="docs/images/admin-edit-4-special.jpg"><img src="docs/images/admin-edit-4-special.jpg" alt="4. What makes it special: top reasons to buy and what is nearby, one per line" width="100%"></a>

**4. What makes it special?** The top reasons to buy, one per line, and what is nearby, one per line, with the distance. These become the highlights and the **What's nearby** list in steps 3 and 4.

<a href="docs/images/admin-edit-5-comes.jpg"><img src="docs/images/admin-edit-5-comes.jpg" alt="5. What comes with it: tick boxes for papers, services, and for houses and apartments" width="100%"></a>

**5. What comes with it.** Tick boxes for the papers (clear deed, survey plan, approved plan), the services (electricity, water, tarred road) and, for houses and apartments, things like parking, a garden, a lift, a pool, a gym and security. These feed the **must have** filters in step 2.

<a href="docs/images/admin-edit-6-plots.jpg"><img src="docs/images/admin-edit-6-plots.jpg" alt="6. Plots and prices: a row for each numbered plot with its size, price and status" width="100%"></a>

**6. Plots and prices.** One row for each numbered plot: its name, size in perches, price and status (available, reserved or sold). **+ Add a plot** adds a row.

<a href="docs/images/admin-edit-7-plan.jpg"><img src="docs/images/admin-edit-7-plan.jpg" alt="7. Pay-in-instalments plan: the deposit as a percentage and the number of months" width="100%"></a>

**7. Pay-in-instalments plan.** The deposit as a percentage of the price, and the number of months to pay the rest. Buyers see the monthly amount worked out for them, here and in the calculator in step 5.

<a href="docs/images/admin-edit-8-more.jpg"><img src="docs/images/admin-edit-8-more.jpg" alt="8. More options: the type of land, a Google Maps link, a brochure, a home page option and a publish date" width="100%"></a>

**8. More options.** The type of land (it feeds the filter), a Google Maps link, a brochure (PDF), whether to show the listing near the top of the home page, and a publish date.

<p align="center"><a href="docs/images/admin-edit-visible.jpg"><img src="docs/images/admin-edit-visible.jpg" alt="Is it on the website? Yes show it, Sold out or No hide it, with a Save button" width="38%"></a></p>

Beside the form, **Is it on the website?** is a simple choice: **Yes, show it**, **Sold out** (shown as sold, with no enquiries) or **No, hide it** (only staff can see it). **Save** publishes the change, and **See it on the website** opens the page. A listing can be deleted from the same box.

#### 14. Add from WhatsApp

<a href="docs/images/admin-import.jpg"><img src="docs/images/admin-import.jpg" alt="Add listings from WhatsApp: option one is a whole chat export, option two is pasting one message" width="100%"></a>

This is the time-saver. **Option 1** takes a whole exported WhatsApp chat (the `.zip` file, with media): each listing it finds becomes a **hidden draft** with its photos. **Option 2** takes one pasted message. The district, the size in perches, the price and the papers are read from the text. Staff check each draft, fix what is wrong and publish it. Nothing goes live until they say so.

<a href="docs/images/admin-import-open.jpg"><img src="docs/images/admin-import-open.jpg" alt="The same page with the guide on how to export a chat opened" width="100%"></a>

A short guide on the page, **How do I export a chat?**, explains how to make the file.

#### 15. Inquiries

<a href="docs/images/admin-inquiries.jpg"><img src="docs/images/admin-inquiries.jpg" alt="Inquiries with the buyer's name, the listing, the message and buttons to reply on WhatsApp, call or email, and a status" width="100%"></a>

Questions from the website arrive here, each with the listing it was about. Reply on WhatsApp, call or email, and set the status, for example **New**, **Replied** or **Closed**. **Download as Excel (CSV)** saves them all.

#### 16. Sellers

<a href="docs/images/admin-sellers.jpg"><img src="docs/images/admin-sellers.jpg" alt="Sell-your-land leads with the owner's contact, place, size, expected price, description and a status" width="100%"></a>

The owners who filled in the form in step 9 appear here, with their phone, the place, the size, the price they hope for and their description. Their photos are for admins only. Each lead has a status, such as **new** or **contacted**.

#### 17. Banners and ads

<a href="docs/images/admin-banners.jpg"><img src="docs/images/admin-banners.jpg" alt="Banners and ads: two running banners and a form to add a new one with a slot, headline, button, dates and an image" width="100%"></a>

A banner can sit on the home page, as the hero or a strip, or as a sponsored slot between the listings. Each has a headline, some text, a button, an optional video or image, and start and end dates. Leave the dates empty to run it always. **Pause** hides one without deleting it.

#### 18. Contact and advisor

<a href="docs/images/admin-settings.jpg"><img src="docs/images/admin-settings.jpg" alt="Contact and advisor settings: the WhatsApp number, phone number, advisor name, title, reply hours, address, social pages and photo" width="100%"></a>

The WhatsApp number every button uses, the phone number shown to visitors, the advisor's name, title and reply hours, the office address, the social pages and the advisor's photo. A change shows on every page at once.

#### 19. My password

<a href="docs/images/admin-account.jpg"><img src="docs/images/admin-account.jpg" alt="The page to change the admin's password" width="100%"></a>

Staff can change their own password here. Use a long one you do not use anywhere else.

The staff's work is finished once a buyer says yes. Then the third person in the story arrives.

### Part 3: The customer

After a sale the customer gets a login, and the agency keeps the records.

#### 20. Customers and purchases

<a href="docs/images/admin-customers.jpg"><img src="docs/images/admin-customers.jpg" alt="Customers and purchases: a table of customers with their purchases and amounts paid, and a form to add a customer account" width="100%"></a>

Customers do not register themselves. Staff add a customer with a name, a phone number, an email (it is their login) and a temporary password of at least 8 characters. The table shows each customer's number of purchases and how much has been paid of the total.

#### 21. One customer

<a href="docs/images/admin-customer.jpg"><img src="docs/images/admin-customer.jpg" alt="One customer: the purchase with the handover stage, next instalment, payments with receipts and documents" width="100%"></a>

For each customer, staff add the purchase (the project, the plot and the total price) and then keep it up to date: record each **payment** with its date, description, amount and a receipt, upload **documents** such as the sale agreement, set the **handover stage** and the **next instalment due** date, and reset a forgotten password. The paid amount and the balance are worked out for them.

#### 22. The customer portal

<a href="docs/images/portal-top.jpg"><img src="docs/images/portal-top.jpg" alt="The customer portal: total price, paid, balance, next instalment, and handover progress in five stages" width="100%"></a>

The customer signs in and lands on their portal. They see only their own purchases. At the top are four numbers: the **total price**, what they have **paid**, the **balance** and the **next instalment**. Under them, **Handover progress** shows the five stages: Booking confirmed, Agreement signed, Payments in progress, Deed preparation and Handover.

<a href="docs/images/portal-pay.jpg"><img src="docs/images/portal-pay.jpg" alt="Payment history with the date, description, amount and receipt, and the documents list" width="100%"></a>

**Payment history** lists every payment with its receipt, where there is one, and **Documents** has the agreement and anything else staff have added. Receipts and documents are private: only their owner and an admin can open them.

#### 23. Support tickets

<a href="docs/images/portal-help.jpg"><img src="docs/images/portal-help.jpg" alt="Need help? A form with the purchase, a subject and a message, and the list of the customer's tickets" width="100%"></a>

If something is wrong, the customer opens a ticket from **Need help?**: they choose the purchase, write a subject and a message, and press **Open support ticket**. Their tickets are listed beside it.

<a href="docs/images/admin-tickets.jpg"><img src="docs/images/admin-tickets.jpg" alt="Support tickets: a list with the date, the customer, the subject and the status" width="100%"></a>

Staff see every ticket in a list, with its status.

<a href="docs/images/admin-ticket.jpg"><img src="docs/images/admin-ticket.jpg" alt="One ticket: the customer's message, the team's reply, a reply box and a Close ticket button" width="100%"></a>

Staff open a ticket, read it, reply and close it when it is solved.

<a href="docs/images/portal-ticket.jpg"><img src="docs/images/portal-ticket.jpg" alt="The same ticket in the customer's portal: their message and the team's reply, with a box to reply" width="100%"></a>

The customer sees the reply in their portal, and can answer from there. More in the [Customer portal](docs/Customer%20portal.md) guide.

The portal works on a phone too (picture 5 in [step 8](#8-on-a-phone)). That closes the loop: the staff's listings are what the buyer searched for in step 2. More in the [Admin guide](docs/Admin%20guide.md).

## Run it yourself

You need Node 22.22 or newer (Astro 7 requires it). There is nothing to set up in the cloud: Wrangler runs a local copy of D1 and R2 for you.

```bash
git clone https://github.com/Hikki-dev/ascendproperties-lk.git
cd ascendproperties-lk
npm install
cp .dev.vars.example .dev.vars     # set ADMIN_EMAIL and ADMIN_PASSWORD
npm run db:local                   # creates the local database and five sample listings
npm run dev                        # http://localhost:4321
```

Sign in at `/login` with the admin email and password from `.dev.vars`. The first admin is created the first time you sign in.

**Want it to look like the pictures above?** With `npm run dev` still running, in a second terminal:

```bash
bash sample-data/load.sh
```

That adds the sample photos, plots, highlights and nearby places, some enquiries and leads, and a customer with a purchase, three payments and a document. Sign in at `/portal` as `nimali@example.com` with the password `sample-customer-1`. Details are in [Sample data](docs/Sample%20data.md). It only touches your local copy.

`npm test` runs the unit tests (12 of them). `tests/smoke.sh` runs a longer end-to-end check against the dev server. Step by step, with fixes for the usual snags, is in [Getting started](docs/Getting%20started.md).

## Put it online

```bash
npx wrangler login
npx wrangler d1 create ascend-db          # paste the database_id into wrangler.jsonc
npx wrangler r2 bucket create ascend-media
npm run db:remote                         # apply migrations
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npm run deploy
```

Then in the Cloudflare dashboard add your domain, turn on **Bot Fight Mode** and a rate-limit rule for `/api/*` and `/login`, and, if you like, put `/admin*` behind **Cloudflare Access** (free for up to 50 users) for a second login. Spam protection with Turnstile is optional. All the steps, including the optional ones, are in [Deploying](docs/Deploying.md).

## Your privacy and safety

* Passwords are hashed with PBKDF2-SHA256 (100,000 rounds, a salt for every user). A session is a random 256-bit token in an `HttpOnly`, `SameSite=Lax` cookie, kept in D1, and it expires after 14 days.
* `/admin/*` needs an admin session and `/portal/*` needs a login. Forms from other websites are refused (Astro's origin check).
* Every SQL query is parameterised. Uploads are checked for type and size. Redirects, map links and video links are checked against exact hostnames.
* Receipts and customer documents are private. They are served only to their owner or an admin. Seller photos are for admins only.
* Public forms have a hidden honeypot field, and Cloudflare Turnstile turns on by itself once its secret exists.
* Security headers are set on every response.

To report a security problem, read [SECURITY.md](SECURITY.md).

## Help and more reading

| If you want to | Read |
|---|---|
| Run it step by step | [Getting started](docs/Getting%20started.md) |
| Use the admin | [Admin guide](docs/Admin%20guide.md) |
| See what customers see | [Customer portal](docs/Customer%20portal.md) |
| Understand how it is built | [How it works](docs/How%20it%20works.md) |
| Put it on Cloudflare | [Deploying](docs/Deploying.md) |
| Fill a local copy with sample data | [Sample data](docs/Sample%20data.md) |
| See who took the sample photos | [Photo credits](docs/Photo%20credits.md) |
| Fix a problem | [Fixing problems](docs/Fixing%20problems.md) |
| Find a quick answer | [Questions and answers](docs/FAQ.md) |
| See why it works like primelands.lk | [Research](docs/PRIMELANDS-RESEARCH.md) |
| Change the code | [Contributing](CONTRIBUTING.md) |
| See what changed | [Changes](CHANGELOG.md) |

### Where things live

```
migrations/      D1 schema            seed.sql   five sample listings (delete before launch)
src/lib/         db, auth, util, parse, chat      src/pages/   public site, /admin, /portal, /api
src/components/  ImageUploader, LoanCalc, LotsEditor, ChatImport (React islands), cards, ads
sample-data/            sample data, sample photos and the script that loads them
tests/           unit tests and an end-to-end smoke script
```

## Legal and responsibility

* Ascend Properties is a portfolio and learning project, not a real agency's site. The listings are made up.
* The code is released under the [MIT licence](LICENSE), as it is, with no promises. The sample photos keep their own licences, see [Photo credits](docs/Photo%20credits.md).
* [primelands.lk](docs/PRIMELANDS-RESEARCH.md) is studied only for how a site like this works. This project is not connected to it.
* Built with [Astro](https://astro.build), [React](https://react.dev) and [Cloudflare Workers](https://workers.cloudflare.com). Zip handling is by [fflate](https://github.com/101arrowz/fflate).
* Built by [Yusuf (Hikki-dev)](https://github.com/Hikki-dev).
