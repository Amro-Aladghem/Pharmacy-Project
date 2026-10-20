# Pharmacy Web API - Project Documentation

## Overview
A .NET 8 Web API for managing pharmacies, products, orders, customers, managers, admins and related requests (meetings, refunds). The backend exposes REST endpoints under `api/v1/*` and uses cookie-based AuthToken for authentication and role checks.

Tech stack
- .NET 8
- Entity Framework Core (DatabaseLayer project)
- Services project containing business logic
- DTOs project for request/response shapes

## Authentication & Roles
- Auth performed via an `AuthToken` cookie set on login endpoints.
- Roles (as seen in services/token usage):
  - Customer
  - Manager
  - Admin (pharmacy admin)
  - Pre_Registered
  - System Admin (SysAdmin)

Most controller actions validate the cookie token via TokenServices (CheckIfTokenCorrect / CreateNewToken).

## Controllers & Key Endpoints
Grouped by controller files in the API project. Only the main endpoints and purpose are listed.

1. api/v1/phproducts (PhProductController)
- POST /add - Add new pharmacy product (requires admin/manager token, images via form upload)
- PUT /update - Update product (admin/manager)
- DELETE /{ProductId}/delete - Delete product (admin/manager)
- GET / - List products (pagination + category, governorate, region filters)
- GET /{ProductId}/full-info - Get full product info
- GET /list - Get pharmacy product list by pharmacy id (paginated)
- GET /info/{ProductId} - Product details for a pharmacy
- GET /description/{ProductId} - Return product description
- GET /Get/Products/{PharmacyId} - For pharmacy users (admin/manager) to get products (auth required)
- GET /search - Search products by name
- GET /sysproducts/search - Search system products by name

2. api/v1/pharmacy (PharmacyController)
- POST /add/new - Manager adds a new pharmacy (image upload support)
- GET /general/info - Show general info (manager auth)
- GET /summary/info - Pharmacy summary (manager)
- GET /profile/info - Pharmacy profile info (public by id)
- PUT /update/generalInfo - Manager updates general info
- PUT /update/profileInfo - Manager updates profile (image upload)
- GET /vediocall/info/{PharmacyId} - Video/telemedicine call info
- PUT /vedioCall/Info/edit - Update video call info (manager)
- GET /delivery/info - Delivery info (manager auth)
- PUT /deliveryInfo/edit - Update delivery locations (manager)
- GET /show/{PharmacyId} - Show pharmacy public profile
- PUT /update/activatedelivery and /deactivatedelivery - Toggle delivery activation (manager)
- PUT /update/email/{PharmacyId} - Change pharmacy email (manager)
- PUT /update/pincode - Reset pharmacy PIN (manager)
- GET /callprice - Get video call price
- GET /nearest/{CustomerId} - Get nearest pharmacies to a customer
- GET /deliveryfees - Calculate delivery fees (requires customer token)
- GET /list and /list/have-meeting - Paginated pharmacies list with optional filters
- GET /balance - Get pharmacy balance (manager/admin token)

3. api/v1/ph-manager (PhManagerController)
- POST /login - Manager login (returns AuthToken cookie)
- POST /pre-register - Pre-register manager (creates pre-registered person & token)
- GET /{ManagerId}/logged/status - Check manager token validity
- POST /sendcode and /sendcode/logged - Send email verification codes
- POST /checkcode - Check verification code
- POST /register - Full manager registration using pre-registered token
- Admin management endpoints: pre-register admin, register admin, change activation, delete admin, list admins
- Admin logs/history viewing for manager
- Manager profile update endpoints

4. api/v1/PhAdmin (PhAdminController)
- POST /Login - Admin login (PIN-based)
- POST /Update - Update admin profile (image upload)
- POST /sendcode - Send verification code (change email)
- PUT /changemail - Change email after verification
- PUT /changepassword - Change password (admin)
- GET /Info - Get admin info

5. api/v1/customer (CustomerController)
- POST /Login - Customer login (sets AuthToken cookie)
- POST /PreRegister - Pre-register customer
- POST /Register - Register customer (finalize with profile image optional)
- PUT /ChangeEmail - Change email (customer)
- PUT /Update - Update customer profile
- GET /Show/{CustomerId} - Show customer info
- GET /logged/status/{CustomerId} - Check login token validity
- PUT /{CustomerId}/location/edit - Update customer location
- GET /{CustomerId}/has-order/{OrderId} - Get customer contact if order belongs to pharmacy user (admin/manager)

6. api/v1 (OrderController)
- Cart endpoints for logged-in customers: get cart, add cart, add items, clear cart, show cart
- Check customer location at checkout
- GET cart/{CartId}/check-out/info/{CustomerId} - Cart info for checkout (auth)
- Update cart item quantity, delete item
- Checkout flows:
  - POST /order/checkout/via-whatsapp/link - create temp order and send WhatsApp link
  - POST /order/checkout/on-delviery - checkout with OnDelivery payment
- GET /Order/history/{CustomerId} - Customer orders history
- GET /order/get/active/{CustomerId} - Get most active order
- GET /order/{OrderId}/details - Get order details (customer auth)
- GET /order/status/{OrderId} - Get order status
- PUT /order/cancel/{OrderId} - Cancel order (customer)
- Pharmacy-side endpoints to list active orders, count, get order items, update status (admin/manager) - including balance update on finish

7. api/v1/request (RequestController)
- Meeting request endpoints: get info, recent request, active request, history, cancel
- Admin/manager endpoints for active meeting requests, change status, start/end meeting (updates balances on end)
- Refund endpoints for meeting/order
- System endpoints to fetch default values (countries, governates, medical types), delivery types, payment methods, regions
- GET system/customer/{CustomerId}/pharmacy/{PharmacyId}/whatsapp/link - create temp request and return WhatsApp link

8. api/v1/SysAdmin (SysAdminController)
- POST /Login - System admin login (returns id; token usage indicated in services)

## Services (Services project)
Business logic lives in Services project. Key services discovered:
- TokenServices - create/check tokens, role enum
- FileUploadService - image upload handling
- PharmacyServices - pharmacy-related operations (profile, delivery, balance, nearest search, video call, etc.)
- ProductServices - manage pharmacy/system products, searching, listing, add/update/delete
- ManagerServices - manager registration, auth, logs
- AdminService - pharmacy admin management
- CustomerServices - customer registration, auth, update, location
- OrderServices - cart and order flow, checkout, temp orders, order history, status updates
- RequestServices - meeting/refund requests handling, meeting lifecycle
- EmailVerficationService - generate/send/check email verification codes
- SystemDefaultServices - default lookup data (countries, governates, regions, delivery & payment types, whatsapp link)
- SystemAdminServices - sysadmin auth
- PaymentServices - payment related enums and helpers
- MessagesServices - messaging (exists in Services)

Responsibilities generally follow controller actions and perform DB operations via DatabaseLayer.AppDbContext.

## Database (DatabaseLayer project)
Contains EF Core entities and migrations. Key entities:
- Pharmacy, PharmacyCurrency, PharmacyDeliveryLocation, PhPramacyProduct
- SysProduct, MedicalCategory, MedicalType
- Person, Customer, Manager, Admin, SystemAdmin, UserType
- Order, OrderItem, OrderStatus, OrderPayment
- Cart, CartItem
- Request entities: RequestMeeting, TempMeetingRequest, TempOrderRequest, RefundRequest, RefundType, RequestStatus, Meeting, MeetingPayment
- Token, EmailVerification
- Invoice, DeliveryFees, PaymentMethode
- Region, Governorate, Country
- SystemSetting, SystemAdmin logs, AdminLog, CustomerLog

Migrations exist for many schema changes (see DatabaseLayer/Migrations/*) including additions: cart/order changes, delivery, meeting flags, regions, pharmacy balance column, email verification changes, etc.

## DTOs
- DTOs project contains many request/response shapes (ProductDTOs, PharmacyDTOs, CustomerDTOs, ManagerDTOs, RequestDTOs, CartDTOs, OrderDTOs, AdminDTOs, SysAdminDTOs, ResultDTOs, DefaultValuesDTOs, etc.)
- Controllers rely on DTO validation (some manual checks) and model binding for form-data and file uploads.

## File uploads
- Endpoints accept IFormFile for images (products, pharmacies, person profiles). FileUploadService handles uploading and returns URL strings.

## Payment and Delivery
- Payment method enum includes OnDelivery and others. PaymentServices referenced for payment-related logic.
- Delivery fees computed via PharmacyServices/SystemDefaultServices; delivery activation toggles available on pharmacy profile.

## How to run (developer notes)
- Build solution (ensures DatabaseLayer, Services, DTOs, API compile)
- Configure appsettings (DB connection, cloudinary or storage settings used by FileUploadService if any)
- Apply migrations (EF Core) to target database
- Start Web API; endpoints available under /api/v1/

## Important implementation notes & conventions
- Authentication: cookie named `AuthToken`; many endpoints require token validation via TokenServices and also role-specific checks
- Role passed as query string in some endpoints (role=admin or manager) to switch checks
- Pagination uses DTOs (e.g. PaginatedPhProductDTO, PaginatedPharmacyListDTO) with LastId and Limit patterns
- Endpoints frequently return 200 OK with result objects or specific status codes for unauthorized/validation errors

---
File created: PROJECT_DOCUMENTATION.md

This document summarizes the API surface, services and database objects inferred from the codebase. Use it as a starting point for API reference or further automatic documentation generation.